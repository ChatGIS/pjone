<template>
  <div>
    <el-row class="main-card">
      <el-col :span="24">
        <el-button @click="handleDrawerShow" text>WHO SAY</el-button>
        <div class="calendar-box">
          <div id="container-saying" class="container-calendar"></div>
        </div>
      </el-col>
    </el-row>
    <el-row class="main-card">
      <el-form :inline="true" :model="formQuery" class="demo-form-inline">
        <el-form-item label="Saying">
          <el-input v-model="formQuery.name" clearable />
        </el-form-item>
        <el-form-item label="Author">
          <el-input v-model="formQuery.author" clearable />
        </el-form-item>
        <el-form-item label="Book">
          <el-input v-model="formQuery.book" clearable />
        </el-form-item>
        <el-form-item label="Article">
          <el-input v-model="formQuery.article" clearable />
        </el-form-item>
        <el-form-item>
          <el-button @click="clearQuery">Clear</el-button>
          <el-button @click="initSayingTable">Query</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableDataSaying" style="width: 100%">
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="Saying" />
        <el-table-column prop="author" label="Author" width="180" />
        <el-table-column prop="book" label="Book" width="180" />
        <el-table-column prop="article" label="Article" width="180" />
        <el-table-column prop="createDate" label="createDate" width="180" />
        <el-table-column prop="tagNames" label="Tag" width="180">
          <template #default="scope">
            <el-tag v-for="tag in splitTags(scope.row.tagNames)" :key="tag" type="success" style="margin-right: 5px;">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button type="success" :icon="Share" circle @click="handleShare(scope.$index, scope.row)" />
            <el-button type="primary" :icon="Edit" circle @click="handleEdit(scope.$index, scope.row)" />
            <el-button type="danger" circle :icon="Delete" @click="handleDelete(scope.$index, scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 8, 10, 20, 50]"
        layout="total, sizes, prev, pager, next" :total="totalSaying"
        @current-change="handleCurrentChange" @size-change="handleSizeChange" />
    </el-row>
    <el-row class="main-card">
      <el-col :span="6">
        <el-input v-model="textShare" :rows="10" type="textarea" placeholder="分享文字"/>
        <el-input v-model="textAuthorShare"/>
        <el-collapse v-model="activeNames" :accordion=true>
          <el-collapse-item title="作者" name="1">
            <el-form :model="shareConfig" label-width="auto" style="max-width: 600px">
              <el-form-item label="作者">
                <el-switch v-model="shareConfig.showAuthor" @change="renderImage"/>
              </el-form-item>
              <el-form-item label="前缀">
                <el-input v-model="shareConfig.authorPrefix" :disabled="!shareConfig.showAuthor" @change="renderImage" />
              </el-form-item>
              <el-form-item label="对齐">
                <el-radio-group v-model="shareConfig.authorTextAlign" :disabled="!shareConfig.showAuthor" @change="renderImage">
                  <el-radio value="right">右</el-radio>
                  <el-radio value="center">中</el-radio>
                  <el-radio value="left">左</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="字号">
                <el-input-number v-model="shareConfig.authorFontSize" :min="1" :max="600" :step="5" :disabled="!shareConfig.showAuthor" @change="renderImage" />
              </el-form-item>
              <el-form-item label="字体">
                <el-select v-model="shareConfig.authorFontType" placeholder="字体选择" :disabled="!shareConfig.showAuthor" @change="renderImage">
                  <el-option label="宋体" value="SimSun" />
                  <el-option label="黑体" value="SimHei" />
                  <el-option label="微软雅黑" value="Microsoft YaHei" />
                  <el-option label="楷体" value="KaiTi" />
                </el-select>
              </el-form-item>
              <el-form-item label="颜色">
                <el-color-picker v-model="shareConfig.authorTextColor" :predefine="predefineColors1" :disabled="!shareConfig.showAuthor" @change="renderImage"/>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="水印" name="2">
            <el-form :model="shareConfig" label-width="auto" style="max-width: 600px">
              <el-form-item label="水印">
                <el-switch v-model="shareConfig.showWaterMark" @change="renderImage"/>
              </el-form-item>
              <el-form-item label="内容">
                <el-input v-model="shareConfig.watermarkText" :disabled="!shareConfig.showWaterMark" @change="renderImage" />
              </el-form-item>
              <el-form-item label="倾斜度">
                <el-input-number v-model="shareConfig.watermarkRotateDegrees" :min="-180" :max="180" :step="5" :disabled="!shareConfig.showWaterMark" @change="renderImage" />
              </el-form-item>
              <el-form-item label="横纵数">
                <el-input-number v-model="shareConfig.watermarkNumX" :min="0" :max="50" :step="1" :disabled="!shareConfig.showWaterMark" @change="renderImage" />
                <el-input-number v-model="shareConfig.watermarkNumY" :min="0" :max="50" :step="1" :disabled="!shareConfig.showWaterMark" @change="renderImage" />
              </el-form-item>
              <el-form-item label="字号">
                <el-input-number v-model="shareConfig.watermarkFontSize" :min="1" :max="600" :step="5" :disabled="!shareConfig.showWaterMark" @change="renderImage" />
              </el-form-item>
              <el-form-item label="字体">
                <el-select v-model="shareConfig.watermarkFontType" placeholder="字体选择" :disabled="!shareConfig.showWaterMark" @change="renderImage">
                  <el-option label="宋体" value="SimSun" />
                  <el-option label="黑体" value="SimHei" />
                  <el-option label="微软雅黑" value="Microsoft YaHei" />
                  <el-option label="楷体" value="KaiTi" />
                </el-select>
              </el-form-item>
              <el-form-item label="颜色">
                <el-color-picker v-model="shareConfig.watermarkTextColor" show-alpha :predefine="predefineColors1" :disabled="!shareConfig.showWaterMark" @change="renderImage"/>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="10">
        <el-form :model="shareConfig" label-width="auto" style="max-width: 600px">
          <el-form-item label="模板" @change="renderImage">
            <el-radio-group v-model="shareConfig.template">
              <el-radio value="color-card">颜色卡片</el-radio>
              <el-radio value="video-line">视频台词</el-radio>
              <el-radio value="pic-text">图文呈现</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图片URL" v-show="shareConfig.template == 'pic-text'">
            <el-input v-model="shareConfig.imageURL" @change="renderImage" />
          </el-form-item>
          <el-form-item label="图片位置" v-show="shareConfig.template == 'pic-text'">
            <el-radio-group v-model="shareConfig.imagePosition" @change="renderImage">
              <el-radio value="top">上</el-radio>
              <el-radio value="center">中</el-radio>
              <el-radio value="bottom">下</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上边界">
            <el-input-number v-model="shareConfig.proportionTextContainerHeight" :min="0.1" :step="0.02" :max="1" @change="renderImage" />
          </el-form-item>
          <el-form-item label="缩略比例">
            <el-input-number v-model="shareConfig.scale" :min="0.1" :step="0.1" :max="0.9" @change="renderImage" />
          </el-form-item>
          <el-form-item label="图片大小">
            <el-col :span="4">
              <el-switch v-model="shareConfig.proportionFixed" />
            </el-col>
            <el-col :span="10">
              <el-input-number v-model="shareConfig.width" :min="1" @change="renderImage" />
            </el-col>
            <el-col :span="10">
              <el-input-number v-model="shareConfig.height" :min="1" @change="renderImage" />
            </el-col>
          </el-form-item>
          <el-form-item label="背景色">
            <el-col :span="12">
              <el-color-picker v-model="shareConfigBackgroundColor1" :predefine="predefineColors1" @change="renderImage"/>
            </el-col>
            <el-col :span="12">
              <el-color-picker v-model="shareConfigBackgroundColor2" :predefine="predefineColors2" @change="renderImage"/>
            </el-col>
          </el-form-item>
          <el-form-item label="字体">
            <el-select v-model="shareConfig.fontType" placeholder="字体选择" @change="renderImage">
              <el-option label="宋体" value="SimSun" />
              <el-option label="黑体" value="SimHei" />
              <el-option label="微软雅黑" value="Microsoft YaHei" />
              <el-option label="楷体" value="KaiTi" />
            </el-select>
          </el-form-item>
          <el-form-item label="字号">
            <el-input-number v-model="shareConfig.fontSize" :min="1" :max="600" :step="5" @change="renderImage" />
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-color-picker v-model="shareConfig.textColor" :predefine="predefineColors1" @change="renderImage"/>
          </el-form-item>
          <el-form-item label="行高">
            <el-input-number v-model="shareConfig.lineHeight" :min="1" :max="800" :step="5" @change="renderImage" />
          </el-form-item>
          <el-form-item label="文本框宽度占比">
            <el-input-number v-model="shareConfig.proportionTextContainerWidth" :min="0.1" :step="0.1" :max="1" @change="renderImage" />
          </el-form-item>
          <el-form-item label="原图">
            <el-switch v-model="shareConfig.showSourceImg" />
            <el-button type="primary" @click="saveImage">下载</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <canvas ref="canvasScaled"></canvas>
      </el-col>
    </el-row>
    <el-row class="main-card" v-show="shareConfig.showSourceImg">
      <el-col :span="24">
        <canvas ref="canvasSource"></canvas>
      </el-col>
    </el-row>
    <el-Drawer v-model="isShowSayingDrawer" title="语录管理">
      <div id="table-container">
        <el-card>
          <el-form ref=formRef :model=formSaying label-width="70px" :rules="rules">
            <el-form-item label="语录" prop="name">
              <el-input v-model="formSaying.name" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input v-model="formSaying.author"></el-input>
            </el-form-item>
            <el-form-item label="书名" prop="book">
              <el-input v-model="formSaying.book"></el-input>
            </el-form-item>
            <el-form-item label="文章名" prop="article">
              <el-input v-model="formSaying.article" />
            </el-form-item>
            <el-form-item label="标签" prop="createDate">
              <Tag ref="tagRef" :tag-ids="selectRowTag" @emit-select-tag="handleEmitSelectTag"></Tag>
            </el-form-item>
          </el-form>
          <span class="dialog-footer">
            <el-button @click="clearSaying">清空</el-button>
            <el-button type="primary" @click="addSaying">{{ idEdit == null ? '插入' : '更新' }}</el-button>
          </span>
        </el-card>
      </div>
    </el-Drawer>
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, reactive } from 'vue'
import { sayingApi } from '@/api'
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'
import { Edit, Delete, Share } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import GG from '@/assets/111.jpg'
import { watch } from 'vue'
import Tag from '@/components/tag-manage/index.vue'

