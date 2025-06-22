<template>
  <div class="container">
    <!-- 音频商品列表 -->
    <div class="product-list">
      <!-- 头部标题 -->
      <div class="header-section">
        <h1 class="main-title">
          PamherMusic欢迎你！
          <a href="https://music.163.com/#/artist?id=34742774" class="profile-link">
            点此处跳转个人主页
          </a>
        </h1>
      </div>

      <!-- 优化后的搜索框 -->
      <div class="search-section">
        <div class="search-container">
          <div class="search-header">
            <h3>搜索栏</h3>
            <span class="search-subtitle">快速找到你需要的编曲资源</span>
          </div>
          
          <el-form :inline="true" @submit.prevent class="search-form">
            <div class="search-controls">
              <div class="search-type-group">
                <label class="search-label">搜索类型</label>
                <el-select 
                  v-model="searchType" 
                  placeholder="选择搜索类型" 
                  class="search-type-select"
                  size="large">
                  <el-option label=" ID" value="id" />
                  <el-option label=" 名字" value="name" />
                  <el-option label=" 价格区间" value="price" />
                  <el-option label=" BPM区间" value="bpm" />
                </el-select>
              </div>

              <div class="search-input-group">
                <template v-if="searchType === 'id' || searchType === 'name'">
                  <label class="search-label">关键词</label>
                  <el-input 
                    v-model="searchValue" 
                    :placeholder="searchType === 'id' ? '请输入音频ID' : '请输入音频名称'" 
                    class="search-input"
                    size="large"
                    clearable>
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                </template>

                <template v-if="searchType === 'price' || searchType === 'bpm'">
                  <label class="search-label">
                    {{ searchType === 'price' ? '价格范围' : 'BPM范围' }}
                  </label>
                  <div class="range-input-group">
                    <el-input-number 
                      v-model="range.min" 
                      :min="0" 
                      :placeholder="searchType === 'price' ? '最低价格' : '最低BPM'"
                      size="large"
                      class="range-input" 
                      :controls="false"/>
                    <span class="range-separator">至</span>
                    <el-input-number 
                      v-model="range.max" 
                      :min="0" 
                      :placeholder="searchType === 'price' ? '最高价格' : '最高BPM'"
                      size="large"
                      class="range-input"
                      :controls="false" />
                  </div>
                </template>
              </div>

              <div class="search-actions">
                <el-button 
                  type="primary" 
                  @click="performSearch"
                  size="large"
                  class="search-btn">
                  <el-icon><Search /></el-icon>
                  搜索
                </el-button>
                <el-button 
                  @click="resetSearch"
                  size="large"
                  class="reset-btn">
                  <el-icon><RefreshLeft /></el-icon>
                  重置
                </el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <!-- 优化后的搜索框结束 -->

      <!-- 商品列表 -->
      <div class="products-grid">
        <div class="sample-card"
             v-for="sample in samples"
             :key="sample.id"
             @mouseenter="playPreview(sample)"
             @mouseleave="stopPreview(sample)">
          <div class="card-content">
            <!-- 修复音频元素：使用 data-id 替代 ref -->
            <audio class="audio-preview"
                   :data-id="sample.id"
                   :src="sample.preview"
                   preload="metadata">
            </audio>
            <el-icon class="play-indicator" :size="24"><VideoPlay /></el-icon>

            <h2>{{ sample.name }}</h2>
            <div class="meta">
              <span class="tag">{{ sample.bpm }} BPM</span>
              <span class="tag">{{ sample.genre }}</span>
              <span class="duration">{{ sample.duration }}秒</span>
            </div>
            <p>{{ sample.description }}</p>
            <div class="actions">
              <span class="price">¥{{ sample.price }}</span>
              <el-button type="success" @click.stop="addToCart(sample)" style="margin: 0px 10px;">
                加入购物车
              </el-button>
            </div>
          </div>
          <div class="card-image">
            <img :src="sample.image" alt="商品封面" />
          </div>
        </div>
      </div>
    </div>

    <!-- 购物车 -->
    <div class="cart-box">
      <h2>购物车（{{ cart.length }}项）</h2>
      <div v-if="cart.length === 0" class="empty">空空如也～（温馨提示，鼠标放在商品上即可试听）</div>
      <div v-else>
        <div class="cart-item" v-for="item in cart" :key="item.id">
          <div class="info">
            <h3>{{ item.name }}</h3>
          </div>
          <div class="controls">
            <el-input-number
              v-model="item.quantity"
              :min="1"
              size="small">
            </el-input-number>
            <el-button type="danger" circle @click="removeFromCart(item)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <div class="subtotal">¥{{ item.price * item.quantity }}</div>
        </div>
        <div class="total">
          总计：<span>¥{{ cartTotal }}</span>
        </div>
        <el-button type="primary" class="checkout" @click="goToPay">立即结算</el-button>
      </div>
    </div>
  </div>

  <el-dialog v-model="showPay" title="订单支付" width="50%" center>
    <div style="text-align: center;">
      <h2>总计：¥{{ cartTotal }}</h2>
      <img
        :src="PayImg"
        alt="收款二维码"
        style="max-width: 300px; max-height: 400px; border-radius: 10px; margin-top: 1rem; object-fit: contain;"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElButton, ElInputNumber, ElIcon, ElDialog, ElSelect, ElOption, ElInput, ElForm } from 'element-plus'
