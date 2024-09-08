import request from './request-spring'


const base = '/lifeWeight'

export const getWeight = () => {
  return request({
    url: base + '/getWeight',
    method: 'post',
    data: {
      'name': '1'
    }
  })
}