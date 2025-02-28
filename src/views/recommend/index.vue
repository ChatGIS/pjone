<template>
  <div>
    <Saying></Saying>
    <el-row>
      <el-col :span="6" v-for="(item, index) in websiteData" :key="index">
        <el-card shadow="hover" class="webcard">
          <div class="webcard-img-title" @click="clickWeb(item.id, item.url)">
            <el-row>
              <el-col :span="8">
                <el-avatar shape="square" :size="70" :src="item.favicon" />
              </el-col>
              <el-col :span="16">
                <div style="height: 40px; font-size: 500">
                  <span>{{ item.name }}</span>
                </div>
                <div>
                  <el-tag
                    type="success"
                    size="small"
                    v-for="aTag in item.tags_name && item.tags_name.split(',')"
                    :key="aTag"
                    round
                    >{{ aTag }}</el-tag
                  >
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
              <el-tooltip
                class="box-item"
                effect="light"
                content="点击量"
                placement="top"
              >
                <div>
                  <el-icon>
                    <Pointer />
                  </el-icon>
                  <span style="margin-left: 5px">{{ item.num_click }}</span>
                </div>
              </el-tooltip>
            </el-col>
            <el-col :span="8">
              <el-tooltip
                class="box-item"
                effect="light"
                content="收藏量"
                placement="top"
              >
                <div>
                  <el-icon><CollectionTag /></el-icon>
                  <span style="margin-left: 5px">{{
                    item.num_click - Math.round(Math.random() * 10)
                  }}</span>
                </div>
              </el-tooltip>
            </el-col>
            <el-col :span="8">
              <el-tooltip
                class="box-item"
                effect="light"
                content="分享"
                placement="top"
              >
                <div>
                  <Share style="width: 1em; height: 1em; margin-right: 8px" />
                </div>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { websiteApi } from '@/api'
import { reactive } from 'vue'
import Saying from '@/components/saying/index.vue'

// 网站接口
interface Website {
  id: number
  name: string
  url: string
  type: string
  favicon: string
  description: string
  num_click: number
  tags_name: string
}
// 网站集合
const websiteData: Website[] = reactive([])
// 查询条件
const queryParam = reactive({
  num: 16
})
// 查询网站
const initRecommendWebsites = async () => {
  const res = await websiteApi.recommendWebsites(queryParam)
  websiteData.push(...res.websites)
  console.log(res)
}
// 初始化查询
initRecommendWebsites()
// 点击网站
const clickWeb = (id: number, url: string) => {
  window.open(url)
  websiteApi.clickWebsite(id)
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
  color: #5ca8b5;
  cursor: pointer;
}

.el-divider--horizontal {
  margin: 2px 0;
}

.el-tag {
  margin: 0.1rem 0.1rem;
}
</style>