import { VideoPlay, Delete, Search, RefreshLeft } from '@element-plus/icons-vue'
import PayImg from '@/assets/Pay.png'
import axios from 'axios'

// 定义基础URL常量
const IMAGE_BASE_URL = 'http://localhost:8000'
const AUDIO_BASE_URL = 'http://localhost:8000'

const showPay = ref(false)
const samples = ref([])
const searchType = ref('name')
const searchValue = ref('')
const range = ref({ min: 0, max: 0 })
const cart = ref([])
const currentPlaying = ref(null)

// 处理商品数据，补全URL
function processItemsData(items) {
  if (!items || !Array.isArray(items)) return []
  
  return items.map(item => {
    // 处理图片URL
    let imageUrl = item.image
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = imageUrl.startsWith('/') ? IMAGE_BASE_URL + imageUrl : IMAGE_BASE_URL + '/' + imageUrl
    }
    
    // 处理音频URL
    let previewUrl = item.preview
    if (previewUrl && !previewUrl.startsWith('http')) {
      previewUrl = previewUrl.startsWith('/') ? AUDIO_BASE_URL + previewUrl : AUDIO_BASE_URL + '/' + previewUrl
    }
    
    console.log('处理后的音频URL:', previewUrl) // 调试日志
    
    return {
      ...item,
      image: imageUrl,
      preview: previewUrl
    }
  })
}

async function performSearch() {
  try {
    let res

    if (searchType.value === 'id') {
      res = await axios.get(`http://localhost:8000/items/${searchValue.value}`)
      samples.value = res.data.data ? processItemsData([res.data.data]) : []
    } else if (searchType.value === 'name') {
      res = await axios.get(`http://localhost:8000/items/search/${searchValue.value}`)
      samples.value = processItemsData(res.data.data || [])
    } else if (searchType.value === 'price') {
      res = await axios.get(`http://localhost:8000/items/price?min=${range.value.min}&max=${range.value.max}`)
      samples.value = processItemsData(res.data.data || [])
    } else if (searchType.value === 'bpm') {
      res = await axios.get(`http://localhost:8000/items/bpm?min=${range.value.min}&max=${range.value.max}`)
      samples.value = processItemsData(res.data.data || [])
    }

    console.log('搜索结果:', samples.value) // 调试日志

  } catch (err) {
    console.error('搜索失败:', err)
    samples.value = []
  }
}

async function fetchAllItems() {
  try {
    const res = await axios.get('http://localhost:8000/items')
    samples.value = processItemsData(res.data.data || [])
    console.log('加载的商品数据:', samples.value) // 调试日志
  } catch (err) {
    console.error('加载所有商品失败:', err)
    samples.value = []
  }
}

function resetSearch() {
  searchValue.value = ''
  range.value = { min: 0, max: 9999 }
  fetchAllItems()
}

function playPreview(sample) {
  if (currentPlaying.value) {
    stopPreview(currentPlaying.value)
  }
  
  // 使用 data-id 属性查找音频元素
  const audio = document.querySelector(`audio[data-id="${sample.id}"]`)
  
  if (audio) {
    console.log('找到音频元素，开始播放:', sample.preview)
    
    // 检查音频源是否有效
    if (!sample.preview || sample.preview === 'http://localhost:8000/' || sample.preview === 'http://localhost:8000') {
      console.error('音频URL无效:', sample.preview)
      return
    }
    
    audio.load() // 重新加载音频
    audio.play().then(() => {
      console.log('音频播放成功')
      currentPlaying.value = sample
    }).catch(err => {
      console.error('音频播放失败:', err)
    })
  } else {
    console.error('找不到音频元素，sample ID:', sample.id)
  }
}

