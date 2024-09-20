import request from './request-spring'


const base = '/lifeSit'

export const addSit = (type: string) => {
  return request({
    url: base + '/addSit',
    method: 'post',
    data: {
      type
    }
  })
}