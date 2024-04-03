<script setup>
import html2canvas from 'html2canvas'

// 导出图片
function exportPic(){
    html2canvas(document.querySelector('#eee')).then(canvas => {
        let dataURL = canvas.toDataURL('image/png')
        if (dataURL !== '') {
            var a = document.createElement('a')
            a.download = '分析报告'
            a.href = dataURL
            a.click()
        }
    }), {
        backgroundColor: '#ffffff',
        allowTaint: true,  //开启跨域
        useCORS: true,
        scrollY: 0,
        scrollX: 0,
    }

}

</script>

<template>
    <div>
        <canvas>
            <img src="https://cmsres.dianzhenkeji.com/imageService/2020/11/30/1333230466588282880-750.jpg"/>
            <h1>test</h1>
        </canvas>
        <div id="eee">
            <img src="https://cmsres.dianzhenkeji.com/imageService/2020/11/30/1333230466588282880-750.jpg"/>
            <h1>test</h1>
            <p>中国色</p>
        </div>
        <i class="el-icon-download" @click="exportPic('assessContent')">adfasdf</i>
    </div>
    
</template>

<style scoped>
img {
    width: 200px;
    height: 200px;
    object-fit: cover;
}
div {
    background-color: rgb(61, 162, 242)
}
p {
    color: #FFFFFF;
    font-family: cursive;
}
</style>