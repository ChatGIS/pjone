<template>
  <el-row>
    <el-col :span="20">
      <el-button
        type="primary"
        :icon="Download"
        :disabled="currentType === 1"
        @click="handleDeskStatus(1)"
        circle
      />
      <el-button
        type="success"
        :icon="Upload"
        :disabled="currentType === 2"
        @click="handleDeskStatus(2)"
        circle
      />
      <el-button
        type="warning"
        :icon="DArrowRight"
        :disabled="currentType === 3"
        @click="handleDeskStatus(3)"
        circle
      />
      <el-button
        type="danger"
        :icon="AlarmClock"
        :disabled="!isShowDelay"
        @click="handleDelayClock(1)"
        circle
        >{{ delayNum }}</el-button
      >
    </el-col>
    <el-col :span="4">
      <el-select v-model="statusLast" placeholder="Select" style="width: 80px">
        <el-option
          v-for="item in optionsStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-time-picker
        v-model="timeLast"
        placeholder="最后记录时间"
        @change="handleChangeTime"
        style="width: 120px;"
      />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div class="progress-container">
        <div class="progress-bar">
          <div
            v-for="(segment, index) in timeline"
            :key="index"
            :class="['segment', segment.color]"
            :style="{
              width: `${segment.width}%`,
              left: `${segment.left}%`
            }"
          >
            {{ segment.duration }}
          </div>
        </div>
        <div class="timeline-labels">
          <div
            v-for="(segment, index) in timeline"
            :key="index"
            class="timeline-label"
            :style="{
              left: `${segment.left + segment.width}%`,
              top: `${segment.top}px`
            }"
          >
            {{ segment.label }}
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script setup>
import { onMounted, h, ref } from 'vue'
import {
  Upload,
  Download,
  DArrowRight,
  AlarmClock
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { lifeSitApi, workStatusApi } from '@/api/index'

const currentType = ref()
const timeline = ref([])
let isShowDelay = ref(false)
let delayNum = ref(0)
let audioAlarmClock
const statusLast = ref()
const timeLast = ref()
const idLast = ref()
onMounted(() => {
  refreshDeskStatusTimeline()
  audioAlarmClock = new Audio('http://localhost:1301/mymedia/test.mp3')
  isShowDelay.value = localStorage.getItem('isShowDelay')
})
const optionsStatus = [
  {
    value: '1',
    label: '蓝色'
  },
  {
    value: '2',
    label: '绿色'
  },
  {
    value: '3',
    label: '橙色'
  }
]
/**
 * 改变时间
 * @param e 
 */
const handleChangeTime = (e) => {
  workStatusApi.updateStatus(idLast.value, statusLast.value, timeLast.value).then((res) => {
    if (res) {
      ElMessage.success('更新成功')
      refreshDeskStatusTimeline()
    } else {
      ElMessage.error('更新失败')
    }
  })
}
/**
 * @description: 处理工作状态
 * @param {1 | 2 | 3} type
 * @return {*}
 */
const handleDeskStatus = (type) => {
  handleDelayClock(0)
  currentType.value = type
  let content = ''
  let color = '#e6a23c'
  if (type === 1) {
    content = 'sit down'
    color = '#409eff'
  } else if (type === 2) {
    content = 'stand up'
    color = '#67c23a'
  } else if (type === 3) {
    content = 'walk'
    color = '#e6a23c'
    delayNum.value = 3
  }
  lifeSitApi.addSit(type).then((res) => {
    if (res) {
      ElMessage({
        message: h('p', { style: 'line-height: 1; font-size: 24px' }, [
          h('span', { style: `color: ${color}` }, content)
        ])
      })
      refreshDeskStatusTimeline()
    } else {
      ElMessage.error('操作失败')
    }
  })
}
/**
 * @description: 刷新数据
 * @return {*}
 */
const refreshDeskStatusTimeline = async () => {
  const res = await lifeSitApi.getSits()
  statusLast.value = res[res.length - 1].type
  timeLast.value = res[res.length - 1].doDate
  idLast.value = res[res.length - 1].id
  timeline.value.splice(0, timeline.value.length)
  timeline.value.push(...convertData(res))
  // 控制闹钟音频
  const lastIndex = timeline.value.length - 1
  const duration = timeline.value[lastIndex].duration
  let delayNumStorage = localStorage.getItem('delayNum')
  delayNum.value = delayNumStorage
  let delayLong = 30 + 10 * delayNum.value
  if (timeline.value[lastIndex].color != 'orange') {
    if (duration == delayLong && delayNum.value <= 2) {
      audioAlarmClock.play()
      if (delayNum.value < 2) {
        isShowDelay.value = true
        localStorage.setItem('isShowDelay', true)
      }
    } else {
      delayNum.value = Math.ceil((duration - 30) / 10)
      delayNum.value = delayNum.value < 0 ? 0 : delayNum.value
      localStorage.setItem('delayNum', delayNum.value)
      isShowDelay.value = false
      localStorage.setItem('isShowDelay', false)
      audioAlarmClock.pause()
      audioAlarmClock.currentTime = 0
    }
  }
}
/**
 * @description: 闹钟延迟、关闭闹钟音频
 * @param {*} num
 * @return {*}
 */
const handleDelayClock = (num) => {
  delayNum.value = parseInt(delayNum.value) + num
  if (num == 0) {
    delayNum.value = 0
  }
  isShowDelay.value = false
  localStorage.setItem('isShowDelay', false)
  localStorage.setItem('delayNum', delayNum.value)
  audioAlarmClock.pause()
  audioAlarmClock.currentTime = 0
}
/**
 * @description: 转换数据为时间轴
 * @param {*} data
 * @return {*}
 */
const convertData = (data) => {
  const colors = {
    1: 'blue',
    2: 'green',
    3: 'orange',
    4: 'red'
  }
  const tops = {
    1: '-30',
    2: '-15',
    3: '0'
  }

  // 先按时间排序
  data.sort((a, b) => new Date(a.doDate) - new Date(b.doDate))

  let trueColor = 'NoColor'
  const timeline = []
  let preTimePoint = null
  let top = 0

  data.forEach((item, index) => {
    const timePoint = new Date(item.doDate)
    const label = formatTime(timePoint)

    if (preTimePoint === null) {
      // 第一个时间段从早上8点开始
      preTimePoint = new Date(timePoint)
      preTimePoint.setHours(8, 0, 0, 0)
    }

    const duration = (timePoint - preTimePoint) / (1000 * 60) // 计算时间差（分钟）
    const width = (duration / (12 * 60)) * 100 // 按照时间条长度为12h计算宽度
    const left =
      index === 0 ? 0 : timeline[index - 1].left + timeline[index - 1].width

    timeline.push({
      label: label,
      duration: Math.floor(duration),
      width: width,
      left: left,
      color: trueColor,
      top: tops[item.type]
    })
    // timeline[0].color = '#0000AA'
    preTimePoint = timePoint
    trueColor = colors[item.type]
  })
  // 增加最后一个时间段，从最后一个时间点到当前时间点
  const lastTimePoint = new Date()
  let lastDuration = (lastTimePoint - preTimePoint) / (1000 * 60)
  const lastWidth = (lastDuration / (12 * 60)) * 100
  const lastLeft =
    timeline.length === 0
      ? 0
      : timeline[timeline.length - 1].left + timeline[timeline.length - 1].width
  currentType.value = parseInt(data[data.length - 1].type)
  lastDuration = Math.floor(lastDuration)
  if (lastDuration < 0) {
    lastDuration = 0
  }
  timeline.push({
    label: formatTime(lastTimePoint),
    duration: lastDuration,
    width: lastWidth,
    left: lastLeft,
    color: colors[currentType.value],
    top: tops[currentType.value]
  })
  return timeline
}
/**
 * @description: 格式化时间
 * @param {*} date
 * @return {*}
 */
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
defineExpose({
  refreshDeskStatusTimeline
})
</script>
<style scoped>
.progress-container {
  margin-top: 6px;
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
  background-color: #409eff;
}

.green {
  background-color: #67c23a;
}

.orange {
  background-color: #e6a23c;
}

.red {
  background-color: #f56c6c;
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
