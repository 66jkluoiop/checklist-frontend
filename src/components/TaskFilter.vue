<script setup>
import { ref, watch } from 'vue'
import { useTaskStore } from '../stores/todoStore'
import { Search } from '@element-plus/icons-vue'

const taskStore = useTaskStore()

const filters = ref({
  status: '',
  priority: '',
  search: ''
})

// 监听过滤器变化
watch(filters, (newFilters) => {
  taskStore.setFilters(newFilters)
}, { deep: true })

// 重置过滤器
const resetFilters = () => {
  filters.value = {
    status: '',
    priority: '',
    search: ''
  }
}
</script>

<template>
  <div class="task-filter">
    <el-card shadow="hover">
      <div class="filter-container">
        <el-input
          v-model="filters.search"
          placeholder="搜索任务..."
          clearable
          class="filter-item search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select
          v-model="filters.status"
          placeholder="状态筛选"
          clearable
          class="filter-item"
        >
          <el-option label="待处理" value="pending" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="已完成" value="completed" />
        </el-select>

        <el-select
          v-model="filters.priority"
          placeholder="优先级筛选"
          clearable
          class="filter-item"
        >
          <el-option label="低优先级" value="low" />
          <el-option label="中优先级" value="medium" />
          <el-option label="高优先级" value="high" />
        </el-select>

        <el-button
          type="info"
          plain
          @click="resetFilters"
          class="filter-item reset-button"
        >
          重置筛选
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.task-filter :deep(.el-card) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.task-filter :deep(.el-card:hover) {
  transform: translateY(-2px);
}

.filter-container {
  display: flex;
  gap: 16px;
  align-items: center;
}

.filter-item {
  min-width: 160px;
}

.search-input {
  flex: 1;
}

.reset-button {
  min-width: 100px;
}

@media (max-width: 1024px) {
  .filter-container {
    flex-wrap: wrap;
  }

  .filter-item {
    min-width: calc(50% - 8px);
    flex: 1 1 calc(50% - 8px);
  }

  .search-input {
    min-width: 100%;
  }
}

@media (max-width: 640px) {
  .filter-item {
    min-width: 100%;
    flex: 1 1 100%;
  }
}
</style>