const tagRef = ref(null)
const isShowSayingDrawer = ref(false)
const formSaying = ref({
  name: '',
  author: '',
  book: '',
  article: ''
})
const formQuery = reactive({
  name: '',
  author: '',
  book: '',
  article: ''
})
const tags = ref([])
const selectRowTag = ref('')
const idEdit = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const totalSaying = ref(0)
const tableDataSaying = reactive([])
const activeNames = ref(['1'])
const shareConfig = reactive({
  template: 'color-card',
  fontType: 'SimSun',
  scale: 0.3,
  proportionFixed: true,
  width: 1080,
  height: 1920,
  fontSize: 100,
  lineHeight: 120,
  textColor: '#FFFFFF',
  proportionTextContainerWidth: 0.8,
  proportionTextContainerHeight: 0.2,
  showAuthor: true,
  authorPrefix: '@',
  authorTextAlign: 'left',
  authorFontSize: 70,
  authorFontType: 'SimSun',
  authorTextColor: '#FFFFFF',
  showWaterMark: true,
  watermarkText: '智言骗语',
  watermarkRotateDegrees: 60,
  watermarkFontSize: 20,
  watermarkFontType: 'SimSun',
  watermarkTextColor: 'rgba(255, 255, 255, 0.1)',
  watermarkNumX: 5,
  watermarkNumY: 8,
  showSourceImg: false,
  imageURL: 'https://puui.qpic.cn/vpic_cover/z0917cmilgt/z0917cmilgt_hz.jpg',
  imagePosition: 'center'
})
const shareConfigBackgroundColor1 = ref('#5c2223')
const shareConfigBackgroundColor2 = ref('#5c2223')
const predefineColors1 = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const predefineColors2 = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const canvasSource = ref(null)
const canvasScaled = ref(null)
const ctxSource = ref(null)
const ctxScaled = ref(null)
const canvasWidth = 512
const textShare = ref('')
const textAuthorShare = ref('')
const img = new Image()
onMounted(() => {
  initSayingCalendar()
  initSayingTable()
  renderImage()
}
)
watch(textShare, () => {
  renderImage()
})
/**
 * @description: 初始化语录日历图
 * @return {*}
 */
