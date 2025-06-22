<template>
  <div class="container">
    <div class="product-list">
      <h1 class="page-title">商品管理页面</h1>
      <el-button type="primary" @click="openDialog()" class="add-btn">
        <el-icon><Plus /></el-icon>
        新增商品
      </el-button>

      <div class="sample-card" v-for="item in items" :key="item.id">
          <el-icon 
            class="play-indicator" 
            :size="24" 
            @click="togglePreview(item)"
            :class="{ 'playing': currentPlayingId === item.id }"
          >
            <VideoPlay v-if="currentPlayingId !== item.id" />
            <VideoPause v-else />
          </el-icon>
        <div class="card-content">
          <h2>{{ item.name }}</h2>
          <div class="meta">
            <span class="tag" v-if="item.bpm">{{ item.bpm }} BPM</span>
            <span class="tag">{{ item.genre }}</span>
            <span class="duration" v-if="item.duration"> {{ item.duration }} 秒</span>
          </div>
          <p>{{ item.description }}</p>
          <div class="actions">
            <span class="price">¥{{ item.price }}</span>
            <el-button type="success" size="small" @click="openDialog(item)" class="edit-btn">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="removeItem(item)" class="delete-btn">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </div>
        <div class="card-image">
          <img :src="item.image" alt="商品封面" />
        </div>
      </div>
    </div>

    <!-- 编辑/添加弹窗 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="editMode ? '编辑商品' : '新增商品'" 
      width="50%"
      class="product-dialog"
    >
      <el-form 
        :model="form" 
        :rules="rules"
        ref="productForm"
        label-width="80px"
        class="product-form"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" size="large" />
        </el-form-item>
        
        <el-form-item label="价格" prop="price">
          <el-input-number 
            v-model="form.price" 
            :min="0" 
            placeholder="请输入价格"
            size="large"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="BPM" prop="bpm">
          <el-input-number 
            v-model="form.bpm" 
            :min="0" 
            placeholder="请输入BPM"
            size="large"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="类型" prop="genre">
          <el-input v-model="form.genre" placeholder="请输入音乐类型" size="large" />
        </el-form-item>
        
        <el-form-item label="时长" prop="duration">
          <el-input-number 
            v-model="form.duration" 
            :min="0" 
            placeholder="请输入时长(秒)"
            size="large"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input 
            type="textarea" 
            v-model="form.description" 
            placeholder="请输入商品描述"
            :rows="3"
          />
        </el-form-item>
        
                <el-form-item label="封面" prop="image">
            <el-upload
              :http-request="handleImageUpload"
              :show-file-list="false"
              accept="image/*"
            >
              <el-button type="primary" size="large">上传封面图片</el-button>
            </el-upload>
            <!-- 上传成功后的预览图 -->
            <!-- <div v-if="form.image" style="margin-top: 10px;">
              <img :src="form.image" alt="封面预览" style="max-width: 100px; border: 1px solid #ddd;" />
            </div> -->
          </el-form-item>

          <el-form-item label="预览" prop="preview">
            <el-upload
              :http-request="handlePreviewUpload"
              :show-file-list="false"
              accept="audio/*"
            >
              <el-button type="primary" size="large">上传预览音频</el-button>
            </el-upload>
            <!-- 上传成功后的播放按钮 -->
            <!-- <div v-if="form.preview" style="margin-top: 10px;">
              <audio :src="form.preview" controls style="width: 100%;" />
            </div> -->
          </el-form-item>



         </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="dialogVisible = false" class="cancel-btn">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button 
            type="primary" 
            size="large" 
            @click="saveItem"
            :loading="loading"
            class="save-btn"
          >
            <el-icon><Check /></el-icon>
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElIcon,} from 'element-plus'
import { Plus, Edit, Delete, Check, Close, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import {
  getItems,
  addItem,
  updateItem,
  deleteItem
} from '@/http/items.js'

const router = useRouter()
const dialogVisible = ref(false)
const editMode = ref(false)
const editingId = ref(null)
const loading = ref(false)
const productForm = ref(null)
const items = ref([])

// 音频播放相关状态
const currentAudio = ref(null)
const currentPlayingId = ref(null)

const form = ref({
  id: null,
  name: '',
  price: 0,
  bpm: null,
  genre: '',
  duration: null,
  description: '',
  image: '',
  preview: ''
})

// 上传封面图片
const handleImageUpload = async (option) => {
  const formData = new FormData()
  formData.append('file', option.file)

  try {
    const res = await axios.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    form.value.image = res.data.url
    ElMessage.success('封面上传成功')
  } catch (error) {
    ElMessage.error('封面上传失败')
  }
}

// 上传预览音频
const handlePreviewUpload = async (option) => {
  const formData = new FormData()
  formData.append('file', option.file)

  try {
    const res = await axios.post('/api/upload/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    form.value.preview = res.data.url
    ElMessage.success('音频上传成功')
  } catch (error) {
    ElMessage.error('音频上传失败')
  }
}

const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
  ],
  genre: [
    { required: true, message: '请输入音乐类型', trigger: 'blur' }
  ]
}

