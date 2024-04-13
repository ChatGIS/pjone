<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-20 21:26:24
 * @FilePath: \pjone\src\views\my\index.vue
 * @Description: 
-->
<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import { lifeColorApi } from '@/api'


onMounted(() => {
  var chartDom = document.getElementById('main')
  var myChart = echarts.init(chartDom)
  var option

  const initRecommendWebsites = async () => {
    const res = await lifeColorApi.getRecordsNum()
    console.log(res)
    option = {
      visualMap: {
        show: false,
        min: 0,
        max: 10
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
  // 初始化查询
  initRecommendWebsites()  
}
)
</script>

<template>
    <div>
        <div id="main" style="width: 600px;height:400px;"></div>
    </div>
</template>

<style scoped>

</style>
