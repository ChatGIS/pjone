<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-03 23:35:07
 * @FilePath: \pjone\src\components\menu\index.vue
 * @Description: 
-->
<template>
    <el-menu class="menu" :default-active="activeIndex" router="true" mode="horizontal" @select="handleSelect">
        <el-menu-item index="/recommend">推荐</el-menu-item>
        <el-menu-item index="/resource">资源</el-menu-item>
        <el-menu-item index="/my">我的</el-menu-item>
    </el-menu>
</template>

<script setup lang="ts">import { ref } from 'vue'
import { useMainStore } from '../../store'

const store = useMainStore()
const activeIndex = ref('/recommend')
// 进入页面，根据进行store.activeMenu判断要触发的菜单
if (store.activeMenu == '') {
  store.activeMenu = activeIndex.value
} else {
  activeIndex.value = store.activeMenu
}
// 菜单切换，进行保存
const handleSelect = (key: string) => {
  activeIndex.value = key
  store.activeMenu = key
}
</script>

<style scoped>
.menu {
    flex: 1 0 auto;
    margin-left: 35px;
}
</style>