const initSayingCalendar = async () => {
  var chartDom = document.getElementById('container-saying')
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  const colorMain = 'Blue'
  var option

  const res = await sayingApi.getCountEveryDay()
  option = {
    tooltip: {  // 鼠标悬浮提示
      position: 'top',
      formatter: function (params) {
        var html = ''
        html += `<span style="color: ${colorMain}">${params.value[0]}：${params.value[1]}</span><br />`
        return html
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 5,
      inRange: {  // 方块颜色
        color: ['White', colorMain]
      }
    },
    calendar: {
      range: '2024',
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: res
    }
  }

  option && myChart.setOption(option)
}
const initSayingTable = () => {
  sayingApi.getSayingPageList({
    'current': currentPage.value,
    'size': pageSize.value,
    'name': formQuery.name,
    'author': formQuery.author,
    'book': formQuery.book,
    'article': formQuery.article,
    'tagIds': ''
  }).then(res => {
    tableDataSaying.length = 0
    tableDataSaying.push(...res.records)
    totalSaying.value = res.total
    textShare.value = res.records[0].name
    textAuthorShare.value = res.records[0].author
  })
}
const splitTags = (tagNames) => {
  if (!tagNames) return []
  return tagNames.split(',').map(tag => tag.trim())
}
const clearQuery = () => {
  formQuery.name = ''
  formQuery.author = ''
  formQuery.book = ''
  formQuery.article = ''
  initSayingTable()
}
const handleCurrentChange = () => {
  initSayingTable()
}
const handleSizeChange = () => {
  initSayingTable()
}
const handleShare = (index, row) => {
  textShare.value = row.name
  textAuthorShare.value = row.author
}
const handleEdit = (index, row) => {
  isShowSayingDrawer.value = true
  tagRef.value.clearSelectTag()
  idEdit.value = row.id
  formSaying.value.name = row.name
  formSaying.value.article = row.article
  formSaying.value.author = row.author
  formSaying.value.book = row.book
  selectRowTag.value = row.tagIds
}
const handleDelete = (index, row) => {
  ElMessageBox.confirm('永久删除，是否继续?', '警告', {}).then(() => {
    sayingApi.deleteSayingById(row.id).then(num => {
      if (num == 1) {
        initSayingCalendar()
        initSayingTable()
        ElMessage.success('删除语录成功')
      }    
    })
  })
}
/**
 * @description: 添加语录
 * @return {*}
 */
const addSaying = () => {
  if (idEdit.value) {
    const sayingEdit = formSaying.value
    sayingEdit.id = idEdit.value
    sayingEdit.tagIds = tags.value.join(',')
    sayingApi.updateSaying(sayingEdit).then(isSuccess => {
      if (isSuccess) {
        initSayingCalendar()
        initSayingTable()
        ElMessage.success('更新语录成功')
      }
    })
  } else {
    const sayingAdd = formSaying.value
    sayingAdd.tagIds = tags.value
    sayingAdd.tagIds = tags.value.join(',')
    sayingApi.addSaying(sayingAdd).then(isSuccess => {
      if (isSuccess) {
        initSayingCalendar()
        initSayingTable()
        ElMessage.success('添加语录成功')
      }
    })
  }
}
/**
 * @description: 清空语录表单
 * @return {*}
 */
const clearSaying = () => {
  idEdit.value = null
  formSaying.value.article = ''
  formSaying.value.author = ''
  formSaying.value.book = ''
  formSaying.value.name = ''
  tagRef.value.clearSelectTag()
}

const renderImage = () => {
  if (shareConfig.template == 'video-line') {
    img.src = GG
    img.onload = () => {
      renderImageVideoLine()
    }
  } else if (shareConfig.template == 'pic-text') {
    img.src = shareConfig.imageURL + '?v='+Math.random()
    img.crossOrigin= 'anonymous'
    img.onload = () => {
      renderImagePicText()
    }
  } else {
    img.src = GG
    img.onload = () => {
      renderImageOfColor()
    }
  }
}

const handleUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.src = e.target.result
    img.onload = () => {
      renderImageVideoLine(img)
    }
  }
  reader.readAsDataURL(file.raw)
  return false // Prevent auto upload  
}

