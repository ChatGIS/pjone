<template>
  <el-row>
    <el-col :span="4">
      <div id="container-pie-y-time"></div>
      <div id="container-pie-y-num"></div>
    </el-col>
    <el-col :span="20">
      <div id="container-calendar"></div>
    </el-col>
  </el-row>
</template>
<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { lifeColorApi } from '@/api'

const emits = defineEmits("setTimeCalendar")
const colorYY = "#16B644"
const colorYN = "#6862FD"
const colorYH = "#FECC11"
const colorYM = "#FF0000"
onMounted(() => {
  handleInitAll()
})
const handleInitAll = () => {
  initYTimePie()
  initYNumPie()
  initCalendar()
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
        color: colorYH
      }
    },
    {
      name: 'YN',
      value: timeYN,
      itemStyle: {
        color: colorYN
      }
    },
    {
      name: 'YY',
      value: timeYY,
      itemStyle: {
        color: colorYY
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
      emits('setTimeCalendar', 'Y')
    } else {
      emits('setTimeCalendar', 'YH')
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
        color: colorYH
      }
    },
    {
      name: 'YN',
      value: timeYN,
      itemStyle: {
        color: colorYN
      }
    },
    {
      name: 'YY',
      value: timeYY,
      itemStyle: {
        color: colorYY
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
      emits('setTimeCalendar', 'Y')
    } else {
      emits('setTimeCalendar', 'YH')
    }
  })
}
const initCalendar = () => {
  var chartDom = document.getElementById('container-calendar')
  chartDom.removeAttribute('_echarts_instance_')
  var myChart = echarts.init(chartDom)
  var option
  const layouts = [
    [[0, 0]],
    [
      [-0.25, 0],
      [0.25, 0]
    ],
    [
      [0, -0.2],
      [-0.2, 0.2],
      [0.2, 0.2]
    ],
    [
      [-0.25, -0.25],
      [-0.25, 0.25],
      [0.25, -0.25],
      [0.25, 0.25]
    ]
  ]
  const pathes = [
    'M936.857805 523.431322c0 0-42.065715-68.89513-88.786739-68.89513-46.68416 0-95.732122 71.223091-95.732122 71.223091s-44.28544-72.503296-93.440922-71.152538c-35.565466 0.977306-62.89705 30.882406-79.124275 64.06615L579.773747 790.800797c-3.253248 37.391565-5.677568 50.904371-12.002816 69.63497-6.651802 19.698688-19.544883 35.227341-31.650099 45.909606-14.30231 12.621414-29.59831 22.066586-45.854208 27.424563-16.28969 5.362074-30.098739 6.496973-51.536794 6.496973-19.498906 0-36.95104-2.963456-52.395418-8.850534-15.410586-5.887078-28.420403-14.313984-39.034573-25.246003-10.613146-10.930995-18.757939-24.08151-24.435507-39.525171-5.676544-15.443763-8.532685-40.195482-8.532685-59.270963l0-26.232454 74.435273 0c0 24.644301-0.17705 64.452915 8.81408 77.006848 9.02697 12.515021 22.756147 18.092032 41.148826 18.791014 16.728678 0.636518 30.032179-8.061645 30.032179-8.061645s11.922022-10.5472 14.992077-19.756954c2.674995-8.025805 3.565363-22.180147 3.565363-22.180147s2.080461-21.789286 2.080461-34.234675L489.399906 514.299369c-16.678502-18.827776-43.801395-61.938688-82.756096-60.927693-54.699008 1.419366-100.422144 70.059622-100.422144 70.059622s-56.065126-70.059622-93.440922-70.059622c-37.376717 0-91.077939 70.059622-91.077939 70.059622S105.343488 156.737741 476.742042 119.363584l53.70327-74.714624 51.373056 74.714624C964.889395 142.740992 936.857805 523.431322 936.857805 523.431322z',
    'M741.06368 733.310464c8.075264-29.262438 20.615373-40.632422 14.64105-162.810061C966.089728 361.789952 967.93897 72.37847 967.855002 54.693683c0.279347-0.279347 0.418509-0.419533 0.418509-0.419533s-0.17705-0.00512-0.428749-0.00512c0-0.251699 0-0.428749 0-0.428749s-0.139162 0.14633-0.418509 0.425677c-17.695744-0.083866-307.10784 1.760051-515.833958 212.142592-122.181632-5.984256-133.55305 6.563533-162.815693 14.644531C235.35063 295.798886 103.552614 436.975309 90.630758 486.076621c-12.921856 49.105408 39.634227 56.859034 58.579558 58.581197 18.953421 1.724314 121.471386-9.475789 130.09111 4.309094 0 0 16.367411 11.200102 17.226035 41.346662 0.850432 29.796659 15.173222 71.354163 37.123994 97.267302-0.028672 0.027648-0.05632 0.054272-0.083866 0.074752 0.158618 0.13097 0.316211 0.261939 0.474829 0.390861 0.129946 0.149402 0.261939 0.319283 0.393011 0.468685 0.019456-0.019456 0.04608-0.049152 0.075776-0.075674 25.918362 21.961216 67.477504 36.272128 97.269248 37.122458 30.149837 0.859546 41.354547 17.234534 41.354547 17.234534 13.779354 8.608051 2.583962 111.122842 4.302131 130.075546 1.727386 18.95168 9.477222 71.498445 58.579558 58.576077C585.12896 918.526771 726.311117 786.734182 741.06368 733.310464zM595.893555 426.206003c-39.961702-39.965184-39.961702-104.75991 0-144.720077 39.970918-39.96928 104.768307-39.96928 144.730112 0 39.970918 39.960064 39.970918 104.75479 0 144.720077C700.661862 466.171187 635.864474 466.171187 595.893555 426.206003zM358.53312 769.516032c-31.923302-4.573184-54.890394-18.410291-71.41847-35.402342-16.984474-16.526438-30.830387-39.495475-35.405824-71.420621-4.649062-28.082586-20.856832-41.167565-38.76649-38.763827-17.906586 2.40681-77.046886 66.714419-80.857805 89.475891-3.80887 22.752154 29.271859 12.081152 46.424166 27.654861 17.151283 15.590093-2.139853 61.93664-14.733107 86.845952-6.441984 12.735078-10.289766 26.42176-4.22953 33.76087 7.346586 6.070272 21.03593 2.222592 33.769472-4.220109 24.912384-12.585677 71.258829-31.872922 86.842368-14.731469 15.583539 17.160806 4.911002 50.229965 27.674419 46.419251 22.754099-3.807744 87.065395-62.946611 89.466163-80.85248C399.70857 790.374093 386.627072 774.166938 358.53312 769.516032z',
    'M533.504 268.288q33.792-41.984 71.68-75.776 32.768-27.648 74.24-50.176t86.528-19.456q63.488 5.12 105.984 30.208t67.584 63.488 34.304 87.04 6.144 99.84-17.92 97.792-36.864 87.04-48.64 74.752-53.248 61.952q-40.96 41.984-85.504 78.336t-84.992 62.464-73.728 41.472-51.712 15.36q-20.48 1.024-52.224-14.336t-69.632-41.472-79.872-61.952-82.944-75.776q-26.624-25.6-57.344-59.392t-57.856-74.24-46.592-87.552-21.504-100.352 11.264-99.84 39.936-83.456 65.536-61.952 88.064-35.328q24.576-5.12 49.152-1.536t48.128 12.288 45.056 22.016 40.96 27.648q45.056 33.792 86.016 80.896z'
  ]
  const colors = [colorYY, colorYN, colorYM]
  function getVirtulData(year) {
    year = year || '2025'
    let date = +echarts.number.parseDate(year + '-01-01')
    let end = +echarts.number.parseDate(+year + 1 + '-01-01')
    let dayTime = 3600 * 24 * 1000
    let data = []
    for (let time = date; time < end; time += dayTime) {
      let items = []
      let eventCount = Math.round(Math.random() * pathes.length)
      for (let i = 0; i < eventCount; i++) {
        items.push(Math.round(Math.random() * (pathes.length - 1)))
      }
      data.push([
        echarts.format.formatTime('yyyy-MM-dd', time),
        items.join('|')
      ])
    }
    return data
  }
  option = {
    tooltip: {},
    calendar: [
      {
        left: 'center',
        top: 'middle',
        cellSize: [70, 70],
        yearLabel: { show: false },
        orient: 'horizontal',
        dayLabel: {
          firstDay: 1,
          nameMap: 'ZH'
        },
        monthLabel: {
          show: false
        },
        range: getFourMonthsRange()
      }
    ],
    series: [
      {
        type: 'custom',
        coordinateSystem: 'calendar',
        renderItem: function (params, api) {
          const cellPoint = api.coord(api.value(0))
          const cellWidth = params.coordSys.cellWidth
          const cellHeight = params.coordSys.cellHeight
          const value = api.value(1)
          const events = value && value.split('|')
          if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) {
            return
          }
          const group = {
            type: 'group',
            children:
              (layouts[events.length - 1] || []).map(
                function (itemLayout, index) {
                  return {
                    type: 'path',
                    shape: {
                      pathData: pathes[+events[index]],
                      x: -8,
                      y: -8,
                      width: 16,
                      height: 16
                    },
                    position: [
                      cellPoint[0] +
                        echarts.number.linearMap(
                          itemLayout[0],
                          [-0.5, 0.5],
                          [-cellWidth / 2, cellWidth / 2]
                        ),
                      cellPoint[1] +
                        echarts.number.linearMap(
                          itemLayout[1],
                          [-0.5, 0.5],
                          [-cellHeight / 2 + 20, cellHeight / 2]
                        )
                    ],
                    style: api.style({
                      fill: colors[+events[index]]
                    })
                  }
                }
              ) || []
          }
          group.children.push({
            type: 'text',
            style: {
              x: cellPoint[0],
              y: cellPoint[1] - cellHeight / 2 + 15,
              text: echarts.format.formatTime('dd', api.value(0)),
              fill: '#777',
              textFont: api.font({ fontSize: 14 })
            }
          })
          return group
        },
        dimensions: [undefined, { type: 'ordinal' }],
        data: getVirtulData('2025')
      }
    ]
  }

  option && myChart.setOption(option)
}
/**
 * 格式化日期为 yyyy-mm-dd 格式
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取当前日期和四个月前的日期数组
 * @returns {string[]} 包含两个日期的数组，格式为 ['四个月前日期', '当前日期']
 */
function getFourMonthsRange() {
  // 获取当前日期
  const currentDate = new Date();
  
  // 计算四个月前的日期
  const fourMonthsAgo = new Date(currentDate);
  fourMonthsAgo.setMonth(currentDate.getMonth() - 4);
  
  // 处理月份跨年后可能出现的日期问题
  // 例如1月减4个月变成9月（去年），但日期可能超出当月天数
  if (fourMonthsAgo.getDate() !== currentDate.getDate()) {
    // 如果日期不匹配，说明超出了当月天数，设置为当月最后一天
    fourMonthsAgo.setDate(0);
  }
  
  // 格式化并返回数组
  return [formatDate(fourMonthsAgo), formatDate(currentDate)];
}
defineExpose({
  handleInitAll
})
</script>
<style scoped>
#container-pie-y-time {
  height: 250px;
}
#container-pie-y-num {
  height: 250px;
}
#container-calendar {
  height: 100%;
}
</style>
