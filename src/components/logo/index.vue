<template>
    <div class="logo-container">
        <el-image class="logo-image" :src="imgLogo" :fit="fitVal" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import imgLogo from '@/assets/images/logo.png'

const fitVal = ref('fit')
</script>

<style scoped>
.logo-container {
    vertical-align: center;
}
.logo-image {
    display: inline-block;
    height: 54px;
    width: 150px;
}
.logo-text {
    font-family: STHupo;
    font-size: x-large;
    vertical-align: super;
}
</style>
