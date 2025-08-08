import request from './request-spring'


const base = '/sysSync'

export const getSyncTablesDate = () => {
  return request({
    url: base + '/getSysSyncById?id=1',
    method: 'post'
  })
}