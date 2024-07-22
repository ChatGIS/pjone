/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2022-10-29 22:07:17
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-21 22:50:52
 * @FilePath: \pjone\src\router\index.ts
 * @Description: 
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { useMainStore } from '../store'
import Recommend from '../views/recommend/index.vue'
import Resource from '../views/resource/index.vue'
import LifeColor from '../views/lifecolor/index.vue'
import Saying from '../views/saying/index.vue'

// 路由
const routes = [{
  path: '/login',
  component: () => import('../views/login.vue')
}, {
  path: '/',
  component: () => import('../views/container.vue'),
  redirect: '/recommend',
  children: [
    { path: '/recommend', component: Recommend },
    {
      path: '/resource',
      component: Resource,
      meta: {
        requiresAuth: true
      }
    },
    { path: '/life-color', component: LifeColor },
    { path: '/saying', component: Saying},
  ]
}]
// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 导航守卫
router.beforeEach((to, from) => {
  // 状态管理容器
  const store = useMainStore()
  if (to.meta.requiresAuth && !store.isLogin) {
    // 此路由需要授权，请检查是否已登录
    // 如果没有，则重定向到登录页面
    return {
      path: '/login',
      // 保存我们所在的位置，以便以后再来
      query: { redirect: to.fullPath },
    }
  }
})
export default router
