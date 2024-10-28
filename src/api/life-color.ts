import request from './request-spring'


const base = '/lifeColor'

type PageParam = {
  current: number,
  size: number,
  type: string,
}
export const getLifeColorList = (data: PageParam) => {
  return request({
    url: base + '/getLifeColorList',
    method: 'post',
    data
  })
}
export const getMinuteLastYear = () => {
  return request({
    url: base + '/getMinuteLastYear',
  })
}
export const getNumLastYear = () => {
  return request({
    url: base + '/getNumLastYear',
  })
}
export const addLifeColor = (data: any) => {
  return request({
    url: base + '/addLifeColor',
    method: 'post',
    data
  })
}
export const updateLifeColor = (data: any) => {
  return request({
    url: base + '/updateLifeColor',
    method: 'post',
    data
  })
}
export const getRecordsNum = (type: string) => {
  return request({
    url: `${base}/getRecordsNum?type=${type}`,
  })
}
export const getSleepPointGroup = (days: number) => {
  return request({
    url: base + '/getSleepPointGroup?num=' + days,
  })
}
export const getSleepLongGroup = (days: number) => {
  return request({
    url: base + '/getSleepLongGroup?num=' + days,
  })
}