/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-20 21:32:25
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-20 21:34:36
 * @FilePath: \pjone\src\api\system.ts
 * @Description: 系统API
 */
import request from './request'

// 登录请求
export const login = (params: any) => {
  return request({
    url: 'login',
    data: params,
    method: 'post',
  })
}