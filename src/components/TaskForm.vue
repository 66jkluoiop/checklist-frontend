<script setup>
import { ref } from 'vue'
import { useTaskStore } from '../stores/todoStore'
import { ElMessage } from 'element-plus'

const taskStore = useTaskStore()
const formVisible = ref(false)

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
    priority: 'medium',
    due_date: ''
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // 创建一个新对象，处理日期格式
    const taskData = {
      ...formData.value,
      due_date: formData.value.due_date ? formatToISOString(new Date(formData.value.due_date)) : ''
    }
    await taskStore.createTask(taskData)
    ElMessage.success('任务创建成功')
    formVisible.value = false
    resetForm()
  } catch (error) {
    if (error.message) {
      ElMessage.error('任务创建失败')
    }
  }
}

// 取消创建
const cancelForm = () => {
  formVisible.value = false
  resetForm()
}

defineExpose({
  showForm: () => {
    formVisible.value = true
  }
})
</script>

<template>
  <el-dialog
    v-model="formVisible"
    title="创建新任务"
    width="500px"
    @close="cancelForm"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      label-position="right"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入任务标题"
        />
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入任务描述"
        />
      </el-form-item>

      <el-form-item label="优先级">
        <el-select v-model="formData.priority" placeholder="请选择优先级">
          <el-option label="低" value="low" />
          <el-option label="中" value="medium" />
          <el-option label="高" value="high" />
        </el-select>
      </el-form-item>

      <el-form-item label="截止日期">
        <el-date-picker
          v-model="formData.due_date"
          type="date"
          placeholder="选择截止日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="submitForm">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
