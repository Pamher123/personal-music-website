<template>
  <div>
    <!-- 页面内容 -->
    <div class="home-container">
      <h1>欢迎来到 Pamher Music</h1>
      <p class="intro">
        这里是我的个人音乐作品展示与销售平台。可以浏览各种音频素材，购买你喜欢的采样包，合成器，音色预制等等你喜欢的内容。
        
      </p>

      <el-button type="primary" size="large" @click="goToProducts">
        浏览商品
      </el-button>

      <el-row :gutter="20" class="features">
        <el-col :span="8" v-for="feature in features" :key="feature.title">
          <el-card shadow="hover" class="feature-card">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      features: [
        { title: '丰富音源', desc: '高品质的音乐素材，满足各种创作需求。' },
        { title: '个性化服务', desc: '专属音乐定制，打造独一无二的作品。' },
        { title: '便捷购物', desc: '简单的购物车功能，轻松管理你的购买清单。' }
      ]
    }
  },
  methods: {
    goToProducts() {
      this.$router.push({ name: 'shop' });
    }
  }
}
</script>

<style scoped>
.home-container {
  max-width: 900px;
  margin: 2rem auto;
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
}
h1 {
  font-weight: bold;
  font-size: 3rem;
  margin-bottom: 1rem;
}
.intro {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}
.features {
  margin-top: 3rem;
}
.feature-card {
  background: #2d2d2d;
  color: white;
  padding: 1rem;
}
</style>
