<template>
  <div class="cookie-container" ref="cookieCard">
    <h2>Cookie 政策</h2>
    <div class="content">
      <p>
        我们使用 Cookies 来提升您的用户体验。Cookies 是存储在您设备上的小文件，帮助我们记住您的偏好设置和访问统计信息。
      </p>
      <p>
        通过继续使用我们的网站，您同意我们使用 Cookies。如果您想了解更多信息或管理您的 Cookies 设置，请访问我们的隐私政策页面。
      </p>
    </div>
    <button class="back-btn" @click="goBack" @mouseenter="buttonHover" @mouseleave="buttonLeave">
      返回上一页
    </button>
  </div>
</template>

<script>
import gsap from 'gsap'

export default {
  name: 'cookieView',
  mounted() {
    // 卡片入场动画
    gsap.from(this.$refs.cookieCard, { duration: 0.6, opacity: 0, scale: 0.8, ease: "power3.out" })
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    buttonHover(event) {
      gsap.to(event.target, { duration: 0.3, scale: 1.05, boxShadow: '0 4px 12px #409EFF' })
    },
    buttonLeave(event) {
      gsap.to(event.target, { duration: 0.3, scale: 1, boxShadow: 'none' })
    }
  }
}
</script>

<style scoped>
.cookie-container {
  max-width: 500px;
  margin: 4rem auto;
  background-color: #2d2d2d;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
}

.cookie-container h2 {
  font-weight: bold;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.cookie-container .content {
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: left;
  margin-bottom: 2rem;
  color: #ddd;
}

.cookie-container p {
  margin-bottom: 1rem;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  background-color: #409EFF;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.back-btn:hover {
  background-color: #66b1ff;
  box-shadow: 0 4px 12px #409EFF;
}
</style>
