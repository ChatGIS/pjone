<template>
  <div>
    <el-dialog v-model="isShowDialogInit" title="提醒" width="500" align-center>
      <span>是否进入闹钟模式</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="isShowDialogInit = false">
            OK
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-card class="main-card">
      <DeskStatus ref="refDeskStatus"></DeskStatus>
    </el-card>
    <el-row class="main-card">
      <el-col :span="18">
        <div class="calendar-box">
          <div id="container-up" class="container-calendar"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <UpCounter></UpCounter>
      </el-col>
    </el-row>
    <el-card class="main-card">
      <el-row>
        <el-col :span="6">
          <MusicPlayer ref="refMusicPlayer" />
        </el-col>
      </el-row>
    </el-card>
    <el-card class="main-card">
      <el-row>
        <el-col :span="24">
          <div id="container-line-weight"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'
import { lifeWeightApi, lifeSitApi } from '@/api/index'
import MusicPlayer from '@/components/MusicPlayer.vue'
import UpCounter from '@/components/UpCounter.vue'
import DeskStatus from './DeskStatus.vue'

const refDeskStatus = ref()
const refMusicPlayer = ref()
let timerId
let isShowDialogInit = ref(false)
onMounted(() => {
  initWeight()
  timerId = setInterval(handleRefresh, 60 * 1000) // 每60000毫秒（即1分钟）调用一次updateTime
  isShowDialogInit.value = true
  initUpCalendar()
})
onUnmounted(() => {
  clearInterval(timerId)
})
const handleRefresh = () => {
  if (refDeskStatus.value) {
    refDeskStatus.value.refreshDeskStatusTimeline()
  }
  initUpCalendar()
}
/**
 * @description: 初始化体重图表
 * @return {*}
 */
const initWeight = async () => {
  const res = await lifeWeightApi.getWeight()
  const yData1 = []
  const yData2 = Array(19).fill(null)
  const xData = []
  for (let i = 0; i < res.length; i++) {
    if (!xData.includes(res[i].doDate)) {
      xData.push(res[i].doDate)
    }
    if (res[i].name == 1) {
      yData1.push(res[i].weight)
    } else {
      yData2.push(res[i].weight)
    }
  }
  var chartDom = document.getElementById('container-line-weight')
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.name}: ${params.value}`
      }
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      show: false,
      min: 110,
      max: 160
    },
    series: [
      {
        name: 'Sleep',
        type: 'line',
        radius: '40%',
        data: yData1,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          position: 'top',
          overflow: 'none',
          formatter: function (params) {
            return (
              params.value + '-' + (params.value / 2 / (1.71 * 1.71)).toFixed(1)
            )
          }
        },
        markLine: {
          data: [
            {
              name: 'Good',
              yAxis: 140
            }
          ],
          label: {
            show: true,
            formatter: (data) => {
              return data.value
            }
          },
          symbol: 'none'
        },
        itemStyle: {
          normal: {
            color: function (params) {
              const bmi = params.data / 2 / (1.71 * 1.71)
              let color = '#000000'
              if (bmi <= 18.4) color = '#AAAAAA'
              if (bmi > 18.4 && bmi <= 23.9) color = '#006400'
              if (bmi > 23.9 && bmi <= 27.9) color = '#FFFF00'
              if (bmi > 27.9 && bmi <= 32) color = '#FFA500'
              if (bmi > 32) color = '#8B0000'
              return color
            }
          }
        }
      },
      {
        name: 'Sleep',
        type: 'line',
        radius: '40%',
        data: yData2,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          position: 'top',
          overflow: 'none',
          formatter: function (params) {
            return (
              params.value + '-' + (params.value / 2 / (1.6 * 1.6)).toFixed(1)
            )
          }
        },
        markLine: {
          data: [
            {
              name: 'Good',
              yAxis: 120
            }
          ],
          label: {
            show: true,
            formatter: (data) => {
              return data.value
            }
          },
          symbol: 'none'
        },
        itemStyle: {
          normal: {
            color: function (params) {
              const bmi = params.data / 2 / (1.6 * 1.6)
              let color = '#000000'
              if (bmi <= 18.4) color = '#AAAAAA'
              if (bmi > 18.4 && bmi <= 23.9) color = '#006400'
              if (bmi > 23.9 && bmi <= 27.9) color = '#FFFF00'
              if (bmi > 27.9 && bmi <= 32) color = '#FFA500'
              if (bmi > 32) color = '#8B0000'
              return color
            }
          }
        }
      }
    ]
  }
  option && myChart.setOption(option)
}
const initUpCalendar = async () => {
  var chartDom = document.getElementById('container-up')
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  const colorMain = 'green'
  var option

  const res = await lifeSitApi.getCountEveryDay()
  option = {
    tooltip: {
      // 鼠标悬浮提示
      position: 'top',
      formatter: function (params) {
        var html = ''
        html += `<span style="color: ${colorMain}">${params.value[0]}：${params.value[1]}</span><br />`
        return html
      }
    },
    visualMap: {
      show: false,
      min: 0,
      max: 50,
      inRange: {
        // 方块颜色
        color: ['White', colorMain]
      }
    },
    calendar: {
      range: [
        new Date().getFullYear() -
          1 +
          '-' +
          (new Date().getMonth() + 1) +
          '-' +
          new Date().getDate(),
        new Date().getFullYear() +
          '-' +
          (new Date().getMonth() + 1) +
          '-' +
          new Date().getDate()
      ],
      dayLabel: {
        firstDay: 1,
        nameMap: 'ZH'
      },
      monthLabel: {
        nameMap: 'ZH'
      }
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
<style scoped>
.main-card {
  background-color: #ffffff;
  padding: 10px 20px;
  border: 1px solid #00000030;
  border-radius: 10px;
  box-shadow: 8px 5px #1883c408;
  margin: 10px 0px;
}

#container-line-weight {
  width: 100%;
  height: 300px;
}
.container-calendar {
  width: 100%;
  height: 200px;
}
</style>
