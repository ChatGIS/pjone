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
export const addUp = () => {
  return request({
    url: base + '/addUp',
    method: 'post',
  })
}
export const getUp = () => {
  return request({
    url: base + '/getUp',
    method: 'post',
  })
}
export const getCountEveryDay = () => {
  return request({
    url: base + '/getCountEveryDayOfUp',
  })
}