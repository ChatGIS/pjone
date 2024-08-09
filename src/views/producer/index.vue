<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-button text>GitHub</el-button>
                <div>
                    <img id="github-producer-img" :src="srcVal"/>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import {ref} from 'vue'
const srcVal = ref('https://ghchart.rshah.org/ChatGIS?v=' + new Date().getTime())
</script>
<style scoped>
.el-row {
  padding: 10px 20px;
  border: 1px solid #00000030;
  border-radius: 10px;
  box-shadow: 8px 5px #1883c408;
  margin: 10px 0px;
}
#github-producer-img {
    width: 60%;
}
</style>