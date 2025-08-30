<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../stores/todoStore'
import { ElMessage } from 'element-plus'
import TaskItem from './TaskItem.vue'

const taskStore = useTaskStore()
const loading = ref(false)

// 初始化加载任务列表和统计数据
const initData = async () => {
  loading.value = true
  try {
    await taskStore.fetchTasks()
    await taskStore.fetchStats()
  } catch (error) {
    ElMessage.error('加载任务列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initData()
})
</script>

<template>
  <div class="task-list">
    <el-card class="task-list-card" shadow="hover">
      <!-- 加载状态 -->
      <el-skeleton :loading="loading" animated :count="3" v-if="loading">
        <template #template>
          <div class="skeleton-item">
            <el-skeleton-item variant="p" style="width: 100%" />
            <div class="skeleton-footer">
              <el-skeleton-item variant="text" style="margin-right: 16px" />
              <el-skeleton-item variant="text" style="width: 30%" />
            </div>
          </div>
        </template>
      </el-skeleton>

      <!-- 任务列表 -->
      <template v-else>
        <div v-if="taskStore.getTasks.length === 0" class="empty-state">
          <el-empty description="暂无任务">
            <template #image>
              <img src="https://shadow.elemecdn.com/app/element/empty.3c5df562-1.svg" alt="empty" />
            </template>
          </el-empty>
        </div>
        <TransitionGroup name="task-list" tag="div" class="task-list-container">
          <TaskItem
            v-for="task in taskStore.getTasks"
            :key="task.id"
            :task="task"
          />
        </TransitionGroup>
      </template>
    </el-card>
  </div>
</template>

<style scoped>
.task-list {
  width: 100%;
}

.task-list-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.task-list-card:hover {
  transform: translateY(-2px);
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-state :deep(img) {
  width: 160px;
  height: 160px;
}

.skeleton-item {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.skeleton-item:last-child {
  border-bottom: none;
}

.skeleton-footer {
  margin-top: 16px;
  display: flex;
  align-items: center;
}

.task-list-container {
  position: relative;
}

/* 列表动画 */
.task-list-move,
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.task-list-leave-active {
  position: absolute;
  width: 100%;
}

.task-list-enter-active {
  transition-delay: 0.2s;
}
</style>