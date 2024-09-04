/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-10-04 23:04:54
 * @FilePath: \pjone\src\api\tag.ts
 * @Description: 标签API
 */
import request from './request-spring.js'

const base = '/systag'
export const getTag = (type: string, name: string) => {
  return request({
    url: base + '/getTag?type=' + type + '&name=' + name,
  })
}
