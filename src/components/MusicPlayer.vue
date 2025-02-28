<template>
  <div class="music-player">
    <audio
      ref="audio"
      :src="getFileSrc(currentSong.src)"
      @ended="handleCurrentEnd"
    ></audio>
    <el-progress
      type="circle"
      :percentage="progressPercentage"
      status="exception"
    >
      <div>
        <span>{{ currentTimeFormatted }}</span>
      </div>
      <el-button
        @click="changePreSong"
        :icon="ArrowLeft"
        circle
        size="small"
      ></el-button>
      <el-button
        @click="togglePlay"
        :icon="isPlaying ? VideoPause : VideoPlay"
        circle
      ></el-button>
      <el-button
        @click="changeNextSong"
        :icon="ArrowRight"
        circle
        size="small"
      ></el-button>
      <div>
        <span>{{ totalTimeFormatted }}</span>
      </div>
    </el-progress>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  VideoPause,
  VideoPlay
} from '@element-plus/icons-vue'
import { musicApi } from '@/api'
import { ElMessage } from 'element-plus'

const songList = ref([])
const currentIndex = ref(0)
const isPlaying = ref(false)
const audio = ref(null)
const currentSong = ref({})
const progressPercentage = ref(0)
// 当前播放时长（以秒为单位）
const currentTime = ref(0)
// 音频总时长（以秒为单位）
const totalTime = ref(0)
// 计算当前播放时长和总时长的格式化字符串
const currentTimeFormatted = computed(() => formatTime(currentTime.value))
const totalTimeFormatted = computed(() => formatTime(totalTime.value))
const type = ref('one')
onMounted(() => {
  initMusic()
  // 监听音频播放进度，更新进度条百分比
  audio.value.addEventListener('timeupdate', () => {
    updateProgressPercentage()
  })
})
// 将秒数转换为 mm:ss 格式的函数
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${
    remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds
  }`
}

const initMusic = async () => {
  const res = await musicApi.getMusicPageList({
    current: 1,
    size: 100
  })
  songList.value = res.records
  currentSong.value = songList.value[0]
}
/**
 * @description: 播放/暂停
 * @return {*}
 */
const togglePlay = () => {
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
  isPlaying.value = !isPlaying.value
}
/**
 * @description: 播放
 * @return {*}
 */
const handlePlay = () => {
  audio.value.play()
  isPlaying.value = true
}
/**
 * @description: 暂停
 * @return {*}
 */
const handlePause = () => {
  audio.value.pause()
  isPlaying.value = false
}
/**
 * @description: 上一首
 * @return {*}
 */
const changePreSong = () => {
  audio.value.pause()
  isPlaying.value = false
  if (currentIndex.value === 0) {
    currentIndex.value = songList.value.length - 1
  } else {
    currentIndex.value--
  }
  currentSong.value = songList.value[currentIndex.value]
  audio.value.src = getFileSrc(currentSong.value.src)
  setTimeout(() => {
    togglePlay()
  }, 500)
}
/**
 * @description: 下一首
 * @return {*}
 */
const changeNextSong = () => {
  audio.value.pause()
  isPlaying.value = false
  if (currentIndex.value === songList.value.length - 1) {
    currentIndex.value = 0
  } else {
    currentIndex.value++
  }
  currentSong.value = songList.value[currentIndex.value]
  audio.value.src = getFileSrc(currentSong.value.src)
  setTimeout(() => {
    togglePlay()
  }, 500)
}
/**
 * @description: 播放结束
 * @return {*}
 */
const handleCurrentEnd = () => {
  musicApi
    .updateMusic({
      id: currentSong.value.id,
      num: currentSong.value.num + 1
    })
    .then(() => {
      currentSong.value.num = currentSong.value.num + 1
    })
    .catch(() => {
      ElMessage.error('播放次数更新失败')
    })
  if (type.value === 'one') {
    audio.value.src = getFileSrc(currentSong.value.src)
    if (isPlaying.value) {
      audio.value.play()
    }
  }
}

/**
 * @description: 更新进度条百分比
 * @return {*}
 */
const updateProgressPercentage = () => {
  if (audio.value && audio.value.duration) {
    progressPercentage.value =
      (audio.value.currentTime / audio.value.duration) * 100
    currentTime.value = audio.value.currentTime
    totalTime.value = audio.value.duration
  }
}
/**
 * @description: 获取文件路径
 * @param {*} file
 * @return {*}
 */
const getFileSrc = (file) => {
  const url = `http://localhost:1301/music/${file}.mp3`
  return url
}

defineExpose({ handlePlay, handlePause })
</script>

<style scoped></style>