// 停止当前播放的音频
const stopCurrentAudio = () => {
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value.currentTime = 0
    currentAudio.value = null
    currentPlayingId.value = null
  }
}

// 切换音频播放/暂停
const togglePreview = (item) => {
  if (!item.preview) {
    ElMessage.warning('该商品暂无预览音频')
    return
  }

  // 如果当前正在播放这个音频，则停止
  if (currentPlayingId.value === item.id) {
    stopCurrentAudio()
    return
  }

  // 停止之前播放的音频
  stopCurrentAudio()

  // 播放新的音频
  try {
    const audio = new Audio(item.preview)
    
    // 音频加载成功后开始播放
    audio.addEventListener('loadeddata', () => {
      audio.play().then(() => {
        currentAudio.value = audio
        currentPlayingId.value = item.id
      }).catch((error) => {
        console.error('音频播放失败:', error)
        ElMessage.error('音频播放失败')
      })
    })

    // 音频播放结束时重置状态
    audio.addEventListener('ended', () => {
      currentAudio.value = null
      currentPlayingId.value = null
    })

    // 音频加载失败时的处理
    audio.addEventListener('error', (error) => {
      console.error('音频加载失败:', error)
      ElMessage.error('音频加载失败')
      currentAudio.value = null
      currentPlayingId.value = null
    })

  } catch (error) {
    console.error('创建音频对象失败:', error)
    ElMessage.error('音频播放失败')
  }
}

// 这个函数已经不需要了，直接在路由守卫中调用 stopCurrentAudio()

onMounted(() => {
  loadItems()
  
  // 监听页面刷新或关闭事件
  window.addEventListener('beforeunload', stopCurrentAudio)
  
  // 监听路由变化
  const unwatch = router.beforeEach((to, from, next) => {
    stopCurrentAudio()
    next()
  })
  
  // 保存 unwatch 函数以便在组件卸载时使用
  window.__routerUnwatch = unwatch
})

onUnmounted(() => {
  // 组件卸载时停止音频并清理事件监听
  stopCurrentAudio()
  window.removeEventListener('beforeunload', stopCurrentAudio)
  
  // 清理路由监听
  if (window.__routerUnwatch) {
    window.__routerUnwatch()
    delete window.__routerUnwatch
  }
})

const IMAGE_BASE_URL = 'http://localhost:8000'
const AUDIO_BASE_URL = 'http://localhost:8000'
const loadItems = async () => {
  try {
    const res = await getItems()
    // 为每个 item 补全 image URL
    items.value = res.data.data.map(item => ({
      ...item,
      image: item.image?.startsWith('http') ? item.image : IMAGE_BASE_URL + item.image,
      preview: item.preview?.startsWith('http') ? item.preview : AUDIO_BASE_URL + item.preview
    }))
  } catch (err) {
    console.error('获取商品失败', err)
  }
}

function openDialog(item = null) {
  if (item) {
    editMode.value = true
    editingId.value = item.id
    form.value = { ...item }
  } else {
    editMode.value = false
    editingId.value = null
    form.value = {
      id: null,
      name: '',
      price: 0,
      bpm: null,
      genre: '',
      duration: null,
      description: '',
      image: '',
      preview: ''
    }
  }
  dialogVisible.value = true
}

async function saveItem() {
  const formRef = productForm.value
  if (!formRef) return

  await formRef.validate(async valid => {
    if (!valid) return

    loading.value = true
    try {
      if (editMode.value) {
        await updateItem(form.value)
      } else {
        await addItem(form.value)
      }
      dialogVisible.value = false
      await loadItems()
    } catch (err) {
      console.error('保存商品失败', err)
    } finally {
      loading.value = false
    }
  })
}

