<!-- eslint-disable indent -->
<template>
  <div>
    <el-card class="main-card">
      <el-row>
        <el-col :span="16">
          <el-button @click="lifeDrawer = true" text>TIME WHERE</el-button>
          <div class="calendar-box">
            <div id="container-calendar-time" class="container-calendar"></div>
          </div>
        </el-col>
        <el-col :span="8">
        <div id="container-bar-time"></div>
      </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div id="container-line-time"></div>
        </el-col>
      </el-row>
    </el-card>
    <el-row class="main-card">
      <el-col :span="6">
        <div id="container-pie-y-time"></div>
      </el-col>
      <el-col :span="6">
        <div id="container-pie-y-num"></div>
      </el-col>
      <el-col :span="6">
      </el-col>
    </el-row>
    <el-card class="main-card">
      <el-row>
        <el-col :span="18">
          <div id="container-line-sleep-point"></div>
        </el-col>
        <el-col :span="6">
          <div id="container-pie-sleep-point"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div id="container-bar-sleep-long"></div>
        </el-col>
        <el-col :span="6">
          <div id="container-pie-sleep-long"></div>
        </el-col>
      </el-row>
      <el-input-number v-model="sDays" :min="0" :max="60" :step="5" @change="initSleepMonthChart"/>
    </el-card>
    <el-Drawer v-model="lifeDrawer" title="LifeColorEdit" :direction="direction">
      <div id="table-container">
        <div id="form-container">
          <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item label="日期">
              <el-date-picker v-model="formColor.doDate" type="date" placeholder="日期选择" :default-time="defaultTime"
                value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="formColor.type" placeholder="类型" @change="handleChangeType">
                <el-option v-for="item in optionsTime" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="分钟数">
              <el-input v-model="formColor.minute" disabled/>
            </el-form-item>
            <el-form-item label="分钟数计算">
              <el-input-number v-model="sHour" :min="0" :mix="24" :step="1" />
              <el-input-number v-model="sMinute" :min="0" :max="60" :step="5" />
            </el-form-item>
            <el-form-item label="时间点" v-if="formColor.type == 'S'">
              <el-time-picker v-model="formColor.timePoint" 
              value-format="HH:mm:ss"
              :default-value="new Date(0, 0, 0, 23, 0, 0)"/>
            </el-form-item>
            <el-form-item>
              <el-button plain @click="addLifeTime">{{ updateId ? '更新' : '添加'  }}</el-button>
              <el-button plain @click="clearForm">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table ref="singleTableRef" :data="tableData" highlight-current-row style="width: 100%"
          @current-change="handleCurrentChange">
          <el-table-column type="index" width="40" />
          <el-table-column property="doDate" label="日期" width="100" />
          <el-table-column property="type" label="类型" width="60" />
          <el-table-column property="minute" label="时长" />
          <el-table-column property="timePoint" label="时间点" />
          <el-table-column label="操作">
            <template #default="scope">  
              <el-button circle size="small" :icon="Edit" @click="editRow(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-Drawer>
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, reactive } from 'vue'
import { lifeColorApi } from '@/api'
import 'element-plus/es/components/message/style/css'
import { ElMessage, formatter } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { computed } from 'vue'

const defaultTime = ref < [Date, Date] > ([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
])
const lifeDrawer = ref(false)
const tableData = ref([])
const updateId = ref()
const sHour = ref(7)
const sMinute = ref()
const formColor = reactive({
  doDate: new Date,
  type: '',
  minute: 5,
  timePoint: null
})
const colorB = '#00c29a'
const colorS = '#9336f6'
const colorY = '#bec936'
const colorYH = '#fecc11'
const optionsTime = [
  {
    value: 'S',
    label: 'S',
  },
  {
    value: 'B',
    label: 'B',
  },
  {
    value: 'D',
    label: 'D',
  },
  {
    value: 'R',
    label: 'R',
  },
  {
    value: 'G',
    label: 'G',
  },
  {
    value: 'YY',
    label: 'YY',
  },
  {
    value: 'YN',
    label: 'YN',
  },
  {
    value: 'YH',
    label: 'YH',
  }
]
const sDays = ref(30)
onMounted(() => {
  handleInitAll()
}
)
formColor.minute = computed(() => {
  return sHour.value * 60 + sMinute.value
})
const handleChangeType = (val) => {
  if (val == 'S') {
    sHour.value = 7
  } else {
    sHour.value = 0
    formColor.timePoint = null
  }
}
/**
 * @description: 编辑
 * @param {*} row
 * @return {*}
 */
