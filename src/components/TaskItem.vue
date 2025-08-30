<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/todoStore'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  task: {
    type: Object,
    required: true,
    validator(value) {
      return value && typeof value === 'object' && 
        'id' in value && 
        'title' in value &&
        'status' in value &&
        'priority' in value
    }
  }
})

const taskStore = useTaskStore()

// 优先级对应的样式
const priorityConfig = {
  low: {
    type: 'info',
    label: '低',
    color: '#909399'
  },
  medium: {
    type: 'warning',
    label: '中',
    color: '#E6A23C'
  },
  high: {
    type: 'danger',
    label: '高',
    color: '#F56C6C'
  }
}

// 状态对应的样式
const statusConfig = {
  pending: {
    type: 'info',
    label: '待处理',
    color: '#909399'
  },
  in_progress: {
    type: 'warning',
    label: '进行中',
    color: '#E6A23C'
  },
  completed: {
    type: 'success',
    label: '已完成',
    color: '#67C23A'
  }
}

// 计算属性：任务是否已完成
const isCompleted = computed(() => props.task.status === 'completed')

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 更新任务状态
const updateStatus = async (status) => {
  try {
    await taskStore.updateTaskStatus(props.task.id, status)
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败')
  }
}

// 删除任务
const deleteTask = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await taskStore.deleteTask(props.task.id)
    ElMessage.success('任务删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('任务删除失败')
    }
  }
}
</script>

<template>
  <div class="task-item" :class="{ 'is-completed': isCompleted }">
    <div class="task-content">
      <div class="task-header">
        <div class="task-title-wrapper">
          <h3 class="task-title">{{ task.title }}</h3>
          <div class="task-tags">
            <el-tag
              :type="priorityConfig[task.priority]?.type"
              size="small"
              class="task-tag"
              effect="light"
            >
              {{ priorityConfig[task.priority]?.label }}优先级
            </el-tag>
            <el-tag
              :type="statusConfig[task.status]?.type"
              size="small"
              class="task-tag"
              effect="light"
            >
              {{ statusConfig[task.status]?.label }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <p class="task-description" v-if="task.description">
        {{ task.description }}
      </p>
      
      <div class="task-footer">
        <span class="task-due-date" v-if="task.due_date">
          <el-icon><Calendar /></el-icon>
          截止日期: {{ formatDate(task.due_date) }}
        </span>
        
        <div class="task-actions">
          <el-dropdown @command="updateStatus" trigger="click">
            <el-button size="small" type="primary" plain>
              更改状态
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="pending">待处理</el-dropdown-item>
                <el-dropdown-item command="in_progress">进行中</el-dropdown-item>
                <el-dropdown-item command="completed">已完成</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <el-button
            size="small"
            type="danger"
            plain
            @click="deleteTask"
          >
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s;
  background: white;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item:hover {
  background-color: var(--page-background);
}

.task-item.is-completed {
  opacity: 0.8;
  background-color: #f8f9fa;
}

.task-header {
  margin-bottom: 12px;
}

.task-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.task-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  flex: 1;
}

.task-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.task-tag {
  white-space: nowrap;
}

.task-description {
  margin: 12px 0;
  color: var(--text-regular);
  font-size: 14px;
  line-height: 1.6;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.task-due-date {
  color: var(--text-secondary);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.is-completed .task-title {
  text-decoration: line-through;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .task-item {
    padding: 16px;
  }

  .task-title-wrapper {
    flex-direction: column;
    gap: 8px;
  }

  .task-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>