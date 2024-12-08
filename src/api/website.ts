import request from './request'

export const getWebsite = (params: any) => {
  return request({
    url: 'websites',
    params,
  })
}

export const clickWebsite = (id: any) => {
  return request({
    url: `websitesclick/${id}`,
    method: 'put',
  })
}

export const addWebsite = (data: any) => {
  return request({
    url: 'websites',
    method: 'post',
    data,
  })
}

export const editWebsite = (data: { id: any }) => {
  return request({
    url: `websites/${data.id}`,
    method: 'put',
    data,
  })
}

export const deleteWebsite = (id: any) => {
  return request({
    url: `websites/${id}`,
    method: 'delete',
  })
}

/* 
  * 网站推荐
*/
export const recommendWebsites = (params: any) => {
  return request({
    url: 'recommendWebsites',
    params,
  })
}
