import request from './request-spring'


const base = '/lifeSit'

export const updateStatus = (id:any, type: any, time: any) => {
    return request({
        url: base + '/updateStatus',
        method: 'post',
        data: {
            id,
            type,
            doDate: time.toISOString(),
        }
    })
}