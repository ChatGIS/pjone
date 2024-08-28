
import request from './request-spring.js'

const base = '/saying'

type PageParam = {
  current: number,
  size: number,
  name: string,
  author: string,
  book: string,
  article: string
}

export const addSaying = (data: any) => {
  return request({
    url: base + '/addSaying',
    method: 'post',
    data
  })
}
export const updateSaying = (data: any) => {
  return request({
    url: base + '/updateSaying',
    method: 'post',
    data
  })
}
export const getRandomSaying = () => {
  return request({
    url: base + '/getRandomSaying',
  })
}
export const getCountEveryDay = () => {
  return request({
    url: base + '/getCountEveryDay',
  })
}
export const getSayingPageList = (data: PageParam) => {
  return request({
    url: base + '/getSayingPageList',
    method: 'post',
    data
  })
}
