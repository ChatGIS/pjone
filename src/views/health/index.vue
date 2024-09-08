<template>
    <div>
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
import { onMounted, ref } from 'vue'
import { lifeWeightApi } from '@/api/index'

onMounted(() => {
  initWeight()
}
)
const initWeight = async () => {
  const res = await lifeWeightApi.getWeight()
  console.log('res', res, 'pjone-10-09 11:13:55测试打印内容m')
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
              console.log('', bmi, 'pjone-10-09 11:37:51测试打印内容m')
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
</script>
<style scoped>
#container-line-weight {
    width: 100%;
    height: 300px;
}
</style>