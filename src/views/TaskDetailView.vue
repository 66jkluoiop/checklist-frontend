<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../stores/todoStore'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
import TaskForm from '../components/TaskForm.vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const loading = ref(true)
const taskFormRef = ref(null)

const fetchTaskDetail = async () => {
  loading.value = true
  try {
    await taskStore.fetchTaskById(route.params.id)
  } catch (error) {
    ElMessage.error('获取任务详情失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  fetchTaskDetail()
})
</script>

<template>
  <div class="task-detail">
    <el-card class="detail-card" :loading="loading">
      <template #header>
        <div class="card-header">
          <el-button @click="goBack" :icon="ArrowLeft" plain>返回列表</el-button>
          <h2 class="card-title">任务详情</h2>
          <el-button 
            type="primary" 
            :icon="Edit" 
            @click="taskFormRef?.editTask(taskStore.getCurrentTask)"
            v-if="taskStore.getCurrentTask"
          >
            编辑任务
          </el-button>
        </div>
      </template>

      <el-skeleton :loading="loading" animated :rows="6" v-if="loading" />
      
      <template v-else>
        <div class="detail-content" v-if="taskStore.getCurrentTask">
          <div class="detail-header">
            <h1 class="task-title">{{ taskStore.getCurrentTask.title }}</h1>
            <div class="task-meta">
              <el-tag
                :type="taskStore.getCurrentTask.priority === 'high' ? 'danger' : taskStore.getCurrentTask.priority === 'medium' ? 'warning' : 'info'"
                effect="light"
                size="large"
                class="meta-tag"
              >
                {{ taskStore.getCurrentTask.priority === 'high' ? '高优先级' : taskStore.getCurrentTask.priority === 'medium' ? '中优先级' : '低优先级' }}
              </el-tag>
              <el-tag
                :type="taskStore.getCurrentTask.status === 'completed' ? 'success' : taskStore.getCurrentTask.status === 'in_progress' ? 'warning' : 'info'"
                effect="light"
                size="large"
                class="meta-tag"
              >
                {{ taskStore.getCurrentTask.status === 'completed' ? '已完成' : taskStore.getCurrentTask.status === 'in_progress' ? '进行中' : '待处理' }}
              </el-tag>
              <span class="due-date" v-if="taskStore.getCurrentTask.due_date">
                截止日期：{{ taskStore.getCurrentTask.due_date }}
              </span>
            </div>
          </div>

          <el-divider />

          <div class="section">
            <h3 class="section-title">任务描述</h3>
            <p class="description">{{ taskStore.getCurrentTask.description || '暂无描述' }}</p>
          </div>

          <el-divider />

          <div class="section">
            <h3 class="section-title">任务内容</h3>
            <div 
              class="content" 
              v-html="taskStore.getCurrentTask.content || '暂无内容'"
            ></div>
          </div>
        </div>

        <div v-else class="no-data">
          <el-empty description="未找到任务" />
        </div>
      </template>
    </el-card>
    <TaskForm ref="taskFormRef" @update="fetchTaskDetail" />
  </div>
</template>

<style scoped>
.task-detail {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
}

.card-header h2 {
  flex: 1;
}

.card-title {
  margin: 0;
  font-size: 18px;
  color: var(--text-regular);
}

.detail-header {
  margin-bottom: 24px;
}

.task-title {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: var(--text-primary);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-tag {
  font-size: 14px;
}

.due-date {
  color: var(--text-regular);
  font-size: 14px;
}

.section {
  margin: 24px 0;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: var(--text-primary);
  font-weight: 500;
}

.description {
  color: var(--text-regular);
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  margin: 0;
}

.content {
  background-color: var(--page-background);
  padding: 20px;
  border-radius: 8px;
  color: var(--text-regular);
  font-size: 14px;
  line-height: 1.6;
}

.content :deep(p) {
  margin: 8px 0;
}

.content :deep(img) {
  max-width: 100%;
  height: auto;
}

.content :deep(table) {
  border-collapse: collapse;
  margin: 8px 0;
  width: 100%;
}

.content :deep(td),
.content :deep(th) {
  border: 1px solid var(--border-color);
  padding: 8px;
}

.content :deep(ul),
.content :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}

.content :deep(pre) {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 8px 0;
}

.content :deep(blockquote) {
  border-left: 4px solid var(--border-color);
  margin: 8px 0;
  padding: 8px 16px;
  background-color: #f8f9fa;
}

.no-data {
  padding: 40px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .task-detail {
    padding: 0 16px;
  }

  .task-title {
    font-size: 20px;
  }

  .content {
    padding: 16px;
  }
}
</style>
