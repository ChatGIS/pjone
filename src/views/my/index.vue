<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-05-21 10:03:48
 * @FilePath: \pjone\src\views\my\index.vue
 * @Description: 
-->
<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { lifeColorApi, sayingApi } from '@/api'

const tableData = ref([])
onMounted(() => {
  initLifeColorList()

  initSaying()
  initLifeColor()
}
)
const initLifeColorList = () => {
  lifeColorApi.getLifeColorList().then(res => {
    tableData.value = res
  })
}
const initLifeColor = async () => {
  var chartDom = document.getElementById('container-l-c-y')
  var myChart = echarts.init(chartDom)
  const colorMain = 'rgb(254, 204, 17)'
  var option
  const res = await lifeColorApi.getRecordsNum()
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
      max: 3,
      inRange: {  // 方块颜色
        color: ['White', colorMain]
      }
    },
    calendar: {
      range: '2024'
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: res
    }
  }

  option && myChart.setOption(option)
}
const initSaying = async () => {
  var chartDom = document.getElementById('container-saying')
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
</script>

<template>
  <el-row>
    <el-col :span="16">
      <div class="calendar-box">
        <div id="container-l-c-y" class="calendar-container"></div>
        <div id="container-saying" class="calendar-container"></div>
      </div>
    </el-col>
    <el-col :span="8">
      <div id="table-container">
        <el-table ref="singleTableRef" :data="tableData" highlight-current-row style="width: 100%"
          @current-change="handleCurrentChange">
          <el-table-column type="index" width="50" />
          <el-table-column property="doDate" label="日期"/>
          <el-table-column property="type" label="类型"/>
          <el-table-column property="minute" label="时长" />
          <el-table-column property="num" label="次数"  width="60"/>
        </el-table>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.calendar-box {
  width: 100%;
}

.calendar-container {
  width: 100%;
  height: 200px;
}
</style>
