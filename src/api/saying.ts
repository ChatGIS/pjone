/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-11-14 23:56:15
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-20 21:05:56
 * @FilePath: \pjone\src\api\saying.ts
 * @Description: 语录API
 */
import request from './request.js'

export const getSaying = () => {
  return request({
    url: 'recommendSaying',
  })
}