const renderImageVideoLine = () => {
  const image = img
  // nextTick(() => {
  if (canvasSource.value) {
    const lines = textShare.value.split('\n')
    const scaleFactor = canvasWidth / image.width
    const scaledHeight = image.height * scaleFactor
    const imageLineHeight = shareConfig.lineHeight / scaleFactor
    ctxSource.value = canvasSource.value.getContext('2d')
    canvasSource.value.width = canvasWidth
    canvasSource.value.height = scaledHeight
    if (lines.length > 1) {
      canvasSource.value.height += (lines.length - 1) * shareConfig.lineHeight
    }
    //   ctxSource.value.clearRect(0, 0, canvasWidth, canvasSource.value.height)  
    ctxSource.value.drawImage(image, 0, 0, canvasWidth, (canvasWidth * image.height) / image.width)
    ctxSource.value.font = `${shareConfig.fontSize}px ${shareConfig.fontType}`
    ctxSource.value.fillStyle = 'white'
    ctxSource.value.textAlign = 'center'
    ctxSource.value.shadowColor = 'black'
    ctxSource.value.shadowBlur = 5
    ctxSource.value.shadowOffsetX = 2
    // ctxSource.value.fillText(textInput.value, 10, canvasSource.value.height - 30)

    for (let i = 0; i < lines.length; i++) {
      if (i > 0) {
        const sx = 0, sy = image.height - imageLineHeight, sw = image.width, sh = imageLineHeight
        const dx = 0, dy = scaledHeight + (i - 1) * shareConfig.lineHeight, dw = canvasSource.value.width, dh = shareConfig.lineHeight
        ctxSource.value.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
      }
      const y = scaledHeight + i * shareConfig.lineHeight - (shareConfig.lineHeight - shareConfig.fontSize) / 2
      ctxSource.value.fillText(lines[i], canvasSource.value.width / 2, y)
    }
  }
  // })
}

