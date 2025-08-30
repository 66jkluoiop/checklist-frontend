<script setup>
import { ref, shallowRef, onBeforeUnmount, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['update:modelValue'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref(props.modelValue)

// 模拟 ajax 异步获取内容
onMounted(() => {
  valueHtml.value = props.modelValue
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 编辑器配置
const editorConfig = {
  placeholder: '请输入任务描述...',
  autoFocus: false,
  scroll: true,
  MENU_CONF: {}
}

// 工具栏配置
const toolbarConfig = {
  toolbarKeys: [
    'bold',
    'italic',
    'underline',
    'through',
    'fontSize',
    'color',
    'bgColor',
    '|',
    'bulletedList',
    'numberedList',
    'todo',
    '|',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    '|',
    'insertLink',
    'insertTable',
    '|',
    'undo',
    'redo'
  ]
}

// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例
}

// 编辑器内容变化时的回调函数
const handleChange = (editor) => {
  emits('update:modelValue', editor.getHtml())
}
</script>

<template>
  <div class="rich-text-editor">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
    />
    <Editor
      style="height: 500px; overflow-y: hidden;"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      mode="default"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<style scoped>
.rich-text-editor {
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

:deep(.w-e-text-container) {
  background-color: var(--el-bg-color);
}

:deep(.w-e-toolbar) {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: var(--el-bg-color);
}

:deep(.w-e-bar-item button) {
  color: var(--el-text-color-primary);
}

:deep(.w-e-bar-item button:hover) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}
</style>