const editRow = (row) => {
  formColor.type = row.type
  formColor.doDate = row.doDate
  formColor.timePoint = row.timePoint
  sHour.value = Math.floor(row.minute / 60)
  sMinute.value = row.minute % 60
  updateId.value = row.id
}
/**
 * @description: 清空
 * @return {*}
 */
const clearForm = () => {
  updateId.value = null
  formColor.doDate = new Date
  formColor.type =  ''
  formColor.timePoint = null
  sMinute.value = 5
  sHour.value = 0
}
const handleInitAll = () => {
  initTimeList()
  initTimeCalendar('S')
  initTimeBar()
  initTimeLine()
  initYTimePie()
  initYNumPie()
  initSleepMonthChart()
  initSleepPointPie()
  initSleepLongPie()
}
/**
 * @description: 初始化时间列表
 * @return {*}
 */
const initTimeList = () => {
  lifeColorApi.getLifeColorList({
    current: 1,
    size: 15
  }).then(res => {  
    tableData.value = res.records
  })
}
/**
 * @description: 初始化时间日历图
 * @return {*}
 */
const initTimeCalendar = async (type) => {
  let minValue = 0
  let maxValue = 60
  let colorMain = ''
  if (type == 'B') {
    colorMain = colorB
  } else if (type == 'D') {
    colorMain = '#161823'
  } else if (type == 'G') {
    colorMain = 'green'
  } else if (type == 'R') {
    colorMain = 'red'
  } else if (type == 'S') {
    colorMain = colorS
    minValue = 240
    maxValue = 480
  } else if (type == 'Y') {
    colorMain = colorY
    minValue = 0
    maxValue = 30
  } else {
    colorMain = colorYH
  }
  var chartDom = document.getElementById('container-calendar-time')
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  var option
  const containerWidth = window.getComputedStyle(document.getElementById('container-calendar-time')).width
  const cell = (parseInt(containerWidth) - 200) / 48
  const res = await lifeColorApi.getRecordsNum(type)
  option = {
    tooltip: {  // 鼠标悬浮提示
      position: 'top',
      formatter: function (params) {
        let showValue = params.value[1]
        if (type == 'S') {
          showValue = Math.floor(params.value[1] / 60) + 'h' + params.value[1] % 60 + 'm'
        }
        var html = ''
        html += `<span style="color: ${colorMain}">${params.value[0]}：${showValue}</span><br />`
        return html
      },
    },
    visualMap: {
      show: false,
      min: minValue,
      max: maxValue,
      inRange: {  // 方块颜色
        color: ['White', colorMain]
      }
    },
    calendar: {
      range: [(new Date().getFullYear() - 1) + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
        new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()],
      dayLabel: {
        firstDay: 1,
        nameMap: 'ZH'
      },
      monthLabel: {
        nameMap: 'ZH'
      },
      cellSize: [cell, cell],
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
 * @description: 初始化时间折线图
 * @return {*}
 */
const initTimeLine = async () => {
  await lifeColorApi.getLifeColorList({
    'current': 1,
    'size': 100
  }).then(data => {
    const chartData = generateMultiLineChartData(data.records)
    delete chartData.series.S
    const formattedSeries = {
      B: {
        data: chartData.series.B,
        color: colorB
      },
      D: {
        data: chartData.series.D,
        color: '#161823'
      },
      R: {
        data: chartData.series.R,
        color:'red'
      },
      G: {
        data: chartData.series.G,
        color: 'green'
      },
      YH: {
        data: chartData.series.YH,
        color: colorYH
      }
    }
    chartData.series = formattedSeries
    var chartDom = document.getElementById('container-line-time')
    chartDom.removeAttribute('_echarts_instance_')
    var myChart = echarts.init(chartDom)
    let option = {
      tooltip: {  
        trigger: 'axis'  
      },  
      legend: {  
        data: Object.keys(chartData.series)
      },  
      xAxis: {  
        type: 'category',  
        data: chartData.xAxis // X 轴数据  
      },  
      yAxis: {  
        type: 'value'  
      },  
      series: Object.keys(chartData.series).map(type => ({  
        name: type,  
        type: 'line',  
        data: chartData.series[type].data, // Y 轴数据
        itemStyle: {
          normal: {
            color: chartData.series[type].color,
            lineStyle: {
              color: chartData.series[type].color
            }
          }
        }
      }))  
    }  
    myChart.setOption(option)
    myChart.on('legendselectchanged', function (params) {
      initTimeCalendar(params.name)
    })
  })
}
const generateMultiLineChartData = (data) => {  
  // Step 1: Convert date strings to Date objects  
  const parsedData = data.map(item => ({  
    date: new Date(item.doDate), // 使用 doDate 作为日期字段  
    type: item.type,  
    value: item.minute // 使用 minute 作为数值字段  
  }))  

  // Step 2: Find the date range  
  const startDate = new Date(Math.min(...parsedData.map(item => item.date)))  
  const endDate = new Date(Math.max(...parsedData.map(item => item.date)))  

  // Step 3: Generate complete date array  
  const completeDates = []  
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {  
    completeDates.push(d.toISOString().split('T')[0]) // 格式化为 YYYY-MM-DD  
  }  

  // Step 4: Create a map for the original values by type  
  const valueMap = {}  
  parsedData.forEach(item => {  
    const dateString = item.date.toISOString().split('T')[0]  
    if (!valueMap[item.type]) {  
      valueMap[item.type] = {}  
    }  
    valueMap[item.type][dateString] = item.value  
  })  

  // Step 5: Prepare the final chart data  
  const xAxisData = completeDates // X 轴数据  
  const seriesData = {}  

  Object.keys(valueMap).forEach(type => {  
    const yValues = completeDates.map(date => valueMap[type][date] || 0)  
    seriesData[type] = yValues // 每个类型的 Y 轴数据  
  })  

  return {  
    xAxis: xAxisData,  
    series: seriesData,  
  }  
}
/**
 * @description: 初始化时间柱状图
 * @return {*}
 */
const initTimeBar = async () => {
  let valueB = 0
  let valueD = 0
  let valueR = 0
  let valueG = 0
  let valueY = 0
  let valueYH = 0
  await lifeColorApi.getMinuteLastYear().then(data => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type == 'B') {
        valueB = data[i].total_minute
      } else if (data[i].type == 'D') {
        valueD = data[i].total_minute
      } else if (data[i].type == 'R') {
        valueR = data[i].total_minute
      } else if (data[i].type == 'G') {
        valueG = data[i].total_minute
      } else if (data[i].type == 'YH') {
        valueYH = data[i].total_minute
      } else if (data[i].type.startsWith('Y')) {
        valueY += data[i].total_minute
      }
    }
  })
  const dataX = ['B', 'D', 'R', 'G', 'Y', 'YH']
  const dataY = [{
    value: valueB,
    itemStyle: {
      color: colorB
    }
  }, {
    value: valueD,
    itemStyle: {
      color: '#161823'
    }
  }, {
    value: valueR,
    itemStyle: {
      color: 'red'
    }
  }, {
    value: valueG,
    itemStyle: {
      color: 'green'
    }
  }, {
    value: valueY,
    itemStyle: {
      color: colorY
    }
  }, {
    value: valueYH,
    itemStyle: {
      color: colorYH
    }
  }]
  var chartDom = document.getElementById('container-bar-time')
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    xAxis: {
      type: 'category',
      data: dataX
    },
    yAxis: {
      type: 'value',
      axisLabel: {  
        formatter: function(value) {  
          return value >= 1000 ? (value / 1000) + 'k' : value  
        }  
      }  
    },
    series: [
      {
        data: dataY,
        type: 'bar',
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.on('click', (params) => {
    initTimeCalendar(params.name)
  })
}
/**
 * @description: 初始化Y时长饼图
 * @return {*}
 */
const initYTimePie = async () => {
  let timeYH = 0, timeYN = 0, timeYY = 0
  await lifeColorApi.getMinuteLastYear().then(data => {
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
        color: colorYH
      }
    },
    {
      name: 'YN',
      value: timeYN,
      itemStyle: {
        color: '#ff6340'
      }
    },
    {
      name: 'YY',
      value: timeYY,
      itemStyle: {
        color: '#c1ff40'
      }
    },
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
          normal : {
            formatter:  data => {
              return `${data.name}:${data.percent.toFixed(0)}%`
            }
          },
          overflow: 'none',
        }

      }
    ]
  }
  option && myChart.setOption(option)
  myChart.on('click', (pieSeries) => {
    if(pieSeries.name != 'YH') {
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
  let timeYH = 0, timeYN = 0, timeYY = 0
  await lifeColorApi.getNumLastYear().then(data => {
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
        color: colorYH
      }
    },
    {
      name: 'YN',
      value: timeYN,
      itemStyle: {
        color: '#ff6340'
      }
    },
    {
      name: 'YY',
      value: timeYY,
      itemStyle: {
        color: '#c1ff40'
      }
    },
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
          normal : {
            formatter:  data => {
              return `${data.name}:${data.percent.toFixed(0)}%`
            }
          },
          overflow: 'none',
        }

      }
    ]
  }
  option && myChart.setOption(option)
  myChart.on('click', (pieSeries) => {
    if(pieSeries.name != 'YH') {
      initTimeCalendar('Y')
    } else {
      initTimeCalendar('YH')
    }
  })
}
/**
 * @description: 初始化睡眠图表
 * @return {*}
 */
