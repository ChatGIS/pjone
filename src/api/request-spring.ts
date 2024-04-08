/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-10 11:58:41
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-10 14:10:41
 * @FilePath: \pjone\src\api\request-spring.ts
 * @Description: 调用SpringBoot程序后台接口
 */

import axios from 'axios'

const instance = axios.create({
  baseURL: '/pjone-server',
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
  const { data, code, message } = response.data
  if (code === '00000') {
    return data
  } else {
    // ElMessage.error(meta.msg)
    return Promise.reject(new Error(message))
  }
},
(error) => {
  // error.response && ElMessage.error(error.response.data)
  return Promise.reject(new Error(error.response.data))
}
)

export default instance