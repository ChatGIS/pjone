<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-04-03 23:07:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-04-03 23:15:03
 * @FilePath: \pjone\src\views\tools\SayingShow.vue
 * @Description: 
-->
<script setup>
import { ref } from 'vue'
import imgaa from '@/assets/temp/7578173.jpg'
// const imageUrl = ref('https://image12.bookschina.com/2018/20180515/7578173.jpg')

</script>

<template>
    <div id="template-container">
        <div id="image-container">
            <img :src="imgaa" />
        </div>
        <div id="saying-container">
            <p><span>拉里：</span>“去年十月，我就是这样游遍了意大利。我玩得很开心。靠着这每年的三千美元，我们可以游遍全世界。”</p>
            <p><span>伊丽莎白：</span>“我当然想要旅游。但不是像你这样。我不想坐二等舱，不想住没有洗澡间的小旅馆，
                不想在廉价的小饭店里吃饭。”</p>
        </div>
    </div>
</template>

<style scoped>
#template-container {
    height: 500px;
    background-color: rgb(116, 117, 155);
}

#image-container {
    height: 40%;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 0% 3%;
}

#saying-container {
    height: 60%;
    font-family: FZYaoTi;
    text-align: left;
    padding: 0 15%;
    color: aliceblue;
    line-height: 2;
}

#saying-container span {
    color: rgb(16, 174, 194);
}
</style>