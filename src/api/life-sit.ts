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
export const getSits = () => {
  return request({
    url: base + '/getSits',
    method: 'post',
    data: {
      doDate: new Date().toISOString(),
    }
  })
}