async function removeItem(item) {
  try {
    // 如果正在播放要删除的商品音频，先停止播放
    if (currentPlayingId.value === item.id) {
      stopCurrentAudio()
    }
    
    await deleteItem({ id: item.id })
    await loadItems()
  } catch (err) {
    console.error('删除失败', err)
  }
}
</script>

<style scoped>
.container {
   min-height: 100vh;
  background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #2d2d2d 100%);
  padding: 2rem;
  color: white;
  background: inherit;

}

.page-title {
  font-weight: bold;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #409EFF;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.add-btn {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  margin-bottom: 2rem;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.product-list {
  margin-bottom: 2rem;
}

.sample-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2d2d2d;
  padding: 1.5rem;
  border-radius: 16px;
  margin: 1rem 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
}

.sample-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.8);
  border-color: rgba(64, 158, 255, 0.3);
}

.card-content {
  flex: 1;
}

.card-content h2 {
  color: #409EFF;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.card-content p {
  color: #ccc;
  margin: 1rem 0;
  line-height: 1.6;
}

.card-image {
  width: 150px;
  height: 100px;
  margin-left: auto;
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.meta {
  margin: 1rem 0;
}

.tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: linear-gradient(135deg, #4CAF50 0%, #66bb6a 100%);
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.duration {
  color: #888;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4CAF50;
  margin-right: auto;
}

.edit-btn {
  background: linear-gradient(135deg, #67C23A 0%, #85ce61 100%);
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #F56C6C 0%, #f78989 100%);
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
}

.delete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
}

/* 对话框样式 */
:deep(.el-dialog) {
  background-color: #2d2d2d !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
}

:deep(.el-dialog__header) {
  background-color: #2d2d2d;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
}

:deep(.el-dialog__title) {
  color: #409EFF !important;
  font-size: 1.5rem;
  font-weight: bold;
}

:deep(.el-dialog__body) {
  background-color: #2d2d2d;
  padding: 2rem;
}

:deep(.el-dialog__footer) {
  background-color: #2d2d2d;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
}

/* 表单样式 */
.product-form {
  margin-top: 1rem;
}

:deep(.el-form-item__label) {
  color: #ccc !important;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  background-color: #444 !important;
  border: 1px solid #555;
  border-radius: 8px;
  box-shadow: none;
}

:deep(.el-input__wrapper:hover) {
  border-color: #409EFF;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

:deep(.el-input__inner) {
  color: white !important;
  background-color: transparent;
}

:deep(.el-input__inner::placeholder) {
  color: #aaa !important;
}

:deep(.el-textarea__inner) {
  background-color: #444 !important;
  border: 1px solid #555;
  border-radius: 8px;
  color: white !important;
}

:deep(.el-textarea__inner:hover) {
  border-color: #409EFF;
}

:deep(.el-textarea__inner:focus) {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

:deep(.el-textarea__inner::placeholder) {
  color: #aaa !important;
}

:deep(.el-input-number .el-input__wrapper) {
  background-color: #444 !important;
  border: 1px solid #555;
  border-radius: 8px;
}

:deep(.el-input-number .el-input-number__decrease),
:deep(.el-input-number .el-input-number__increase) {
  background-color: #555;
  border-color: #555;
  color: #ccc;
}

:deep(.el-input-number .el-input-number__decrease:hover),
:deep(.el-input-number .el-input-number__increase:hover) {
  background-color: #409EFF;
  border-color: #409EFF;
  color: white;
}

.dialog-footer {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.save-btn {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.cancel-btn {
  background: #666;
  border: 1px solid #777;
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #777;
  border-color: #888;
  transform: translateY(-2px);
}

.play-indicator {
  position: absolute;
  right: 1rem;
  top: 1rem;
  color: #4CAF50;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.play-indicator:hover {
  color: #66bb6a;
  transform: scale(1.1);
}

.play-indicator.playing {
  opacity: 1;
  color: #FF6B6B;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.sample-card:hover .play-indicator {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .sample-card {
    flex-direction: column;
    text-align: center;
  }
  
  .card-image {
    margin: 1rem 0 0 0;
    width: 100%;
    max-width: 200px;
  }
  
  .actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .price {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 0 auto;
  }
  
  .dialog-footer {
    flex-direction: column;
  }
  
  .save-btn,
  .cancel-btn {
    width: 100%;
  }
  
  .play-indicator {
    position: static;
    margin-bottom: 1rem;
    opacity: 1;
  }
}
</style>