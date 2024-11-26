
import request from './request-spring.js'

const base = '/music'

type PageParam = {
  current: number,
  size: number,
  name: string,
}
export const updateMusic = (data: any) => {
  return request({
    url: base + '/updateMusic',
    method: 'post',
    data
  })
}
export const getMusicPageList = (data: PageParam) => {
  return request({
    url: base + '/getMusicPageList',
    method: 'post',
    data
  })
}
