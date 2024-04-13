/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-20 21:41:19
 * @FilePath: \pjone\src\api\website.ts
 * @Description: 网站API
 */
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