const renderImagePicText = () => {
  const image = img
  if (canvasSource.value) {
    ctxSource.value = canvasSource.value.getContext('2d')
    canvasSource.value.width = shareConfig.width
    canvasSource.value.height = shareConfig.height
    // 设置背景色
    setBackgroundColor()
    // 绘制图片
    let imageY = 0
    if (shareConfig.imagePosition == 'top') {
      imageY = 0
    } else if (shareConfig.imagePosition == 'center') {
      imageY = (canvasSource.value.height - image.height) / 2
    } else {
      imageY = canvasSource.value.height - image.height
    }
    ctxSource.value.drawImage(image, 0, imageY)
    // 绘制文本
    ctxSource.value.font = `${shareConfig.fontSize}px ${shareConfig.fontType}`
    ctxSource.value.fillStyle = shareConfig.textColor
    ctxSource.value.shadowColor = 'black'
    ctxSource.value.shadowBlur = 50
    ctxSource.value.shadowOffsetX = 2
    const maxWidth = canvasSource.value.width * shareConfig.proportionTextContainerWidth
    let startX = canvasSource.value.width * (1 - shareConfig.proportionTextContainerWidth) / 2 // 起始X坐标  
    let startY = canvasSource.value.height * shareConfig.proportionTextContainerHeight // 起始Y坐标  
    const newXY = setText(startX, startY, maxWidth)
    startX = newXY[0]
    startY = newXY[1]
    setWatermark()
    scaleCanvas()
  }
}

/**
 * @description: 渲染颜色图片
 * @return {*}
 */
const renderImageOfColor = () => {
  if (canvasSource.value) {
    ctxSource.value = canvasSource.value.getContext('2d')
    canvasSource.value.width = shareConfig.width
    canvasSource.value.height = shareConfig.height
    setBackgroundColor()
    // 文字内容
    ctxSource.value.font = `${shareConfig.fontSize}px ${shareConfig.fontType}`
    ctxSource.value.fillStyle = shareConfig.textColor
    // ctxSource.value.textAlign = 'center'
    ctxSource.value.shadowColor = 'black'
    ctxSource.value.shadowBlur = 50
    ctxSource.value.shadowOffsetX = 2
    const maxWidth = canvasSource.value.width * shareConfig.proportionTextContainerWidth
    let startX = canvasSource.value.width * (1 - shareConfig.proportionTextContainerWidth) / 2 // 起始X坐标  
    let startY = canvasSource.value.height * shareConfig.proportionTextContainerHeight // 起始Y坐标  
    const newXY = setText(startX, startY, maxWidth)
    startX = newXY[0]
    startY = newXY[1]
    // 文字作者
    if(shareConfig.showAuthor) {
      ctxSource.value.font = `${shareConfig.authorFontSize}px ${shareConfig.authorFontType}`
      ctxSource.value.fillStyle = shareConfig.authorTextColor
      ctxSource.value.textAlign = shareConfig.authorTextAlign
      ctxSource.value.fillText(`${shareConfig.authorPrefix}${textAuthorShare.value}`, startX, startY)
    }
    // 水印
    setWatermark()
    scaleCanvas()
  }
}
/**
 * @description: 设置水印
 * @return {*}
 */
