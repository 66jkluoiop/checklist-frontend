<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import TaskStats from '../components/TaskStats.vue'
import TaskFilter from '../components/TaskFilter.vue'
import TaskList from '../components/TaskList.vue'
import TaskForm from '../components/TaskForm.vue'

const taskFormRef = ref(null)

const showCreateForm = () => {
  taskFormRef.value?.showForm()
}
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>任务管理</h1>
      <el-button type="primary" size="large" :icon="Plus" @click="showCreateForm">
        创建新任务
      </el-button>
    </header>

    <main class="main">
      <TaskStats />
      <TaskFilter />
      <TaskList />
    </main>

    <TaskForm ref="taskFormRef" />
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: var(--text-primary);
  position: relative;
}

.header h1::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 3px;
}

.main {
  margin-top: 20px;
  display: grid;
  gap: 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 16px;
  }

  .header h1::after {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>