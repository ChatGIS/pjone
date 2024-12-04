<template>
    <div>
        <el-progress type="circle" :percentage="progressPercentage" status="success">
            <div>
                <span>{{ numGoal }}</span>
            </div>
            <el-button @click="handleUpCount" :icon="Upload" circle></el-button>
            <div>
                <span>{{ numDone }}</span>
            </div>
        </el-progress>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { lifeSitApi } from '@/api'

const numGoal = ref(50)
const numDone = ref(0)
const progressPercentage = ref(0)
onMounted(() => {
  initUpNum()
})
/**
 * @description: 初始化数量
 * @return {*}
 */
const initUpNum = () => {
  lifeSitApi.getUp().then(res => {
    numDone.value = res.num
  })
}
/**
 * @description: 更新进度条
 * @return {*}
 */
const updateProgress = () => {
  progressPercentage.value = (numDone.value / numGoal.value) * 100
}
/**
 * @description: 点击
 * @return {*}
 */
const handleUpCount = () => {
  lifeSitApi.addUp().then(num => {
    numDone.value = numDone.value + num
    updateProgress()
  })
}
</script>

<style scoped>
</style>