function stopPreview(sample) {
  const audio = document.querySelector(`audio[data-id="${sample.id}"]`)
  if (audio) {
    audio.pause()
    audio.currentTime = 0
    if (currentPlaying.value?.id === sample.id) {
      currentPlaying.value = null
    }
  }
}

function addToCart(sample) {
  const existItem = cart.value.find(item => item.id === sample.id)
  if (existItem) {
    existItem.quantity++
  } else {
    cart.value.push({ ...sample, quantity: 1 })
  }
}

function removeFromCart(item) {
  cart.value = cart.value.filter(i => i.id !== item.id)
}

const cartTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

function goToPay() {
  showPay.value = true
}

// 组件挂载时加载数据
onMounted(() => {
  fetchAllItems()
})
</script>

<style>
body {
  background: linear-gradient(to right, #151515, #615f5d);
  color: #fff;
  font-family: 'Arial', sans-serif;
  padding: 2rem;
}

.container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 头部样式 */
.header-section {
  margin-bottom: 2rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-link {
  color: rgb(198, 193, 193) !important;
  text-decoration: none;
  font-size: 1rem;
  display: block;
  margin-top: 0.5rem;
  transition: color 0.3s ease;
}

.profile-link:hover {
  color: #667eea !important;
}

/* 搜索区域样式 */
.search-section {
  margin-bottom: 1.5rem;
}

.search-container {
  background: linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%);
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid #4a4a4a;
  position: relative;
  overflow: hidden;
  max-width: 600px;
  margin: 0 auto;
}

.search-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 200% 0; }
  50% { background-position: -200% 0; }
}

.search-header {
  text-align: center;
  margin-bottom: 1rem;
}

.search-header h3 {
  font-size: 1.1rem;
  margin: 0 0 0.3rem 0;
  color: #fff;
}

.search-subtitle {
  color: #bbb;
  font-size: 0.8rem;
}

.search-form {
  display: flex;
  justify-content: center;
}

.search-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}

.search-type-group,
.search-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: center;
}

.search-label {
  font-size: 0.75rem;
  color: #ccc;
  font-weight: 500;
  margin-bottom: 0.2rem;
  text-align: center;
}

.search-type-select {
  width: 140px;
}

.search-input {
  width: 180px;
}

.range-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-input {
  width: 80px;
}

.range-separator {
  font-size: 0.9rem;
  color: #667eea;
  font-weight: bold;
  padding: 0 0.3rem;
}

.search-actions {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: center;
    align-items: flex-end;
    margin-top: 1.5rem; 
}

.search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0;
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  height: 40px;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.reset-btn {
  background: #4a4a4a;
  border: 1px solid #666;
  color: #fff;
  padding: 0;
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  height: 40px;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-btn:hover {
  background: #5a5a5a;
  transform: translateY(-1px);
}

/* 商品网格 */
.products-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 保持原有的商品卡片样式 */
.sample-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2d2d2d;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card-content {
  flex: 1;
}

.card-image {
  width: 150px;
  height: 100px;
  margin-left: auto;
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.sample-card:hover {
  transform: translateY(-5px);
  background: #3d3d3d;
}

.audio-preview {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.play-indicator {
  position: absolute;
  right: 1rem;
  top: 1rem;
  color: #4CAF50;
  opacity: 0;
  transition: opacity 0.3s;
}

.sample-card:hover .play-indicator {
  opacity: 1;
}

.cart-box {
  background: #2d2d2d;
  padding: 1.5rem;
  border-radius: 12px;
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid #444;
}

.cart-item:last-child {
  border-bottom: none;
}

.tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: #4CAF50;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
}

.duration {
  color: #888;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-controls {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .search-type-select,
  .search-input {
    width: 100%;
    max-width: 200px;
  }
  
  .range-input-group {
    flex-direction: row;
    gap: 0.3rem;
  }
  
  .range-input {
    width: 70px;
  }
  
  .search-actions {
     display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: center;
    align-items: flex-end;
    margin-top: 1.5rem; 
  }
  
  .search-btn,
  .reset-btn {
    flex: 1;
    min-width: 80px;
  }
  
  .search-container {
    padding: 1rem;
    margin: 0 1rem;
  }
}
</style>