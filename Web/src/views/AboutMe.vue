<template>
  <div class="about-me-container">
    <h1>关于本站</h1>
    <p>
      本站力图为众多编曲/音乐爱好者提供编曲所需的资源或软件。目前网站仍有许多功能未完善，如有建议，还望指正。
    </p>

    <div class="images">
     <img :src="qqImg" alt="QQ" @click="enlargeImage(qqImg)" />
    <img :src="wechatImg" alt="WeChat" @click="enlargeImage(wechatImg)" />
    </div>

    <!-- 全屏图片遮罩 -->
    <div class="overlay" v-if="showOverlay" @click="closeOverlay">
      <img :src="currentImage" class="overlay-image" />
    </div>
  </div>
  </template>
<script>
import qqImg from '@/assets/QQ.jpg';
import wechatImg from '@/assets/WeChat.png';

export default {
  name: 'AboutMe',
  data() {
    return {
      showOverlay: false,
      currentImage: '',
      qqImg,
      wechatImg
    };
  },
  methods: {
    enlargeImage(imagePath) {
      this.currentImage = imagePath;
      this.showOverlay = true;
    },
    closeOverlay() {
      this.showOverlay = false;
    }
  }
}
</script>


<style scoped>
.about-me-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: #333;
  font-family: 'Arial', sans-serif;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #409EFF;
}

p {
  color: antiquewhite;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.images {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.images img {
  width: 250px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.images img:hover {
  transform: scale(1.05);
}

/* 全屏图片遮罩 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

</style>
