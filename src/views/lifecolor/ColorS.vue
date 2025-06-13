<template>
  <el-row>
    <el-col :span="6">
      <div id="container-pie-s-point"></div>
    </el-col>
    <el-col :span="6">
      <div id="container-pie-s-long"></div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="18">
      <div id="container-line-s-point"></div>
    </el-col>
    <el-col :span="6">
      <div id="container-pie-s-point-day"></div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="18">
      <div id="container-bar-s-long"></div>
    </el-col>
    <el-col :span="6">
      <div id="container-pie-s-long-day"></div>
    </el-col>
  </el-row>
  <el-input-number
    v-model="sDays"
    :min="0"
    :max="60"
    :step="5"
    @change="handleChangeSDays"
  />
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { lifeColorApi } from '@/api'
import 'element-plus/es/components/message/style/css'

const sDays = ref(30)
const colors = ['#006400', '#9ACD32', '#FFA500', '#8B0000']
onMounted(() => {
  initSleepMonthChart()
  initSleepPointPie(36000)
  initSleepPointPie()
  initSleepLongPie(36000)
  initSleepLongPie()
})
/**
 * @description: 处理选择天数事件
 * @return {*}
 */
const handleChangeSDays = () => {
  initSleepMonthChart()
  initSleepPointPie()
  initSleepLongPie()
}
/**
 * @description: 初始化s图表
 * @return {*}
 */
const initSleepMonthChart = async () => {
  const baseTime = '20:00:00'
  const xData = [],
    yData = [],
    yDataLong = []
  await lifeColorApi
    .getLifeColorList({
      current: 1,
      size: sDays.value,
      type: 'S'
    })
    .then((data) => {
      const records = data.records
      for (let i = records.length - 1; i >= 0; i--) {
        const minute = calculateTimeDifference(records[i].timePoint, baseTime)
        xData.push(records[i].doDate.substring(5))
        yData.push(minute)
        yDataLong.push(records[i].minute)
      }
    })
  initSleepPointLine(xData, yData, baseTime)
  initSleepLongBar(xData, yDataLong)
}
/**
 * @description: 初始化s时间点饼图
 * @return {*}
 */
const initSleepPointPie = async (days) => {
  let dataRes
  let queryDays = sDays.value
  let divId = 'container-pie-s-point-day'
  if (days == 36000) {
    queryDays = days
    divId = 'container-pie-s-point'
  }
  await lifeColorApi.getSleepPointGroup(queryDays).then((data) => {
    dataRes = data
    for (let i = 0; i < data.length; i++) {
      let pieceColor = ''
      if (data[i].name == '12-23') {
        pieceColor = colors[0]
      } else if (data[i].name == '23-24') {
        pieceColor = colors[1]
      } else if (data[i].name == '00-01') {
        pieceColor = colors[2]
      } else {
        pieceColor = colors[3]
      }
      data[i].itemStyle = {
        color: pieceColor
      }
    }
  })
  var chartDom = document.getElementById(divId)
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Sleep',
        type: 'pie',
        radius: '40%',
        data: dataRes,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: (data) => {
            return `${data.name}:${data.percent.toFixed(0)}%`
          },
          overflow: 'none'
        }
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.on('click', () => {
    initTimeCalendar('S')
  })
}
/**
 * @description: 初始化s时长饼图
 * @return {*}
 */
const initSleepLongPie = async (days) => {
  let dataRes
  let queryDays = sDays.value
  let divId = 'container-pie-s-long-day'
  if (days == 36000) {
    queryDays = days
    divId = 'container-pie-s-long'
  }
  await lifeColorApi.getSleepLongGroup(queryDays).then((data) => {
    dataRes = data
    for (let i = 0; i < data.length; i++) {
      let pieceColor = ''
      if (data[i].name == '>8h') {
        pieceColor = colors[0]
      } else if (data[i].name == '7-8h') {
        pieceColor = colors[1]
      } else if (data[i].name == '6-7h') {
        pieceColor = colors[2]
      } else {
        pieceColor = colors[3]
      }
      data[i].itemStyle = {
        color: pieceColor
      }
    }
  })
  var chartDom = document.getElementById(divId)
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Sleep',
        type: 'pie',
        radius: '40%',
        data: dataRes,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: (data) => {
            return `${data.name}:${data.percent.toFixed(0)}%`
          },
          overflow: 'none'
        }
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.on('click', () => {
    initTimeCalendar('S')
  })
}
/**
 * @description: 初始化s时间点折线图
 * @return {*}
 */
