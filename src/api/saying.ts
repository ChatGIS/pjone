/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-11-14 23:56:15
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-20 23:15:49
 * @FilePath: \pjone\src\api\saying.ts
 * @Description: 语录API
 */
import request from './request-spring.js'

const base = '/saying'

export const getRandomSaying = () => {
  return request({
    url: base + '/getRandomSaying',
  })
}
