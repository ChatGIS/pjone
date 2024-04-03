/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-03 23:16:04
 * @FilePath: \pjone\src\api\login.ts
 * @Description: 
 */
import request from './request'

// 登录请求
export const login = (params: any) => {
    return request({
        url: 'login',
        data: params,
        method: 'post',
    })
}