const initSleepPointLine = (xData, yData, baseTime) => {
  var chartDom = document.getElementById('container-line-s-point')
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.name}: ${calculateTimeStr(params.value, baseTime)}`
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
      show: false
    },
    series: [
      {
        name: 'Sleep',
        type: 'line',
        radius: '40%',
        data: yData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: (data) => {
            return `${data.name}:${data.percent.toFixed(0)}%`
          },
          overflow: 'none'
        },
        markLine: {
          data: [
            {
              name: 'Good',
              yAxis: 180
            }
          ],
          label: {
            show: true,
            formatter: (data) => {
              return calculateTimeStr(data.value, baseTime)
            }
          },
          symbol: 'none'
        },
        itemStyle: {
          normal: {
            color: function (params) {
              let color = '#000000'
              if (params.data <= 180) color = colors[0]
              if (params.data > 180 && params.data <= 240) color = colors[1]
              if (params.data > 240 && params.data <= 300) color = colors[2]
              if (params.data > 300) color = colors[3]
              return color
            }
          }
        }
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.on('click', () => {
    initTimeCalendar('S')
  })
}
/**
 * @description: 计算时间差
 * @param {*} timeStr
 * @param {*} reference
 * @return {*}
 */
const calculateTimeDifference = (timeStr, reference) => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number)
  const minites = hours * 60 + minutes + seconds / 60
  const [rHours, rMinutes, rSeconds] = reference.split(':').map(Number)
  const rMinites = rHours * 60 + rMinutes + rSeconds / 60
  let diff = (minites - rMinites) % 1440
  if (diff < 0) {
    diff += 24 * 60
  }
  return diff
}
/**
 * @description: 根据分钟数计算时间字符串
 * @param {*} diff
 * @param {*} reference
 * @return {*}
 */
const calculateTimeStr = (diff, reference) => {
  const [rHours, rMinutes, rSeconds] = reference.split(':').map(Number)
  const rMinutesTotal = rHours * 60 + rMinutes + rSeconds / 60
  let newTotalMinutes = (rMinutesTotal + diff) % (24 * 60)
  const newHours = Math.floor(newTotalMinutes / 60)
  const newMinutes = Math.floor(newTotalMinutes % 60)
  const newSeconds = 0
  const timeStr = `${String(newHours).padStart(2, '0')}:${String(
    newMinutes
  ).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`
  return timeStr
}
/**
 * @description: s时长柱状图
 * @param {*} xData
 * @param {*} yData
 * @return {*}
 */
const initSleepLongBar = (xData, yData) => {
  var chartDom = document.getElementById('container-bar-s-long')
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return Math.floor(value / 60) + 'h' + (value % 60) + 'm'
        }
      }
    },
    series: [
      {
        data: yData,
        type: 'bar',
        itemStyle: {
          color: (params) => {
            const val = params.data
            if (val > 480) {
              return colors[0]
            } else if (val > 420 && val <= 480) {
              return colors[1]
            } else if (val > 360 && val <= 420) {
              return colors[2]
            } else {
              return colors[3]
            }
          }
        },
        label: {
          show: true,
          position: 'insideTop',
          formatter: (params) => {
            const value = params.value
            return Math.floor(value / 60) + 'h' + (value % 60) + 'm'
          }
        },
        markLine: {
          lineStyle: {
            type: 'dashed',
            color: 'blue'
          },
          data: [{ yAxis: 480, name: 'Good' }],
          label: {
            show: true,
            formatter: (params) => {
              const value = params.value
              return Math.floor(value / 60) + 'h'
            }
          },
          symbol: 'none'
        }
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.on('click', () => {
    initTimeCalendar('S')
  })
}
defineExpose({
  handleChangeSDays
})
</script>
<style scoped>
#container-pie-s-long {
  width: 300px;
  height: 200px;
}
#container-pie-s-point-day {
  width: 300px;
  height: 200px;
}
#container-pie-s-long-day {
  width: 300px;
  height: 200px;
}
#container-pie-s-point {
  width: 300px;
  height: 200px;
}
#container-bar-s-long {
  width: 100%;
  height: 250px;
}
#container-line-s-point {
  width: 100%;
  height: 250px;
}
</style>
