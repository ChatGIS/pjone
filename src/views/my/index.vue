<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-button @click="lifeDrawer = true" text>TIME WHERE</el-button>
        <div class="calendar-box">
          <div id="container-calendar-time" class="container-calendar"></div>
        </div>
        <div id="container-bar-time"></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button @click="sayingDrawer = true" text>WHO SAY</el-button>
        <div class="calendar-box">
          <div id="container-saying" class="container-calendar"></div>
        </div>
      </el-col>
    </el-row>
    <el-Drawer v-model="lifeDrawer" title="LifeColorEdit" :direction="direction" :before-close="handleClose">
      <div id="table-container">
        <div>
          <el-date-picker v-model="formTime.doDate" type="date" placeholder="日期选择" style="width: 150px;"
            :default-time="defaultTime" value-format="YYYY-MM-DD" />
          <el-select v-model="formTime.type" placeholder="类型" style="width: 150px;">
            <el-option v-for="item in optionsTime" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div>
            <el-input-number v-model="formTime.minute" :min="5" :step="5" />
            <el-input-number v-model="formTime.num" :min="1" :step="1" />
          </div>
          <el-button plain @click="addLifeTime">添加</el-button>
        </div>
        <el-table ref="singleTableRef" :data="tableData" highlight-current-row style="width: 100%"
          @current-change="handleCurrentChange">
          <el-table-column type="index" width="50" />
          <el-table-column property="doDate" label="日期" />
          <el-table-column property="type" label="类型" />
          <el-table-column property="minute" label="时长" />
          <el-table-column property="num" label="次数" width="60" />
        </el-table>
      </div>
    </el-Drawer>
    <el-Drawer v-model="sayingDrawer" title="语录管理" :direction="direction" :before-close="handleClose">
      <div id="table-container">
        <el-card>
          <el-form ref=formRef :model=formSaying label-width="70px" :rules="rules">
            <el-form-item label="语录" prop="name">
              <el-input v-model="formSaying.name" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input v-model="formSaying.author"></el-input>
            </el-form-item>
            <el-form-item label="书名" prop="book">
              <el-input v-model="formSaying.book"></el-input>
            </el-form-item>
            <el-form-item label="文章名" prop="article">
              <el-input v-model="formSaying.article" />
            </el-form-item>
          </el-form>
          <span class="dialog-footer">
            <el-button @click="clearSaying">清空</el-button>
            <el-button type="primary" @click="addSaying">确认</el-button>
          </span>
        </el-card>
      </div>
    </el-Drawer>
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, reactive } from 'vue'
import { lifeColorApi, sayingApi } from '@/api'
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'

const defaultTime = ref < [Date, Date] > ([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
])
const lifeDrawer = ref(false)
const sayingDrawer = ref(false)
const tableData = ref([])
const formTime = reactive({
  doDate: new Date,
  type: '',
  minute: 5,
  num: 1
})
const formSaying = ref({
  name: '',
  author: '',
  book: '',
  article: ''
})
const optionsTime = [
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
onMounted(() => {
  initTimeList()
  initTimeCalendar('G')
  initTimeBar()
  initSayingCalendar()
}
)
/**
 * @description: 初始化时间列表
 * @return {*}
 */
const initTimeList = () => {
  lifeColorApi.getLifeColorList().then(res => {
    tableData.value = res
  })
}
/**
 * @description: 初始化时间日历图
 * @return {*}
 */
const initTimeCalendar = async (type) => {
  let colorMain = '#fecc11'
  if (type == 'B') {
    colorMain = 'blue'
  } else if (type == 'D') {
    colorMain = '#161823'
  } else if (type == 'G') {
    colorMain = 'green'
  } else if (type == 'R') {
    colorMain = 'red'
  }
  var chartDom = document.getElementById('container-calendar-time')
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  var option
  const res = await lifeColorApi.getRecordsNum(type)
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
      max: 60,
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
      }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: res
    }
  }

  option && myChart.setOption(option)
  // 处理点击事件  
  myChart.on('click', function (params) {
    console.log('点击了', params)
    if (params.componentType === 'calendar') {
      console.log('点击了空白区域')
      // 在这里添加你想要执行的逻辑  
    }
  })
}
/**
 * @description: 初始化语录日历图
 * @return {*}
 */
const initSayingCalendar = async () => {
  var chartDom = document.getElementById('container-saying')
  chartDom.removeAttribute('_echarts_instance_')
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
      } else {
        valueY += data[i].total_minute
      }
    }
  })
  const dataX = ['B', 'D', 'R', 'G', 'Y']
  const dataY = [{
    value: valueB,
    itemStyle: {
      color: 'blue'
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
      color: '#fecc11'
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
      type: 'value'
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
 * @description: 添加时间
 * @return {*}
 */
const addLifeTime = () => {
  if (!formTime || !formTime.type) {
    ElMessage.warning('日期、类型为必填项')
  } else {
    lifeColorApi.addLifeColor(formTime).then(num => {
      if (num == 1) {
        initTimeList()
        initTimeCalendar()
        initTimeBar()
      }
    })
  }
}
/**
 * @description: 添加语录
 * @return {*}
 */
const addSaying = () => {
  sayingApi.addSaying(formSaying.value).then(num => {
    if (num == 1) {
      initSayingCalendar()
      ElMessage.success('添加语录成功')
    }
  })
}
/**
 * @description: 清空语录表单
 * @return {*}
 */
const clearSaying = () => {
  formSaying.value.article = ''
  formSaying.value.author = ''
  formSaying.value.book = ''
  formSaying.value.name = ''
}
</script>
<style scoped>
.calendar-box {
  width: 100%;
}

.container-calendar {
  width: 100%;
  height: 200px;
}

#container-bar-time {
  width: 300px;
  height: 300px;
}

.el-row {
  padding: 10px 20px;
  border: 1px solid #00000030;
  border-radius: 10px;
  box-shadow: 8px 5px #1883c408;
  margin: 10px 0px;
}
</style>
