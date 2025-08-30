import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '../views/TaskView.vue'

const routes = [
  {
    path: '/',
    name: 'task',
    component: TaskView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
