/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-20 21:11:16
 * @FilePath: \pjone\src\api\life.ts
 * @Description: Life相关api
 */
import request from './request-spring'


const base = '/lifeColor'
export const getRecordsNum = () => {
  return request({
    url: base + '/getRecordsNum',
  })
}