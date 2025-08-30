<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/todoStore'

const taskStore = useTaskStore()

const stats = computed(() => {
  // 如果没有统计数据，返回默认值
  if (!taskStore.getStats) {
    return {
      pending: 0,
      in_progress: 0,
      completed: 0
    }
  }
  // 直接返回统计数据
  return taskStore.getStats
})

const total = computed(() => {
  return stats.value.pending + stats.value.in_progress + stats.value.completed
})
</script>

<template>
  <div class="task-stats">
    <el-card shadow="hover">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-icon total">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value total">{{ total }}</div>
            <div class="stat-label">总任务</div>
          </div>
        </div>

        <el-divider direction="vertical" />

        <div class="stat-item">
          <div class="stat-icon pending">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value pending">{{ stats.pending }}</div>
            <div class="stat-label">待处理</div>
          </div>
        </div>

        <el-divider direction="vertical" />

        <div class="stat-item">
          <div class="stat-icon in-progress">
            <el-icon><Loading /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value in-progress">{{ stats.in_progress }}</div>
            <div class="stat-label">进行中</div>
          </div>
        </div>

        <el-divider direction="vertical" />

        <div class="stat-item">
          <div class="stat-icon completed">
            <el-icon><Select /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value completed">{{ stats.completed }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.task-stats :deep(.el-card) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.task-stats :deep(.el-card:hover) {
  transform: translateY(-2px);
}

.stats-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  padding: 0 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.total {
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}

.stat-icon.pending {
  background-color: rgba(230, 162, 60, 0.1);
  color: var(--warning-color);
}

.stat-icon.in-progress {
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}

.stat-icon.completed {
  background-color: rgba(103, 194, 58, 0.1);
  color: var(--success-color);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-value.total {
  color: var(--primary-color);
}

.stat-value.pending {
  color: var(--warning-color);
}

.stat-value.in-progress {
  color: var(--primary-color);
}

.stat-value.completed {
  color: var(--success-color);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .stats-container {
    flex-wrap: wrap;
    gap: 20px;
  }

  .stat-item {
    flex: 1 1 40%;
    padding: 0;
  }

  .el-divider {
    display: none;
  }
}

@media (max-width: 480px) {
  .stat-item {
    flex: 1 1 100%;
  }
}
</style>