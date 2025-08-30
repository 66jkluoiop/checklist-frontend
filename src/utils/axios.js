import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 在这里可以添加认证信息等
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 统一处理错误
    const message = error.response?.data?.message || error.message
    console.error('请求错误:', message)
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default instance
