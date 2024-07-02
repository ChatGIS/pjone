<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, reactive } from 'vue'
import { lifeColorApi, sayingApi } from '@/api'
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const formLC = reactive({
  doDate: '',
  type: '',
  minute: 5,
  num: 1
})
const form = ref({
  name: '',
  author: '',
  book: '',
  article: ''
})
const optionsLCType = [
  {
    value: 'R',
    label: 'R',
  },
  {
    value: 'G',
    label: 'G',
  },
  {
    value: 'MY',
    label: 'MY',
  },
  {
    value: 'MN',
    label: 'MN',
  },
  {
    value: 'YH',
    label: 'YH',
  },
  {
    value: 'YS',
    label: 'YS',
  }
]
onMounted(() => {
  initLifeColorList()
  initColorBarLastYear()
  initSaying()
  initCalendarData()
}
)
const initLifeColorList = () => {
  lifeColorApi.getLifeColorList().then(res => {
    tableData.value = res
  })
}
/**
 * @description: 
 * @return {*}
 */
const initCalendarData = async (type) => {
  let colorMain = '#fecc11'
  if(type == 'G') {
    colorMain = 'green'
  } else if (type == 'R') {
    colorMain = 'red'
  }
  var chartDom = document.getElementById('container-l-c-y')
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
      max: 3,
      inRange: {  // 方块颜色
        color: ['White', colorMain]
      }
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
const initSaying = async () => {
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
const initColorBarLastYear = async () => {
  let valueR = 0
  let valueG = 0
  let valueY = 0
  await lifeColorApi.getMinuteLastYear().then(data => {
    for(let i = 0; i < data.length; i++) {
      if(data[i].type == 'R') {
        valueR = data[i].total_minute
      } else if(data[i].type == 'G') {
        valueG = data[i].total_minute
      } else {
        valueY += data[i].total_minute
      }
    }
  })
  const dataX = ['R', 'G', 'Y']
  const dataY = [{
    value: valueR,
    itemStyle: {
      color: 'red'
    }
  },{
    value: valueG,
    itemStyle: {
      color: 'green'
    }
  },{
    value: valueY,
    itemStyle: {
      color: '#fecc11'
    }
  }]
  var chartDom = document.getElementById('container-color-bar')
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
    initCalendarData(params.name)
  })
}
const addLC = () => {
  if (!formLC || !formLC.type) {
    ElMessage.warning('日期、类型为必填项')
  } else {
    lifeColorApi.addLifeColor(formLC).then(num => {
      if (num == 1) {
        initLifeColorList()
        initCalendarData()
        initColorBarLastYear()
      }
    })
  }
}
const addSaying = () => {
  sayingApi.addSaying(form.value).then(num => {
    if (num == 1) {
      initSaying()
      ElMessage.success('添加语录成功')
    }
  })
}
const clearSaying = () => {
  form.value.article = ''
  form.value.author = ''
  form.value.book = ''
  form.value.name = ''
}
</script>

<template>
  <div>
    <el-row>
      <el-col :span="16">
        <div class="calendar-box">
          <div id="container-l-c-y" class="calendar-container"></div>
        </div>
        <div id="container-color-bar"></div>
      </el-col>
      <el-col :span="8">
        <div id="table-container">
          <div>
            <el-date-picker v-model="formLC.doDate" type="date" placeholder="日期选择" style="width: 150px;"
              value-format="YYYY-MM-DD" />
            <el-select v-model="formLC.type" placeholder="类型" style="width: 150px;">
              <el-option v-for="item in optionsLCType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input-number v-model="formLC.minute" :min="5" :step="5" style="width:100px" />
            <el-input-number v-model="formLC.num" :min="1" :step="1" style="width:100px" />
            <el-button plain @click="addLC">添加</el-button>
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
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <div class="calendar-box">
          <div id="container-saying" class="calendar-container"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div id="table-container">
          <el-card>
            <el-form ref=formRef :model=form label-width="70px" :rules="rules">
              <el-form-item label="语录" prop="name">
                <el-input v-model="form.name" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="作者" prop="author">
                <el-input v-model="form.author"></el-input>
              </el-form-item>
              <el-form-item label="书名" prop="book">
                <el-input v-model="form.book"></el-input>
              </el-form-item>
              <el-form-item label="文章名" prop="article">
                <el-input v-model="form.article" />
              </el-form-item>
            </el-form>
            <span class="dialog-footer">
              <el-button @click="clearSaying">清空</el-button>
              <el-button type="primary" @click="addSaying">确认</el-button>
            </span>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.calendar-box {
  width: 100%;
}
.calendar-container {
  width: 100%;
  height: 200px;
}
#container-color-bar {
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
