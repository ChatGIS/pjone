/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-20 21:35:08
 * @FilePath: \pjone\src\api\tag.ts
 * @Description: 标签API
 */
import request from './request.js'

export const getTag = (params: any) => {
  return request({
    url: 'tag',
    params,
  })
}
