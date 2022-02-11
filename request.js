import axios from 'axios'

const service = axios.create({
  baseURL: "http://localhost:8090",
  // 超时时间
  timeout: 5000,
  withCredentials: true
})

export default service
