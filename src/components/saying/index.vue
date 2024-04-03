
<script setup lang='ts'>
import { getSaying } from '@/api/saying'
import { ref } from 'vue'

const showSaying = ref('')
const isShowTip = ref(false)
const sayingInfo = ref()
const sayingInterval = ref()

/**
 * @description: 初始化获取语录
 * @return {*}
 */
const initSaying = async () => {
  const result = await getSaying()
  sayingInfo.value = result.saying[0]
  showSaying.value = result.saying[0].name
}
initSaying()

/**
 * @description: 初始化轮询
 * @return {*}
 */
function initInterval() {
  sayingInterval.value = setInterval(() => {
    initSaying()
  }, 1000 * 8)
}
/**
 * @description: 暂停功能
 * @return {*}
 */
function pause() {
  clearInterval(sayingInterval.value)
  isShowTip.value = true
}
/**
 * @description: 恢复功能
 * @return {*}
 */
function resume() {
  initInterval()
  isShowTip.value = false
}

initInterval()
</script>

<template>
  <el-card class="box-card">
    <div class="saying-content" @mouseover="pause" @mouseleave="resume">
      <span>{{ showSaying }}</span>
    </div>
    <div v-if="isShowTip" class="tooltip">
      <el-row>{{ sayingInfo.author }}</el-row>
      <el-row v-if="sayingInfo.book">《{{ sayingInfo.book }}》</el-row>
      <el-row v-if="sayingInfo.article">文章：{{ sayingInfo.article }}</el-row>
    </div>
  </el-card>
</template>

<style scoped>
.saying-content {
  font-size: 15px;
}

.tooltip {
  position: absolute;
  color: #409eff;
  font-family: "楷体", "楷体_GB2312";
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  top: 100px;
  right: 10%;
  z-index: 1;
}
</style>