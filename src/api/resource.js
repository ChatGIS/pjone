/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-03 23:31:53
 * @FilePath: \pjone\src\api\resource.js
 * @Description: 
 */
import request from './request'

export const getWebsite = (params) => {
  return request({
    url: 'websites',
    params,
  })
}

export const clickWebsite = (id) => {
  return request({
    url: `websitesclick/${id}`,
    method: 'put',
  })
}

export const addWebsite = (data) => {
  return request({
    url: 'websites',
    method: 'post',
    data,
  })
}

export const editWebsite = (data) => {
  return request({
    url: `websites/${data.id}`,
    method: 'put',
    data,
  })
}

export const deleteWebsite = (id) => {
  return request({
    url: `websites/${id}`,
    method: 'delete',
  })
}

/* 
  * 网站推荐
*/
export const recommendWebsites = (params) => {
  return request({
    url: 'recommendWebsites',
    params,
  })
}
