<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '../router'
import { useMainStore } from '../store'
import { sysSyncApi } from '@/api'

const store = useMainStore()
let loginOrOutText = ref('')
const syncDate = ref('')

onMounted(() => {
  loginOrOutText.value = store.isLogin ? '退出登录' : '请登录'
  sysSyncApi.getSyncTablesDate().then((res) => {
    syncDate.value = res.doDate
  })
})

// 登录或退出
const loginOrOut = () => {
  store.isLogin = !store.isLogin
  if (store.isLogin === true) {
    loginOrOutText.value = '退出登录'
  } else if (store.isLogin === false) {
    loginOrOutText.value = '请登录'
    window.localStorage.removeItem('mbToken')
  }
  router.push('/login')
}
</script>

<template>
  <el-container>
    <el-header id="bn-header">
      <div class="header-container">
        <Logo></Logo>
        <Menu></Menu>
        <el-button type="primary" @click="loginOrOut">{{
          loginOrOutText
        }}</el-button>
      </div>
    </el-header>
    <el-main id="bn-main">
      <router-view></router-view>
    </el-main>
    <el-footer id="bn-footer">
        <span class="backup-text">最后备份时间：{{ syncDate }}</span>
    </el-footer>
  </el-container>
</template>

<style scoped>
section {
  --header-height: 60px;
  --footer-height: 30px;
}
#bn-header {
  position: relative;
  height: var(--header-height);
}
#bn-main {
  width: 100%;
  position: absolute;
  top: 60px;
  height: calc(100% - var(--header-height) - var(--footer-height));
  overflow-y: auto;
}
#bn-footer {
  position: absolute;
  bottom: 0px;
  height: var(--footer-height);
  width: 100%;
  background-color: #f0f2f5;
}
</style>
