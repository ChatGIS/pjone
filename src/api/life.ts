/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-10 14:11:18
 * @FilePath: \pjone\src\api\life.ts
 * @Description: Life相关api
 */
import request from './request-spring'

export const getRecordsNum = () => {
  return request({
    url: '/lifeColor/getRecordsNum',
  })
}