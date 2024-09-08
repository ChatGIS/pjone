import { createRouter, createWebHashHistory } from 'vue-router'
import { useMainStore } from '../store'
import Recommend from '../views/recommend/index.vue'
import Resource from '../views/resource/index.vue'
import LifeColor from '../views/lifecolor/index.vue'
import Saying from '../views/saying/index.vue'
import Producer from '../views/producer/index.vue'
import Health from '../views/health/index.vue'

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
    { path: '/producer', component: Producer},
    { path: '/health', component: Health},
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
