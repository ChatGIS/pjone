<template>
  <el-row>
    <el-col :span="6">
      <div id="container-pie-y-time"></div>
    </el-col>
    <el-col :span="6">
      <div id="container-pie-y-num"></div>
    </el-col>
    <el-col :span="6"> </el-col>
  </el-row>
</template>
<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { lifeColorApi } from '@/api'

onMounted(() => {
  handleInitAll()
})
const handleInitAll = () => {
  initYTimePie()
  initYNumPie()
}
/**
 * @description: 初始化Y时长饼图
 * @return {*}
 */
const initYTimePie = async () => {
  let timeYH = 0,
    timeYN = 0,
    timeYY = 0
  await lifeColorApi.getMinuteLastYear().then((data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type == 'YH') {
        timeYH += data[i].total_minute
      } else if (data[i].type == 'YN') {
        timeYN += data[i].total_minute
      } else if (data[i].type == 'YY') {
        timeYY += data[i].total_minute
      }
    }
  })
  let objPieTime = [
    {
      name: 'YH',
      value: timeYH,
      itemStyle: {
        color: '#8B0000'
      }
    },
    {
      name: 'YN',
      value: timeYN,
      itemStyle: {
        color: '#006400'
      }
    },
    {
      name: 'YY',
      value: timeYY,
      itemStyle: {
        color: '#9ACD32'
      }
    }
  ]
  var chartDom = document.getElementById('container-pie-y-time')
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Y',
        type: 'pie',
        radius: '40%',
        data: objPieTime,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          normal: {
            formatter: (data) => {
              return `${data.name}:${data.percent.toFixed(0)}%`
            }
          },
          overflow: 'none'
        }
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.on('click', (pieSeries) => {
    if (pieSeries.name != 'YH') {
      initTimeCalendar('Y')
    } else {
      initTimeCalendar('YH')
    }
  })
}
/**
 * @description: 初始化Y次数饼图
 * @return {*}
 */
const initYNumPie = async () => {
  let timeYH = 0,
    timeYN = 0,
    timeYY = 0
  await lifeColorApi.getNumLastYear().then((data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type == 'YH') {
        timeYH += data[i].total_num
      } else if (data[i].type == 'YN') {
        timeYN += data[i].total_num
      } else if (data[i].type == 'YY') {
        timeYY += data[i].total_num
      }
    }
  })
  let objPieTime = [
    {
      name: 'YH',
      value: timeYH,
      itemStyle: {
        color: '#8B0000'
      }
    },
    {
      name: 'YN',
      value: timeYN,
      itemStyle: {
        color: '#006400'
      }
    },
    {
      name: 'YY',
      value: timeYY,
      itemStyle: {
        color: '#9ACD32'
      }
    }
  ]
  var chartDom = document.getElementById('container-pie-y-num')
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Y',
        type: 'pie',
        radius: '40%',
        data: objPieTime,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          normal: {
            formatter: (data) => {
              return `${data.name}:${data.percent.toFixed(0)}%`
            }
          },
          overflow: 'none'
        }
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.on('click', (pieSeries) => {
    if (pieSeries.name != 'YH') {
      initTimeCalendar('Y')
    } else {
      initTimeCalendar('YH')
    }
  })
}
defineExpose({
  handleInitAll
})
</script>
<style scoped>
#container-pie-y-time {
  width: 300px;
  height: 300px;
}
#container-pie-y-num {
  width: 300px;
  height: 300px;
}
</style>