const initSleepMonthChart = async () => {
  const baseTime = '20:00:00'
  const xData = [], yData = [], yDataLong = []
  await lifeColorApi.getLifeColorList({
    current: 1,
    size: sDays.value,
    type: 'S'
  }).then(data => {
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
 * @description: 初始化睡眠时间点折线图
 * @return {*}
 */
const initSleepPointLine = (xData, yData, baseTime) => {
  var chartDom = document.getElementById('container-line-sleep-point')
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
          formatter:  data => {
            return `${data.name}:${data.percent.toFixed(0)}%`
          },
          overflow: 'none',
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
            formatter:  data => {
              return calculateTimeStr(data.value, baseTime)
            }
          },
          symbol: 'none'
        },
        itemStyle: {  
          normal: {  
            color: function(params) {
              let color = '#000000'
              if(params.data <= 120) color = '#006400'
              if(params.data > 120 && params.data <= 180) color = '#9ACD32'
              if(params.data > 180 && params.data <= 210) color = '#FFFF00'
              if(params.data > 210 && params.data <= 240) color = '#FFA500'
              if(params.data > 240 && params.data <= 300) color = '#FF0000'
              if(params.data > 300) color = '#8B0000'
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
  if(diff < 0) {
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
  const timeStr = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`  
  return timeStr  
}
/**
 * @description: 加载睡眠时长柱状图
 * @param {*} xData
 * @param {*} yData
 * @return {*}
 */
const initSleepLongBar = (xData, yData) => {
  var chartDom = document.getElementById('container-bar-sleep-long')
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
        formatter: function(value) {  
          return Math.floor(value / 60) + 'h' + value % 60 + 'm'   
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
              return '#006400'
            } else if (val >450 && val <= 480) {
              return '#9ACD32'
            } else if (val >420 && val <= 450) {
              return '#FFFF00'
            } else if (val >390 && val <= 420) {
              return '#FFA500'
            } else if (val >360 && val <= 390) {
              return '#FF0000'
            } else {
              return '#8B0000'
            }
          }
        },
        label: {
          show: true,
          position: 'insideTop',
          formatter: params => {
            const value = params.value
            return Math.floor(value / 60) + 'h' + value % 60 + 'm'
          }
        },
        markLine: {  
          lineStyle: {  
            type: 'dashed',  
            color: 'blue'  
          },  
          data: [  
            { yAxis: 480, name: 'Good' }  
          ],
          label: {
            show: true,
            formatter: params => {
              const value = params.value
              return Math.floor(value / 60) + 'h'
            }
          },
          symbol: 'none'
        },
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.on('click', () => {
    initTimeCalendar('S')
  })
}
/**
 * @description: 初始化睡眠时间点饼图
 * @return {*}
 */
const initSleepPointPie = async () => {
  let dataRes
  await lifeColorApi.getSleepPointGroupLastYear().then(data => {
    dataRes = data
    for (let i = 0; i < data.length; i++) {
      let pieceColor = ''
      if (data[i].name == '<10') {
        pieceColor = '#006400'
      } else if (data[i].name == '10-11') {
        pieceColor = '#9ACD32'
      } else if (data[i].name == '11-11.5') {
        pieceColor = '#FFFF00'
      } else if (data[i].name == '11.5-12') {
        pieceColor = '#FFA500'
      } else if (data[i].name == '12-1') {
        pieceColor = '#FF0000'
      } else {
        pieceColor = '#8B0000'
      }
      data[i].itemStyle = {
        color: pieceColor
      }
    }
  })
  var chartDom = document.getElementById('container-pie-sleep-point')
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
          formatter:  data => {
            return `${data.name}:${data.percent.toFixed(0)}%`
          },
          overflow: 'none',
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
 * @description: 初始化睡眠时长饼图
 * @return {*}
 */
const initSleepLongPie = async () => {
  let dataRes
  await lifeColorApi.getSleepLongGroupLastYear().then(data => {
    dataRes = data
    for (let i = 0; i < data.length; i++) {
      let pieceColor = ''
      if (data[i].name == '>8h') {
        pieceColor = '#006400'
      } else if (data[i].name == '7.5-8h') {
        pieceColor = '#9ACD32'
      } else if (data[i].name == '7-7.5h') {
        pieceColor = '#FFFF00'
      } else if (data[i].name == '6.5-7h') {
        pieceColor = '#FFA500'
      } else if (data[i].name == '6-6.5h') {
        pieceColor = '#FF0000'
      } else {
        pieceColor = '#8B0000'
      }
      data[i].itemStyle = {
        color: pieceColor
      }
    }
  })
  var chartDom = document.getElementById('container-pie-sleep-long')
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
          formatter:  data => {
            return `${data.name}:${data.percent.toFixed(0)}%`
          },
          overflow: 'none',
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
 * @description: 添加时间
 * @return {*}
 */
const addLifeTime = () => {
  if (!formColor || !formColor.type) {
    ElMessage.warning('日期、类型为必填项')
  } else {
    if(!updateId.value) {
      lifeColorApi.addLifeColor(formColor).then(num => {
        if (num == 1) {
          handleInitAll()
        }
      })
    } else {
      formColor.id = updateId.value
      lifeColorApi.updateLifeColor(formColor).then(num => {
        if (num == 1) {
          handleInitAll()
          delete formColor.id
        }
      })
    }
  }
}
</script>
<style scoped>
.calendar-box {
  width: 100%;
}
#form-container {
  border: 0.5px solid #0000001c;
  border-radius: 15px;
  padding: 23px; 
}
.container-calendar {
  width: 100%;
  height: 200px;
}
#container-bar-time {
  width: 300px;
  height: 300px;
}
#container-line-sleep-point {
  width: 100%;
  height: 300px;
}
#container-line-time {
  width: 100%;
  height: 300px;
}
#container-bar-sleep-long {
  width: 100%;
  height: 300px;
}
#container-pie-sleep-point {
  width: 300px;
  height: 300px;
}

#container-pie-sleep-long {
  width: 300px;
  height: 300px;
}
#container-pie-y-time {
  width: 300px;
  height: 300px;
}
#container-pie-y-num {
  width: 300px;
  height: 300px;
}
.main-card {
  background-color: #FFFFFF;
  padding: 10px 20px;
  border: 1px solid #00000030;
  border-radius: 10px;
  box-shadow: 8px 5px #1883c408;
  margin: 10px 0px;
}
</style>
