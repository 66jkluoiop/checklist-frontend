<script setup>
import { ref } from 'vue'
import { useTaskStore } from '../stores/todoStore'
import { ElMessage } from 'element-plus'
import RichTextEditor from './RichTextEditor.vue'

const taskStore = useTaskStore()
const formVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)

// 格式化日期为 ISO 字符串的函数
const formatToISOString = (date) => {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`
}

const formData = ref({
  title: '',
  description: '',
  content: '',
  priority: 'medium',
  due_date: ''
})

const rules = {
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

const formRef = ref(null)

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.value = {
    title: '',
    description: '',
    content: '',
    priority: 'medium',
    due_date: ''
  }
  isEdit.value = false
  editId.value = null
}

// 提交表单
const emit = defineEmits(['update'])

const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // 创建一个新对象，处理日期格式
    const taskData = {
      ...formData.value,
      due_date: formData.value.due_date ? formatToISOString(new Date(formData.value.due_date)) : ''
    }

    if (isEdit.value) {
      await taskStore.updateTask(editId.value, taskData)
      ElMessage.success('任务更新成功')
      emit('update') // 通知父组件更新已完成
    } else {
      await taskStore.createTask(taskData)
      ElMessage.success('任务创建成功')
    }

    formVisible.value = false
    resetForm()
  } catch (error) {
    if (error.message) {
      ElMessage.error(isEdit.value ? '任务更新失败' : '任务创建失败')
    }
  }
}

// 取消创建
const cancelForm = () => {
  formVisible.value = false
  resetForm()
}

// 编辑任务
const editTask = (task) => {
  isEdit.value = true
  editId.value = task.id
  formData.value = {
    title: task.title,
    description: task.description || '',
    content: task.content || '',
    priority: task.priority,
    due_date: task.due_date || ''
  }
  formVisible.value = true
}

defineExpose({
  showForm: () => {
    formVisible.value = true
  },
  editTask
})
</script>

<template>
  <el-dialog
    v-model="formVisible"
    :title="isEdit ? '编辑任务' : '创建新任务'"
    width="1200px"
    :close-on-click-modal="false"
    @close="cancelForm"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      label-position="right"
      class="task-form"
    >
      <el-form-item label="任务标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入任务标题"
          :maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="任务描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入任务描述"
          :maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="任务内容">
        <RichTextEditor v-model="formData.content" />
      </el-form-item>

      <div class="form-footer-items">
        <el-form-item label="优先级">
          <el-select v-model="formData.priority" placeholder="请选择优先级" class="priority-select">
            <el-option label="低优先级" value="low">
              <template #default="{ option }">
                <el-tag size="small" type="info" effect="light">低优先级</el-tag>
              </template>
            </el-option>
            <el-option label="中优先级" value="medium">
              <template #default="{ option }">
                <el-tag size="small" type="warning" effect="light">中优先级</el-tag>
              </template>
            </el-option>
            <el-option label="高优先级" value="high">
              <template #default="{ option }">
                <el-tag size="small" type="danger" effect="light">高优先级</el-tag>
              </template>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="截止日期">
          <el-date-picker
            v-model="formData.due_date"
            type="date"
            placeholder="选择截止日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :shortcuts="[
              {
                text: '今天',
                value: new Date(),
              },
              {
                text: '明天',
                value: (() => {
                  const date = new Date()
                  date.setTime(date.getTime() + 3600 * 1000 * 24)
                  return date
                })(),
              },
              {
                text: '一周后',
                value: (() => {
                  const date = new Date()
                  date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                  return date
                })(),
              }
            ]"
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelForm" plain>取消</el-button>
        <el-button type="primary" @click="submitForm">
          {{ isEdit ? '保存修改' : '创建任务' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.task-form {
  padding: 20px 0;
}

.form-footer-items {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.form-footer-items :deep(.el-form-item) {
  margin-bottom: 0;
  flex: 1;
}

.priority-select {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
}

:deep(.el-dialog__body) {
  padding-top: 10px;
}

:deep(.el-select-dropdown__item) {
  padding: 0 12px;
}
</style>