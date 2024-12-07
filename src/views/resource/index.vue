<template>
    <div class="common-layout">
        <Saying></Saying>
        <Type @selectedType="getTagSelected"></Type>
        <el-row>
            <el-col :span="6" v-for="(item, index) in websiteData" :key="index">
                <el-card shadow="hover" class="webcard">
                    <div class="webcard-img-title" @click="clickWeb(item.id, item.url)">
                        <el-row>
                            <el-col :span="8">
                                <!-- <el-avatar shape="square" :size="70" :src="item.favicon">A</el-avatar> -->
                                <el-image :src="item.favicon">
                                    <template #placeholder>
                                        <el-image :src=loadingImg></el-image>
                                    </template>
                                </el-image>
                            </el-col>
                            <el-col :span="16">
                                <div style="height: 40px; font-size: 500">
                                    <span>{{ item.name }}</span>
                                </div>
                                <div>
                                    <el-tag type="success" size="small" v-for="aTag in item.tags_name && item.tags_name.split(',')"
                                        :key="aTag" round>{{ aTag
                                        }}</el-tag>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <el-row class="webcard-desc" @click="clickWeb(item.id, item.url)">
                        <el-col> {{ item.description }}</el-col>
                    </el-row>
                    <el-divider />
                    <el-row class="webcard-click">
                        <el-col :span="8">
                            <el-tooltip class="box-item" effect="light" content="点击量" placement="top">
                                <div>
                                    <el-icon>
                                        <Pointer />
                                    </el-icon>
                                    <span style="margin-left: 5px">{{ item.num_click }}</span>
                                </div>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="8">
                            <el-tooltip class="box-item" effect="light" content="收藏量" placement="top">
                                <div>
                                    <el-icon>
                                        <CollectionTag />
                                    </el-icon>
                                    <span style="margin-left: 5px">{{ item.num_click - Math.round(Math.random() * 10)
                                        }}</span>
                                </div>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="8">
                            <el-tooltip class="box-item" effect="light" content="分享" placement="top">
                                <div>
                                    <Share style="width: 1em; height: 1em; margin-right: 8px" />
                                </div>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <el-pagination v-model:currentPage="pageParam.pagenum" v-model:page-size="pageParam.pagesize"
            layout="prev, pager, next, jumper" :hide-on-single-page="isSinglePage" :total="total"
            @current-change="handleCurrentChange" />
    </div>
</template>

<script lang="ts" setup>
import Type from '@/components/type/index.vue'
import Saying from '@/components/saying/index.vue'
import { websiteApi } from '@/api'
import { reactive, ref } from 'vue'
import getAssetsFile from '@/utils/sys-use'

const loadingImg = getAssetsFile('loading.png')

// 网站接口
interface Website {
    id: number,
    name: string,
    url: string,
    type: string,
    favicon: string,
    description: string,
    num_click: number,
    tags_name: string
}

// 查询结果总数
const total = ref(0)
// 分页查询条件
const pageParam = ref({
  query: '',
  pagenum: 1,
  pagesize: 20,
  tags: [0],
})
// 定义数组用于存放已选择的标签
let tagValueSelected = ref([])
// 查询结果是否只有一页，是则不显示分页组件
const isSinglePage = ref(true)
// 查询结果
const websiteData: Website[] = reactive([])
// 查询网站
const initGetWebsitesList = async () => {
  // let tags = tagSelected ? tagSelected : []
  pageParam.value.tags = tagValueSelected.value
  const res = await websiteApi.getWebsite(pageParam.value)
  total.value = res.total
  websiteData.length = 0
  websiteData.push(...res.websites)
}
// 初始化查询
initGetWebsitesList()

// 页码选择
const handleCurrentChange = (val: number) => {
  pageParam.value.pagenum = val
  initGetWebsitesList()
}

// 点击网站
const clickWeb = (id: number, url: string) => {

  window.open(url)
  websiteApi.clickWebsite(id)
}

// 获取点击的标签值
const getTagSelected = (val: any) => {
  if (val.length == 1 && val.includes(0)) {
    tagValueSelected.value = []
  } else {
    tagValueSelected.value = val
  }
  initGetWebsitesList()
}
</script>

<style scoped>
.el-avatar {
    --el-avatar-text-color: #fff;
    --el-avatar-bg-color: #f4f6f7;
}

.webcard {
    height: 180px;
    margin: 5px;
}

.webcard-img-title {
    height: 80px;
    cursor: pointer;
}

.webcard-desc {
    height: 50px;
    font-size: 12px;
    color: #5CA8B5;
    cursor: pointer;
}

.el-divider--horizontal {
    margin: 2px 0;
}

.el-tag {
    margin: 0.1rem 0.1rem;
}

.el-image {
    width: 70px;
    height: 70px;
}
</style>
