import { defineStore } from 'pinia'
import { taskApi } from '../api/todo'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    currentTask: null,
    stats: null,
    loading: false,
    error: null,
    filters: {
      status: '',
      priority: '',
      search: ''
    }
  }),
  
  getters: {
    getTasks: (state) => state.tasks,
    getStats: (state) => state.stats,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error,
    getCurrentTask: (state) => state.currentTask,
    getFilters: (state) => state.filters
  },
  
  actions: {
    // 设置过滤器
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      this.fetchTasks() // 重新获取任务
    },

    // 获取任务列表
    async fetchTasks() {
      this.loading = true
      this.error = null
      try {
        const response = await taskApi.getTasks(this.filters)
        // 确保数据格式正确，获取 response.data.data 中的任务数组
        this.tasks = Array.isArray(response.data.data) ? response.data.data : []
      } catch (error) {
        this.error = error.message
        console.error('获取任务列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 获取任务统计
    async fetchStats() {
      try {
        const response = await taskApi.getTaskStats()
        this.stats = response.data.data
      } catch (error) {
        console.error('获取任务统计失败:', error)
      }
    },

    // 获取单个任务
    async fetchTaskById(id) {
      this.loading = true
      this.error = null
      try {
        const response = await taskApi.getTaskById(id)
        this.currentTask = response.data.data
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('获取任务详情失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 创建任务
    async createTask(task) {
      this.loading = true
      this.error = null
      try {
        const response = await taskApi.createTask(task)
        this.tasks.push(response.data.data)
        await this.fetchStats() // 更新统计数据
      } catch (error) {
        this.error = error.message
        console.error('创建任务失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 更新任务
    async updateTask(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await taskApi.updateTask(id, data)
        const updatedTask = response.data.data
        // 更新任务列表中的数据
        const index = this.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
          this.tasks[index] = updatedTask
        }
        // 更新当前任务数据
        if (this.currentTask && this.currentTask.id === id) {
          this.currentTask = updatedTask
        }
      } catch (error) {
        this.error = error.message
        console.error('更新任务失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 更新任务状态
    async updateTaskStatus(id, status) {
      this.loading = true
      this.error = null
      try {
        const response = await taskApi.updateTaskStatus(id, status)
        const index = this.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data.data
        }
        await this.fetchStats() // 更新统计数据
      } catch (error) {
        this.error = error.message
        console.error('更新任务状态失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 删除任务
    async deleteTask(id) {
      this.loading = true
      this.error = null
      try {
        await taskApi.deleteTask(id)
        this.tasks = this.tasks.filter(task => task.id !== id)
        await this.fetchStats() // 更新统计数据
      } catch (error) {
        this.error = error.message
        console.error('删除任务失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 搜索任务
    async searchTasks(searchTerm) {
      this.filters.search = searchTerm
      await this.fetchTasks()
    },

    // 按优先级筛选
    async filterByPriority(priority) {
      this.filters.priority = priority
      await this.fetchTasks()
    },

    // 按状态筛选
    async filterByStatus(status) {
      this.filters.status = status
      await this.fetchTasks()
    }
  }
})
