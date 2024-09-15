<template>
    <el-card style="max-width: 480px" shadow="never">
        <template #header>
          <el-input v-if="isShowInputTag" :placeholder="tagPlaceholder" v-model="inputTag" 
            class="w-20" size="small" clearable @input="handleInputTagInput"/>
          <el-button v-if="tagPlaceholder != 'Search'" :icon="Check" circle size="small" @click="handleAdd"/>
          <el-button :icon="Search" circle size="small" @click="handleSearch"/>
          <el-button :icon="Plus" circle size="small" @click="handleAddShow"/>
          <el-button :icon="Close" circle size="small" @click="handleCloseShow"/>
          <el-button :icon="RefreshRight" circle size="small" />
        </template>
        <el-tag v-for="item in tags" :key="item.id" :closable="isClose" :effect="tagSelect.includes(item.id) ? 'dark' : 'plain'"
            type="success" round 
            @close="handleDeleteTag(item)"
            @click="handleClickTag(item)">{{ item.name }}</el-tag>
    </el-card>
</template>
<script setup>
import { reactive, onMounted, ref, watch } from 'vue'
import { Close, Plus, RefreshRight, Search, Check } from '@element-plus/icons-vue'
import { tagApi } from '@/api'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['emitSelectTag'])
const tags = reactive([])
const tagSelect = ref([])
const isShowInputTag = ref(false)
const inputTag = ref('')
const tagPlaceholder = ref('Search')
const isClose = ref(false)

const props = defineProps({
  tagIds: {
    type: String,
    required: true
  }
})
const initTags = () => {
  tagApi.getTag('B', inputTag.value).then((res) => {
    tags.splice(0, tags.length)
    tags.push(...res)
  })
}
watch(() => props.tagIds, (newTagIds) => {
  tagSelect.value.splice(0, tagSelect.value.length)
  if (newTagIds) {
    const newTags = newTagIds.split(',').map(tag => tag.trim())
    const numberTagIds = newTags.map(Number)
    tagSelect.value.push(...numberTagIds)
  }
}, { immediate: true })

onMounted(() => {
  initTags()
})

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
  if (tagPlaceholder.value == 'Add Tag') {
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
  } else if (tagPlaceholder.value == 'Delete Tag') {
    isClose.value = false
    initTags()
    tagPlaceholder.value = 'Search'
  }
}
const handleCloseShow = () => {
  tagPlaceholder.value = 'Delete Tag'
  isShowInputTag.value = false
  isClose.value = true
  initTags()
}

const handleDeleteTag = (tag) => {
  tagApi.deleteTag(tag.id).then((res) => {
    if(res == 1) {
      ElMessage.success('删除标签成功')
    } else {
      ElMessage.error('删除标签失败')
    }
    initTags()
  })
}
const handleClickTag = (tag) => {
  if (tagSelect.value.includes(tag.id)) {
    tagSelect.value.splice(tagSelect.value.indexOf(tag.id), 1)
  } else {
    tagSelect.value.push(tag.id)
  }
  emit('emitSelectTag', tagSelect.value)
}
const clearSelectTag = () => {
  tagSelect.value.splice(0, tagSelect.value.length)
}
defineExpose({
  clearSelectTag
})
</script>
<style scoped>
.el-tag {
    margin: 0 0.1rem;
    cursor: pointer;
}
</style>