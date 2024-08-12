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
export const getRecordsNum = (type: string) => {
  return request({
    url: `${base}/getRecordsNum?type=${type}`,
  })
}
export const getSleepPointGroupLastYear = () => {
  return request({
    url: base + '/getSleepPointGroupLastYear',
  })
}
export const getSleepLongGroupLastYear = () => {
  return request({
    url: base + '/getSleepLongGroupLastYear',
  })
}