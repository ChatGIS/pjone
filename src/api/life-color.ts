/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-02 19:13:33
 * @FilePath: \pjone\src\api\life-color.ts
 * @Description: Life相关api
 */
import request from './request-spring'


const base = '/lifeColor'
export const getLifeColorList = () => {
  return request({
    url: base + '/getLifeColorList',
  })
}
export const getMinuteLastYear = () => {
  return request({
    url: base + '/getMinuteLastYear',
  })
}
export const addLifeColor = (data: any) => {
  return request({
    url: base + '/addLifeColor',
    method: 'post',
    data
  })
}
export const getRecordsNum = (type: string) => {
  return request({
    url: `${base}/getRecordsNum?type=${type}`,
  })
}