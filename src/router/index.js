import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '../views/TaskView.vue'

const routes = [
  {
    path: '/',
    name: 'task',
    component: TaskView
  },
  {
    path: '/task/:id',
    name: 'taskDetail',
    component: () => import('../views/TaskDetailView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
