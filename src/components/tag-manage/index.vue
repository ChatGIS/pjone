<template>
    <el-card style="max-width: 480px" shadow="never">
        <template #header>
          <el-input v-if="isShowInputTag" :placeholder="tagPlaceholder" v-model="inputTag" class="w-20" size="small" @input="handleInputTagInput"/>
          <el-button v-if="tagPlaceholder != 'Search'" :icon="Check" circle size="small" @click="handleAdd"/>
          <el-button :icon="Search" circle size="small" @click="handleSearch"/>
          <el-button :icon="Plus" circle size="small" @click="handleAddShow"/>
          <el-button :icon="Close" circle size="small" />
          <el-button :icon="RefreshRight" circle size="small" />
        </template>
        <el-tag v-for="item in tags" :key="item.id" :effect="tagSelect.includes(item.id) ? 'dark' : 'plain'"
            type="success" round>{{ item.name }}</el-tag>
    </el-card>
</template>
<script setup lang='ts'>
import { reactive, onMounted, ref } from 'vue'
import { Close, Plus, RefreshRight, Search, Check } from '@element-plus/icons-vue'
import { tagApi } from '@/api'
import { ElMessage } from 'element-plus'


const tags: any[] = reactive([])
const tagSelect: any[] = reactive([])
const isShowInputTag = ref(false)
const inputTag = ref('')
const tagPlaceholder = ref('Search')

onMounted(() => {
  initTags()
})
const initTags = () => {
  tagApi.getTag('B', inputTag.value).then((res) => {
    tags.splice(0, tags.length)
    tags.push(...res)
  })
}
const handleSearch = () => {
  tagPlaceholder.value = 'Search'
  if (isShowInputTag.value) {
    isShowInputTag.value = false
  } else {
    isShowInputTag.value = true
  }
}
const handleInputTagInput = () => {
  initTags()
}
const handleAddShow = () => {
  tagPlaceholder.value = 'Add Tag'
  isShowInputTag.value = true
}
const handleAdd = () => {
  if (inputTag.value) {
    tagApi.addTag({ 
      name: inputTag.value,
      type: 'B'
    }).then((res) => {
      if(res == 1) {
        ElMessage.success('添加标签成功')
      } else {
        ElMessage.error('添加标签失败')
      }
      initTags()
    })
  }
}
</script>
<style scoped>
.el-tag {
    margin: 0 0.1rem;
    cursor: pointer;
}
</style>