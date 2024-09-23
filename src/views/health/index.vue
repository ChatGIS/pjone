<template>
    <div>
        <el-card class="main-card">
            <el-row>
                <el-col :span="24">
                  <el-button type="primary" :icon="Download" @click="handleWorkStyle(1)" circle />
                  <el-button type="success" :icon="Upload" @click="handleWorkStyle(2)" circle />
                  <el-button type="warning" :icon="DArrowRight" @click="handleWorkStyle(3)" circle />
                </el-col>
                <el-col :span="24">
                  <div class="progress-container">
                    <div class="progress-bar">
                      <div 
                        v-for="(segment, index) in timeline" 
                        :key="index" 
                        :class="['segment', segment.color]" 
                        :style="{ width: `${segment.width}%`, left: `${segment.left}%` }"
                      ></div>
                    </div>
                    <div class="timeline-labels">
                      <div 
                        v-for="(segment, index) in timeline" 
                        :key="index" 
                        class="timeline-label"
                        :style="{ left: `${segment.left}%` }"
                      >
                        {{ segment.label }}
                      </div>
                    </div>
                  </div>
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
import { onMounted, h, ref } from 'vue'
import { lifeWeightApi, lifeSitApi } from '@/api/index'
import { Upload, Download, DArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const timeline = ref([
  { label: '上午9点 - 上午11点', width: 15, left: 0, color: 'blue' },
  { label: '上午11点 - 下午1点', width: 25, left: 25, color: 'green' },
  { label: '下午1点 - 下午3点', width: 25, left: 50, color: 'orange' },
  { label: '下午3点 - 下午5点', width: 25, left: 75, color: 'red' },
])
onMounted(() => {
  initWeight()
  initSit()
}
)
const initWeight = async () => {
  const res = await lifeWeightApi.getWeight()
  const yData = res.map(item => item.weight)
  const xData = res.map(item => item.doDate)
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
      min: 120,
      max: 160
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
          show: true,
          position: 'top',
          overflow: 'none',
          formatter: function(params) {
            return params.value + '-' + (params.value / 2 / (1.71 * 1.71)).toFixed(1)
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
            formatter:  data => {
              return data.value
            }
          },
          symbol: 'none'
        },
        itemStyle: {  
          normal: { 
            color: function(params) {
              const bmi = params.data / 2 / (1.71 * 1.71)
              let color = '#000000'
              if(bmi <= 18.4) color = '#AAAAAA'
              if(bmi > 18.4 && bmi <= 23.9) color = '#006400'
              if(bmi > 23.9 && bmi <= 27.9) color = '#FFFF00'
              if(bmi > 27.9 && bmi <= 32) color = '#FFA500'
              if(bmi > 32) color = '#8B0000'
              return color 
            }  
          }  
        } 

      }
    ]
  }
  option && myChart.setOption(option)
  /* myChart.on('click', () => {
    initTimeCalendar('S')
  }) */
}
const handleWorkStyle = (type) => {
  let content = ''
  let color = '#e6a23c'
  if(type === 1) {
    content = 'sit down'
    color = '#409eff'
  } else if(type === 2) {
    content ='stand up'
    color = '#67c23a'
  } else if(type === 3) {
    content = 'walk'
    color = '#e6a23c'
  }
  lifeSitApi.addSit(type).then(res => {
    if(res) {
      ElMessage({
        message: h('p', { style: 'line-height: 1; font-size: 24px' }, [
          h('span', { style: `color: ${color}` }, content),
        ]),
      })
    } else {
      ElMessage.error('操作失败')
    }
    
  })
}
const initSit = async () => {
  const res = await lifeSitApi.getSits('2')
  console.log('', res, 'pjone-10-15 12:49:56测试打印内容m')
  timeline.value.splice(0, timeline.value.length)
  timeline.value.push(...convertData(res))
  console.log('', timeline.value, 'pjone-10-15 12:51:56测试打印内容m')
  
}
function convertData(data) {
  const colors = {
    '1': 'blue',
    '2': 'green',
    '3': 'orange',
    '4': 'red'
  }

  // 先按时间排序
  data.sort((a, b) => new Date(a.doDate) - new Date(b.doDate))

  const timeline = []
  let prevDate = null

  data.forEach((item, index) => {
    const currentDate = new Date(item.doDate)
    const label = formatTime(currentDate)

    if (prevDate === null) {
      // 第一个时间段从早上8点开始
      prevDate = new Date(currentDate)
      prevDate.setHours(8, 0, 0, 0)
    }

    const duration = (currentDate - prevDate) / (1000 * 60) // 计算时间差（分钟）
    const width = (duration / (12 * 60)) * 100 // 计算宽度百分比
    const left = index === 0 ? 0 : timeline[index - 1].left + timeline[index - 1].width

    timeline.push({
      label: label,
      width: width,
      left: left,
      color: colors[item.type]
    })
    timeline[0].color = '#0000AA'
    prevDate = currentDate
  })

  return timeline
}

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>
<style scoped>
.main-card {
  background-color: #FFFFFF;
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
  background-color: #409EFF;
}

.green {
  background-color: #67C23A;
}

.orange {
  background-color: #E6A23C;
}

.red {
  background-color: #F56C6C;
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
</style>