/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-10 18:26:34
 * @FilePath: \pjone\src\api\request.ts
 * @Description: 
 */
import axios from 'axios'

const instance = axios.create({
  // baseURL: 'http://127.0.0.1:3007/api',
  baseURL: '/api',
  timeout: 5000,
})
// 添加请求拦截器
instance.interceptors.request.use(config => {
  if (localStorage.getItem('token')) {
    // if (diffTokenTime()) {
    //     store.dispatch('app/logout')
    //     return Promise.reject(new Error('token 失效了'))
    // }
  }
  if (config && config.headers) {
    config.headers.Authorization = localStorage.getItem('token') as string
  }
  return config
},
(error) => {
  return Promise.reject(new Error(error))
},
)
// 添加响应拦截器
instance.interceptors.response.use(response => {
  const { data, meta } = response.data
  if (meta.status === 200 || meta.status === 201) {
    return data
  } else {
    // ElMessage.error(meta.msg)
    return Promise.reject(new Error(meta.msg))
  }
},
(error) => {
  // error.response && ElMessage.error(error.response.data)
  return Promise.reject(new Error(error.response.data))
}
)

export default instance