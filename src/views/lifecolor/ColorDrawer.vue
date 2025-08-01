<template>
  <el-Drawer v-model="isShowDrawer" title="EditWindow">
      <div id="form-container">
        <el-form :model="formColor" label-width="auto" style="max-width: 600px">
          <el-form-item label="日期">
            <el-date-picker
              v-model="formColor.doDate"
              type="date"
              placeholder="日期选择"
              :default-time="new Date()"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="类型">
            <el-select
              v-model="formColor.type"
              placeholder="类型"
              @change="handleChangeType"
            >
              <el-option
                v-for="item in optionsTime"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="分钟数" v-if="!(['YMS', 'YME'].includes(formColor.type))">
            <el-input v-model="formColor.minute" disabled />
          </el-form-item>
          <el-form-item label="分钟数计算" v-if="!(['YMS', 'YME'].includes(formColor.type))">
            <el-input-number v-model="sHour" :min="0" :mix="24" :step="1" />
            <el-input-number v-model="sMinute" :min="0" :max="60" :step="5" />
          </el-form-item>
          <el-form-item label="时间点" v-if="['S', 'YN'].includes(formColor.type)">
            <el-time-picker
              v-model="formColor.timePoint"
              value-format="HH:mm:ss"
              :default-value="new Date(0, 0, 0, 22, 30, 0)"
            />
          </el-form-item>
          <el-form-item>
            <el-button plain @click="addLifeRecord">{{
              updateId ? '更新' : '添加'
            }}</el-button>
            <el-button plain @click="clearForm">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="singleTableRef"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" width="40" />
        <el-table-column property="doDate" label="日期" width="100" />
        <el-table-column property="type" label="类型" width="60" />
        <el-table-column property="minute" label="时长" />
        <el-table-column property="timePoint" label="时间点" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              circle
              size="small"
              :icon="Edit"
              @click="editRow(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
  </el-Drawer>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import { lifeColorApi } from '@/api'

const isShowDrawer = ref(false)
const sHour = ref(7)
const sMinute = ref()
const tableData = ref([])
const updateId = ref()
const emits = defineEmits(['refreshData'])
const formColor = reactive({
  doDate: new Date(),
  type: '',
  minute: 5,
  timePoint: null
})
const optionsTime = [
  {
    value: 'S',
    label: 'S'
  },
  {
    value: 'B',
    label: 'B'
  },
  {
    value: 'D',
    label: 'D'
  },
  {
    value: 'R',
    label: 'R'
  },
  {
    value: 'G',
    label: 'G'
  },
  {
    value: 'YY',
    label: 'YY'
  },
  {
    value: 'YN',
    label: 'YN'
  },
  {
    value: 'YH',
    label: 'YH'
  },
  {
    value: 'YMS',
    label: 'YMS'
  },
  {
    value: 'YME',
    label: 'YME'
  }
]
formColor.minute = computed(() => {
  return sHour.value * 60 + sMinute.value
})
onMounted(() => {
  loadColorTable()
})
const openDrawer = () => {
  isShowDrawer.value = true
}
const loadColorTable = () => {
  lifeColorApi
    .getLifeColorList({
      current: 1,
      size: 15
    })
    .then((res) => {
      tableData.value = res.records
    })
}
const handleChangeType = (val) => {
  if (val == 'S') {
    sHour.value = 7
  } else {
    sHour.value = 0
    formColor.timePoint = null
  }
}
const clearForm = () => {
  updateId.value = null
  formColor.doDate = new Date()
  formColor.type = ''
  formColor.timePoint = null
  sMinute.value = 5
  sHour.value = 0
}
const addLifeRecord = () => {
  if (!formColor || !formColor.type) {
    ElMessage.warning('日期、类型为必填项')
  } else if (formColor.type == 'S' && !formColor.timePoint) {
    ElMessage.warning('时间点为必填项')
  } else {
    if (!updateId.value) {
      lifeColorApi.addLifeColor(formColor).then((num) => {
        if (num == 1) {
          emits('refreshData')
          loadColorTable()
        }
      })
    } else {
      formColor.id = updateId.value
      lifeColorApi.updateLifeColor(formColor).then((num) => {
        if (num == 1) {
          emits('refreshData')
          loadColorTable()
          delete formColor.id
          clearForm()
        }
      })
    }
  }
}
const editRow = (row) => {
  formColor.type = row.type
  formColor.doDate = row.doDate
  formColor.timePoint = row.timePoint
  sHour.value = Math.floor(row.minute / 60)
  sMinute.value = row.minute % 60
  updateId.value = row.id
}
defineExpose({
    openDrawer
})
</script>
