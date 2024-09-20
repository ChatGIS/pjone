<template>
    <div>
        <el-card class="main-card">
            <el-row>
                <el-col :span="24">
                  <el-button type="primary" :icon="Download" @click="handleWorkStyle(1)" circle />
                  <el-button type="success" :icon="Upload" @click="handleWorkStyle(2)" circle />
                  <el-button type="warning" :icon="DArrowRight" @click="handleWorkStyle(3)" circle />
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
import { onMounted, h } from 'vue'
import { lifeWeightApi, lifeSitApi } from '@/api/index'
import { Upload, Download, DArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

onMounted(() => {
  initWeight()
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
</style>