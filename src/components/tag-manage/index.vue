<template>
    <el-card style="max-width: 480px" shadow="never">
        <template #header>
            <el-input v-if="isShowInputTag" ref="InputRef" v-model="inputTag" class="w-20" size="small" @input="handleInputTagInput"/>
            <el-button :icon="Search" circle size="small" @click="handleSearch"/>
            <el-button :icon="Plus" circle size="small" />
            <el-button :icon="Close" circle size="small" />
            <el-button :icon="RefreshRight" circle size="small" />
        </template>
        <el-tag v-for="item in tags" :key="item.id" :effect="tagSelect.includes(item.id) ? 'dark' : 'plain'"
            type="success" round>{{ item.name }}</el-tag>
    </el-card>
</template>
<script setup lang='ts'>
import { reactive, onMounted, ref } from 'vue'
import { Close, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import { tagApi } from '@/api'


const tags: any[] = reactive([])
const tagSelect: any[] = reactive([])
const isShowInputTag = ref(false)
const inputTag = ref('')

onMounted(() => {
  initTags()
})
const initTags = () => {
  tagApi.getTag('w', inputTag.value).then((res) => {
    tags.splice(0, tags.length)
    tags.push(...res)
  })
}
const handleSearch = () => {
  if (isShowInputTag.value) {
    isShowInputTag.value = false
  } else {
    isShowInputTag.value = true
  }
}
const handleInputTagInput = () => {
  initTags()
}
</script>
<style scoped>
.el-tag {
    margin: 0 0.1rem;
    cursor: pointer;
}
</style>