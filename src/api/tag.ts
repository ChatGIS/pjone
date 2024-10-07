import request from './request-spring.js'

const base = '/systag'
export const getTag = (type: string, name: string) => {
  return request({
    url: base + '/getTag?type=' + type + '&name=' + name,
  })
}
export const addTag = (data: any) => {
  return request({
    url: base + '/addTag',
    method: 'post',
    data
  })
}
export const deleteTag = (id: string) => {
  return request({
    url: base + '/deleteTag',
    method: 'post',
    data: {
      id
    }
  })
}
