<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-button @click="sayingDrawer = true" text>WHO SAY</el-button>
        <div class="calendar-box">
          <div id="container-saying" class="container-calendar"></div>
        </div>
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
import { onMounted, ref } from 'vue'
import { sayingApi } from '@/api'
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'

const sayingDrawer = ref(false)
const formSaying = ref({
  name: '',
  author: '',
  book: '',
  article: ''
})
onMounted(() => {
  initSayingCalendar()
}
)
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
</style>
