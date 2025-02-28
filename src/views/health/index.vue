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
      <el-row>
        <el-col :span="24">
          <el-button
            type="primary"
            :icon="Download"
            :disabled="currentType === 1"
            @click="handleWorkStyle(1)"
            circle
          />
          <el-button
            type="success"
            :icon="Upload"
            :disabled="currentType === 2"
            @click="handleWorkStyle(2)"
            circle
          />
          <el-button
            type="warning"
            :icon="DArrowRight"
            :disabled="currentType === 3"
            @click="handleWorkStyle(3)"
            circle
          />
          <el-button
            type="danger"
            :icon="AlarmClock"
            :disabled="!isShowDelay"
            @click="handleDelayClock(1)"
            circle
            >{{ delayNum }}</el-button
          >
          <div class="progress-container">
            <div class="progress-bar">
              <div
                v-for="(segment, index) in timeline"
                :key="index"
                :class="['segment', segment.color]"
                :style="{
                  width: `${segment.width}%`,
                  left: `${segment.left}%`
                }"
              >
                {{ segment.duration }}
              </div>
            </div>
            <div class="timeline-labels">
              <div
                v-for="(segment, index) in timeline"
                :key="index"
                class="timeline-label"
                :style="{
                  left: `${segment.left + segment.width}%`,
                  top: `${segment.top}px`
                }"
              >
                {{ segment.label }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
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
import { onMounted, onUnmounted, h, ref } from 'vue'
import { lifeWeightApi, lifeSitApi } from '@/api/index'
import {
  Upload,
  Download,
  DArrowRight,
  AlarmClock
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MusicPlayer from '@/components/MusicPlayer.vue'
import UpCounter from '@/components/UpCounter.vue'

const refMusicPlayer = ref()
const currentType = ref()
const timeline = ref([])
let timerId
let audioAlarmClock
let delayNum = ref(0)
let isShowDelay = ref(false)
let isShowDialogInit = ref(false)
onMounted(() => {
  initWeight()
  audioAlarmClock = new Audio('http://localhost:1301/mymedia/test.mp3')
  refreshSit()
  timerId = setInterval(handleRefresh, 60 * 1000) // 每60000毫秒（即1分钟）调用一次updateTime
  isShowDelay.value = localStorage.getItem('isShowDelay')
  isShowDialogInit.value = true
  initUpCalendar()
})
onUnmounted(() => {
  clearInterval(timerId)
})
const handleRefresh = () => {
  refreshSit()
  initUpCalendar()
}
/**
 * @description: 处理工作状态
 * @param {*} type
 * @return {*}
 */
const handleWorkStyle = (type) => {
  handleDelayClock(0)
  currentType.value = type
  let content = ''
  let color = '#e6a23c'
  if (type === 1) {
    content = 'sit down'
    color = '#409eff'
  } else if (type === 2) {
    content = 'stand up'
    color = '#67c23a'
  } else if (type === 3) {
    content = 'walk'
    color = '#e6a23c'
    delayNum.value = 3
    refMusicPlayer.value.handlePause()
  }
  lifeSitApi.addSit(type).then((res) => {
    if (res) {
      ElMessage({
        message: h('p', { style: 'line-height: 1; font-size: 24px' }, [
          h('span', { style: `color: ${color}` }, content)
        ])
      })
      refreshSit()
    } else {
      ElMessage.error('操作失败')
    }
  })
}
/**
 * @description: 刷新数据
 * @return {*}
 */
const refreshSit = async () => {
  const res = await lifeSitApi.getSits()
  timeline.value.splice(0, timeline.value.length)
  timeline.value.push(...convertData(res))
  // 控制闹钟音频
  const lastIndex = timeline.value.length - 1
  const duration = timeline.value[lastIndex].duration
  let delayNumStorage = localStorage.getItem('delayNum')
  delayNum.value = delayNumStorage
  let delayLong = 30 + 10 * delayNum.value
  if (timeline.value[lastIndex].color != 'orange') {
    if (duration == delayLong && delayNum.value <= 2) {
      audioAlarmClock.play()
      if (delayNum.value < 2) {
        isShowDelay.value = true
        localStorage.setItem('isShowDelay', true)
      }
    } else {
      delayNum.value = Math.ceil((duration - 30) / 10)
      delayNum.value = delayNum.value < 0 ? 0 : delayNum.value
      localStorage.setItem('delayNum', delayNum.value)
      isShowDelay.value = false
      localStorage.setItem('isShowDelay', false)
      audioAlarmClock.pause()
      audioAlarmClock.currentTime = 0
    }
  }
}
/**
 * @description: 闹钟延迟、关闭闹钟音频
 * @param {*} num
 * @return {*}
 */
const handleDelayClock = (num) => {
  delayNum.value = parseInt(delayNum.value) + num
  if (num == 0) {
    delayNum.value = 0
  }
  isShowDelay.value = false
  localStorage.setItem('isShowDelay', false)
  localStorage.setItem('delayNum', delayNum.value)
  audioAlarmClock.pause()
  audioAlarmClock.currentTime = 0
}
/**
 * @description: 转换数据为时间轴
 * @param {*} data
 * @return {*}
 */
const convertData = (data) => {
  const colors = {
    1: 'blue',
    2: 'green',
    3: 'orange',
    4: 'red'
  }
  const tops = {
    1: '-30',
    2: '-15',
    3: '0'
  }

  // 先按时间排序
  data.sort((a, b) => new Date(a.doDate) - new Date(b.doDate))

  let trueColor = 'NoColor'
  const timeline = []
  let preTimePoint = null
  let top = 0

  data.forEach((item, index) => {
    const timePoint = new Date(item.doDate)
    const label = formatTime(timePoint)

    if (preTimePoint === null) {
      // 第一个时间段从早上8点开始
      preTimePoint = new Date(timePoint)
      preTimePoint.setHours(8, 0, 0, 0)
    }

    const duration = (timePoint - preTimePoint) / (1000 * 60) // 计算时间差（分钟）
    const width = (duration / (12 * 60)) * 100 // 按照时间条长度为12h计算宽度
    const left =
      index === 0 ? 0 : timeline[index - 1].left + timeline[index - 1].width

    timeline.push({
      label: label,
      duration: Math.floor(duration),
      width: width,
      left: left,
      color: trueColor,
      top: tops[item.type]
    })
    // timeline[0].color = '#0000AA'
    preTimePoint = timePoint
    trueColor = colors[item.type]
  })
  // 增加最后一个时间段，从最后一个时间点到当前时间点
  const lastTimePoint = new Date()
  let lastDuration = (lastTimePoint - preTimePoint) / (1000 * 60)
  const lastWidth = (lastDuration / (12 * 60)) * 100
  const lastLeft =
    timeline.length === 0
      ? 0
      : timeline[timeline.length - 1].left + timeline[timeline.length - 1].width
  currentType.value = parseInt(data[data.length - 1].type)
  lastDuration = Math.floor(lastDuration)
  if (lastDuration < 0) {
    lastDuration = 0
  }
  timeline.push({
    label: formatTime(lastTimePoint),
    duration: lastDuration,
    width: lastWidth,
    left: lastLeft,
    color: colors[currentType.value],
    top: tops[currentType.value]
  })
  return timeline
}

/**
 * @description: 格式化时间
 * @param {*} date
 * @return {*}
 */
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
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

.progress-container {
  position: relative;
  width: 100%;
  height: 60px;
  background-color: #f3f3f3;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.segment {
  position: absolute;
  top: 0;
  height: 100%;
  transition: width 0.3s ease;
}

.blue {
  background-color: #409eff;
}

.green {
  background-color: #67c23a;
}

.orange {
  background-color: #e6a23c;
}

.red {
  background-color: #f56c6c;
}

.timeline-labels {
  position: absolute;
  top: 45px;
  left: 0;
  width: 100%;
  text-align: center;
}

.timeline-label {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  font-size: 12px;
  color: #606266;
}
.container-calendar {
  width: 100%;
  height: 200px;
}
</style>
