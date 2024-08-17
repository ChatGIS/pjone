<template>
  <div>
    <el-row class="main-card">
      <el-col :span="24">
        <el-button @click="sayingDrawer = true" text>WHO SAY</el-button>
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
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button type="success" :icon="Share" circle @click="handleShare(scope.$index, scope.row)" />
            <el-button type="primary" :icon="Edit" circle @click="handleEdit(scope.$index, scope.row)" />
            <el-button type="danger" circle :icon="Delete" @click="handleDelete(scope.$index, scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 8, 10, 20, 50]"
        :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next" :total="totalSaying"
        @current-change="handleCurrentChange" @size-change="handleSizeChange" />
    </el-row>
    <el-row class="main-card">
      <el-col :span="6">
        <el-input v-model="textShare" :rows="10" type="textarea" placeholder="分享文字"/>
      </el-col>
      <el-col :span="6">
        <el-form :model="shareConfig" label-width="auto" style="max-width: 600px">
          <el-form-item label="模板" @change="renderImage">
            <el-radio-group v-model="shareConfig.template">
              <el-radio value="color-card">颜色卡片</el-radio>
              <el-radio value="video-line">视频台词</el-radio>
              <el-radio value="pic-text">图文呈现</el-radio>
            </el-radio-group>
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
          <el-form-item label="行高">
            <el-input-number v-model="shareConfig.lineHeight" :min="1" :max="800" :step="5" @change="renderImage" />
          </el-form-item>
          <el-form-item label="原图">
            <el-switch v-model="shareConfig.showSourceImg" />
            <el-button type="primary" @click="onSubmit">下载</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <canvas ref="canvasScaled"></canvas>
      </el-col>
    </el-row>
    <el-row class="main-card" v-show="shareConfig.showSourceImg">
      <el-col :span="24">
        <canvas ref="canvasVideoLines"></canvas>
      </el-col>
    </el-row>
    <el-Drawer v-model="sayingDrawer" title="语录管理" :direction="direction" :before-close="handleClose">
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
          </el-form>
          <span class="dialog-footer">
            <el-button @click="clearSaying">清空</el-button>
            <el-button type="primary" @click="addSaying">确认</el-button>
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
import GG from '@/assets/111.jpg'
import { watch } from 'vue'

const sayingDrawer = ref(false)
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
const currentPage = ref(1)
const pageSize = ref(5)
const totalSaying = ref(0)
const tableDataSaying = reactive([])
const shareConfig = reactive({
  template: 'color-card',
  fontType: 'SimSun',
  scale: 0.3,
  proportionFixed: true,
  width: 1080,
  height: 1920,
  fontSize: 100,
  lineHeight: 120,
  showSourceImg: false,
})
const canvasVideoLines = ref(null)
const canvasScaled = ref(null)
const ctxVideoLines = ref(null)
const ctxScaled = ref(null)
const canvasWidth = 512
const textShare = ref('如果你不够优秀\n人脉是不值钱的\n它不是追求来的\n而是吸引来的\n只有等价的交换\n才能得到合理的帮助\n虽然听起来很冷\n但这是事实')
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
    'article': formQuery.article
  }).then(res => {
    tableDataSaying.length = 0
    tableDataSaying.push(...res.records)
    totalSaying.value = res.total
  })
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
}
/**
 * @description: 添加语录
 * @return {*}
 */
const addSaying = () => {
  sayingApi.addSaying(formSaying.value).then(num => {
    if (num == 1) {
      initSayingCalendar()
      ElMessage.success('添加语录成功')
    }
  })
}
/**
 * @description: 清空语录表单
 * @return {*}
 */
const clearSaying = () => {
  formSaying.value.article = ''
  formSaying.value.author = ''
  formSaying.value.book = ''
  formSaying.value.name = ''
}

