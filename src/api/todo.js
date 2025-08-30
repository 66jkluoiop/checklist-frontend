import request from '../utils/axios'

// 任务相关接口
export const taskApi = {
  // 获取任务列表（支持过滤）
  getTasks(params = {}) {
    return request.get('/api/tasks', { params })
  },

  // 创建新任务
  createTask(data) {
    return request.post('/api/tasks', data)
  },

  // 获取单个任务
  getTaskById(id) {
    return request.get(`/api/tasks/${id}`)
  },

  // 更新任务
  updateTask(id, data) {
    return request.put(`/api/tasks/${id}`, data)
  },

  // 删除任务
  deleteTask(id) {
    return request.delete(`/api/tasks/${id}`)
  },

  // 更新任务状态
  updateTaskStatus(id, status) {
    return request.patch(`/api/tasks/${id}/status`, { status })
  },

  // 获取任务统计
  getTaskStats() {
    return request.get('/api/tasks/stats')
  },

  // 便捷方法：获取特定状态的任务
  getPendingTasks() {
    return this.getTasks({ status: 'pending' })
  },

  getInProgressTasks() {
    return this.getTasks({ status: 'in_progress' })
  },

  getCompletedTasks() {
    return this.getTasks({ status: 'completed' })
  },

  // 便捷方法：按优先级获取任务
  getTasksByPriority(priority) {
    return this.getTasks({ priority })
  },

  // 搜索任务
  searchTasks(searchTerm) {
    return this.getTasks({ search: searchTerm })
  }
}