const setWatermark = () => {
  if(shareConfig.showWaterMark) {
    const watermarkText = shareConfig.watermarkText
    const angle = shareConfig.watermarkRotateDegrees * (Math.PI / 180)  
    const textWidth = ctxSource.value.measureText(watermarkText).width  
    const textHeight = 30 // 假设字体高度是30px  
    const xNum = shareConfig.watermarkNumX
    const yNum = shareConfig.watermarkNumY
    for (let i = 0; i < xNum; i++) {  
      for (let j = 0; j < yNum; j++) {  
        const x = i * (canvasSource.value.width / xNum) + (canvasSource.value.width / (xNum * 2)) - textWidth / 2  
        const y = j * (canvasSource.value.height / yNum) + (canvasSource.value.height / (yNum * 2)) + textHeight / 2  
        ctxSource.value.save()  
        ctxSource.value.translate(x, y)  
        ctxSource.value.rotate(angle)  
        ctxSource.value.font = `${shareConfig.watermarkFontSize}px ${shareConfig.watermarkFontType}`  
        ctxSource.value.fillStyle = shareConfig.watermarkTextColor  
        ctxSource.value.fillText(watermarkText, 0, 0)  
        ctxSource.value.restore()  
      }  
    }
  }
}
/**
 * @description: 设置背景色
 * @return {*}
 */
const setBackgroundColor = () => {
  // 背景色
  if(shareConfigBackgroundColor1.value == shareConfigBackgroundColor2.value) {
    // 纯色
    ctxSource.value.fillStyle = shareConfigBackgroundColor1.value
  } else {
    // 渐变色
    const gradient = ctxSource.value.createLinearGradient(0, 0, canvasSource.value.width, canvasSource.value.height)
    gradient.addColorStop(0, shareConfigBackgroundColor1.value)  
    gradient.addColorStop(1, shareConfigBackgroundColor2.value)
    ctxSource.value.fillStyle = gradient
  }
  ctxSource.value.fillRect(0, 0, canvasSource.value.width, canvasSource.value.height)
}
/**
 * @description: 绘制文字
 * @return {*}
 */
const setText = (startX, startY, maxWidth) => {
  const linesHand = textShare.value.split('\n')
  for (let i = 0; i < linesHand.length; i++) {
    const lineHand = linesHand[i]
    const words = lineHand.split('')
    let currentLine = ''
    for (let n = 0; n < words.length; n++) {
      const testLine = currentLine + words[n]  
      const metrics = ctxSource.value.measureText(testLine)
      const testWidth = metrics.width

      if (testWidth > maxWidth && n > 0) {
        ctxSource.value.fillText(currentLine, startX, startY) 
        currentLine = words[n]   
        startY += shareConfig.lineHeight 
      } else {
        currentLine = testLine
      }
    }
    ctxSource.value.fillText(currentLine, startX, startY)
    startY += shareConfig.lineHeight
  }
  return {
    startX,
    startY
  }
}
/**
 * @description: 缩放图片
 * @return {*}
 */
const scaleCanvas = () => {
  const scaleFactor = shareConfig.scale
  canvasScaled.value.width = canvasSource.value.width * scaleFactor
  canvasScaled.value.height = canvasSource.value.height * scaleFactor
  ctxScaled.value = canvasScaled.value.getContext('2d')
  ctxScaled.value.drawImage(canvasSource.value, 0, 0, canvasSource.value.width, canvasSource.value.height,   
    0, 0, canvasScaled.value.width, canvasScaled.value.height)
}
/**
 * @description: 保存图片
 * @return {*}
 */
const saveImage = () => {
  if (canvasSource.value) {
    const link = document.createElement('a')
    link.download = `${textAuthorShare.value}@${textShare.value.substring(0, 5)}@${new Date().getTime()}.png`
    link.href = canvasSource.value.toDataURL()
    link.click()
    ElMessage.success('图片已保存!')
  }
}
const handleDrawerShow = () => {
  isShowSayingDrawer.value = true
  clearSaying()
}
const handleEmitSelectTag = (val) => {
  tags.value = val
}
</script>
<style scoped>
.calendar-box {
  width: 100%;
}

.container-calendar {
  width: 100%;
  height: 200px;
}

.el-row {
  padding: 10px 20px;
  border: 1px solid #00000030;
  border-radius: 10px;
  box-shadow: 8px 5px #1883c408;
  margin: 10px 0px;
}
.main-card {
  background-color: #FFFFFF;
}
</style>