const renderImage = () => {
  if (shareConfig.template == 'video-line') {
    img.src = GG
    img.onload = () => {
      renderImageVideoLine()
    }
  } else if (shareConfig.template == 'pic-text') {
    img.src = GG
    img.onload = () => {
      renderImagePicText()
    }
  } else {
    img.src = GG
    img.onload = () => {
      renderImageOnlyColor()
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
  if (canvasVideoLines.value) {
    const lines = textShare.value.split('\n')
    const scaleFactor = canvasWidth / image.width
    const scaledHeight = image.height * scaleFactor
    const imageLineHeight = shareConfig.lineHeight / scaleFactor
    ctxVideoLines.value = canvasVideoLines.value.getContext('2d')
    canvasVideoLines.value.width = canvasWidth
    canvasVideoLines.value.height = scaledHeight
    if (lines.length > 1) {
      canvasVideoLines.value.height += (lines.length - 1) * shareConfig.lineHeight
    }
    //   ctxVideoLines.value.clearRect(0, 0, canvasWidth, canvasVideoLines.value.height)  
    ctxVideoLines.value.drawImage(image, 0, 0, canvasWidth, (canvasWidth * image.height) / image.width)
    ctxVideoLines.value.font = `${shareConfig.fontSize}px ${shareConfig.fontType}`
    ctxVideoLines.value.fillStyle = 'white'
    ctxVideoLines.value.textAlign = 'center'
    ctxVideoLines.value.shadowColor = 'black'
    ctxVideoLines.value.shadowBlur = 5
    ctxVideoLines.value.shadowOffsetX = 2
    // ctxVideoLines.value.fillText(textInput.value, 10, canvasVideoLines.value.height - 30)

    for (let i = 0; i < lines.length; i++) {
      if (i > 0) {
        const sx = 0, sy = image.height - imageLineHeight, sw = image.width, sh = imageLineHeight
        const dx = 0, dy = scaledHeight + (i - 1) * shareConfig.lineHeight, dw = canvasVideoLines.value.width, dh = shareConfig.lineHeight
        ctxVideoLines.value.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
      }
      const y = scaledHeight + i * shareConfig.lineHeight - (shareConfig.lineHeight - shareConfig.fontSize) / 2
      ctxVideoLines.value.fillText(lines[i], canvasVideoLines.value.width / 2, y)
    }
  }
  // })
}

const renderImagePicText = () => {
  const image = img
  if (canvasVideoLines.value) {
    const lines = textShare.value.split(/\s+/)
    const scaleFactor = canvasWidth / image.width
    const scaledHeight = image.height * scaleFactor + 200
    const imageLineHeight = shareConfig.lineHeight / scaleFactor
    ctxVideoLines.value = canvasVideoLines.value.getContext('2d')
    canvasVideoLines.value.width = canvasWidth
    canvasVideoLines.value.height = scaledHeight
    //   ctxVideoLines.value.clearRect(0, 0, canvasWidth, canvasVideoLines.value.height)  
    ctxVideoLines.value.drawImage(image, 0, 0, canvasWidth, (canvasWidth * image.height) / image.width)
    ctxVideoLines.value.font = `${shareConfig.fontSize}px ${shareConfig.fontType}`
    ctxVideoLines.value.fillStyle = 'white'
    ctxVideoLines.value.textAlign = 'center'
    ctxVideoLines.value.shadowColor = 'black'
    ctxVideoLines.value.shadowBlur = 5
    ctxVideoLines.value.shadowOffsetX = 2
    // ctxVideoLines.value.fillText(textShare.value, canvasVideoLines.value.width / 2, canvasVideoLines.value.height - 80)

    const maxWidth = canvasVideoLines.value.width * 0.8 // 允许的最大宽度  
    const words = textShare.value.split('') // 按空格分割单词 
    let line = '' // 当前行的文本 
    const startX = canvasVideoLines.value.width / 2 // 起始X坐标  
    let startY = canvasVideoLines.value.height / 2 // 起始Y坐标  
    // 遍历每个单词，决定是否换行  
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + '' // 测试添加单词后的行  
      const metrics = ctxVideoLines.value.measureText(testLine)
      const testWidth = metrics.width

      if (testWidth > maxWidth && n > 0) {
        ctxVideoLines.value.fillText(line, startX, startY) // 绘制当前行  
        line = words[n] + ' ' // 重新开始新行  
        startY += shareConfig.lineHeight // 移动到下一行  
      } else {
        line = testLine // 更新当前行  
      }
    }
    ctxVideoLines.value.fillText(line, startX, startY + 100) // 绘制最后一行  
  }
}

const renderImageOnlyColor = () => {
  if (canvasVideoLines.value) {
    ctxVideoLines.value = canvasVideoLines.value.getContext('2d')
    // ctxVideoLines.value.scale(0.1, 0.1)

    canvasVideoLines.value.width = shareConfig.width
    canvasVideoLines.value.height = shareConfig.height
    
    //   ctxVideoLines.value.clearRect(0, 0, canvasWidth, canvasVideoLines.value.height)  
    // ctxVideoLines.value.drawImage(image, 0, 0, canvasWidth, (canvasWidth * image.height) / image.width)
    // ctxVideoLines.value.fillStyle = 'red' // 背景颜色  

    // 创建线性渐变  
    const gradient = ctxVideoLines.value.createLinearGradient(0, 0, canvasVideoLines.value.width, canvasVideoLines.value.height)
    gradient.addColorStop(0, 'lightblue') // 起始颜色  
    gradient.addColorStop(1, 'orange') // 结束颜色  

    // 设置渐变色作为背景  
    ctxVideoLines.value.fillStyle = gradient

    ctxVideoLines.value.fillRect(0, 0, canvasVideoLines.value.width, canvasVideoLines.value.height) // 绘制矩形覆盖整个 canvas
    ctxVideoLines.value.fillStyle
    ctxVideoLines.value.font = `${shareConfig.fontSize}px ${shareConfig.fontType}`
    ctxVideoLines.value.fillStyle = 'white'
    ctxVideoLines.value.textAlign = 'center'
    ctxVideoLines.value.shadowColor = 'black'
    ctxVideoLines.value.shadowBlur = 5
    ctxVideoLines.value.shadowOffsetX = 2
    // ctxVideoLines.value.fillText(textShare.value, canvasVideoLines.value.width / 2, canvasVideoLines.value.height - 80)

    const maxWidth = canvasVideoLines.value.width * 0.8 // 允许的最大宽度  
    const words = textShare.value.split('') // 按空格分割单词 
    let line = '' // 当前行的文本 
    const startX = canvasVideoLines.value.width / 2 // 起始X坐标  
    let startY = canvasVideoLines.value.height / 2 // 起始Y坐标  
    // 遍历每个单词，决定是否换行  
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + '' // 测试添加单词后的行  
      const metrics = ctxVideoLines.value.measureText(testLine)
      const testWidth = metrics.width

      if (testWidth > maxWidth && n > 0) {
        ctxVideoLines.value.fillText(line, startX, startY) // 绘制当前行  
        line = words[n] + ' ' // 重新开始新行  
        startY += shareConfig.lineHeight // 移动到下一行  
      } else {
        line = testLine // 更新当前行  
      }
    }
    ctxVideoLines.value.fillText(line, startX, startY) // 绘制最后一行  

    // 等比例放大的比例因子  
    const scaleFactor = shareConfig.scale

    canvasScaled.value.width = canvasVideoLines.value.width * scaleFactor
    canvasScaled.value.height = canvasVideoLines.value.height * scaleFactor
    ctxScaled.value = canvasScaled.value.getContext('2d')
    ctxScaled.value.drawImage(canvasVideoLines.value, 0, 0, canvasVideoLines.value.width, canvasVideoLines.value.height,   
      0, 0, canvasScaled.value.width, canvasScaled.value.height)
  }
}

const saveImage = () => {
  if (canvasVideoLines.value) {
    const link = document.createElement('a')
    link.download = 'screenshot.png'
    link.href = canvasVideoLines.value.toDataURL()
    link.click()
    ElMessage.success('图片已保存!')
  }
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
