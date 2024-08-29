<template>
  <el-menu class="menu" :default-active="activeIndex" :router=true mode="horizontal" @select="handleSelect">
    <el-menu-item index="/recommend">推荐</el-menu-item>
    <el-menu-item index="/resource">资源</el-menu-item>
    <el-sub-menu index="2">
      <template #title>我的</template>
      <el-menu-item index="/producer">Producer</el-menu-item>
      <el-menu-item index="/life-color">LifeColor</el-menu-item>
      <el-menu-item index="/saying">Saying</el-menu-item>
    </el-sub-menu>
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
