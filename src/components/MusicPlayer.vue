<template>
    <div class="music-player">
        <audio ref="audio" :src="getFileSrc(currentSong.src)" @ended="handleCurrentEnd"></audio>
        <el-progress type="circle" :percentage="progressPercentage" status="success">
            <div>
                <span>{{ currentTimeFormatted }}</span>
            </div>
            <el-button @click="prevSong" :icon="ArrowLeft" circle size="small"></el-button>
            <el-button @click="togglePlay" :icon="isPlaying ? VideoPause : VideoPlay" circle></el-button>
            <el-button @click="handleCurrentEnd" :icon="ArrowRight" circle size="small"></el-button>
            <div>
                <span>{{ totalTimeFormatted }}</span>
            </div>
        </el-progress>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, ArrowRight, VideoPause, VideoPlay } from '@element-plus/icons-vue'
import { musicApi } from '@/api'
import { ElMessage } from 'element-plus'

const songList = ref([])
const currentIndex = ref(0)
const isPlaying = ref(false)
const audio = ref(null)
const currentSong = ref({})
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
  return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`
}

const initMusic = async () => {
  const res = await musicApi.getMusicPageList({
    current: 1,
    size: 10
  })
  songList.value = res.records
  currentSong.value = songList.value[0]

}
// 进度条相关
const progressPercentage = ref(0)

const togglePlay = () => {
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const prevSong = () => {
  if (currentIndex.value === 0) {
    currentIndex.value = songList.value.length - 1
  } else {
    currentIndex.value--
  }
  audio.value.src = currentSong.value.src
  if (isPlaying.value) {
    audio.value.play()
  }
}

const handleCurrentEnd = () => {
  musicApi.updateMusic({
    id: currentSong.value.id,
    num: currentSong.value.num + 1
  }).then(() => {
    ElMessage.success('播放次数更新成功')
  }).catch(() => {
    ElMessage.error('播放次数更新失败')
  })
  if (type.value === 'one') {
    audio.value.src = getFileSrc(currentSong.value.src)
    if (isPlaying.value) {
      audio.value.play()
    }
  }
}

// 更新进度条百分比的函数
const updateProgressPercentage = () => {
  if (audio.value && audio.value.duration) {
    progressPercentage.value = (audio.value.currentTime / audio.value.duration) * 100
    currentTime.value = audio.value.currentTime
    totalTime.value = audio.value.duration
  }
}
const getFileSrc = (file) => {
  const url = `http://localhost:1301/music/${file}.mp3`
  return url
}
</script>

<style scoped>
.progress-bar {
    width: 80%;
}
</style>