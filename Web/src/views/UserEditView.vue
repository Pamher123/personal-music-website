<template>
  <div class="edit-container">
    <div class="edit-card">
      <h2 class="edit-title">编辑用户信息</h2>
      
      <el-form 
        :model="user" 
        :rules="rules" 
        ref="userForm" 
        label-width="80px"
        @submit.prevent="saveUser"
        class="edit-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="user.username" 
            placeholder="请输入用户名"
            size="large"
          />
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-select 
            v-model="user.sex" 
            placeholder="请选择性别"
            size="large"
            style="width: 100%"
          >
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input-number 
            v-model="user.age" 
            :min="0" 
            :max="120"
            size="large"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="password" 
            type="password" 
            placeholder="留空默认不修改"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item class="button-group">
          <el-button 
            type="primary" 
            size="large" 
            @click="saveUser"
            :loading="loading"
            class="save-btn"
          >
            <el-icon><Check /></el-icon>
            保存修改
          </el-button>
          
          <el-button 
            size="large" 
            @click="goBack"
            class="cancel-btn"
          >
            <el-icon><Close /></el-icon>
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getUserById, updateUser } from '../http/users.js'
import { Check, Close } from '@element-plus/icons-vue'

export default {
  name: 'UserEditView',
  components: {
    Check,
    Close
  },
  data() {
    return {
      user: {
        id: '',
        username: '',
        sex: 'male',
        age: 18
      },
      password: '',
      loading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { type: 'number', min: 0, max: 120, message: '年龄必须在 0 到 120 之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const id = this.$route.params.id
    if (id) {
      this.fetchUser(id)
    }
  },
  methods: {
    fetchUser(id) {
      this.loading = true
      getUserById(id).then(res => {
        if (res.data.code === 200) {
          this.user = res.data.data
        } else {
          this.$message.error('获取用户失败：' + res.data.message)
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('获取用户信息失败')
      }).finally(() => {
        this.loading = false
      })
    },
    
    saveUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.loading = true
          
          // 构造更新数据，密码为空时不发送密码字段
          const updateData = { ...this.user }
          if (this.password.trim() !== '') {
            updateData.password = this.password.trim()
          }

          updateUser(updateData).then(res => {
            if (res.data.code === 200) {
              this.$message.success('保存成功')
              // 更新本地存储的用户信息
              const localUser = JSON.parse(localStorage.getItem('user') || '{}')
              if (localUser.id === this.user.id) {
                localUser.username = this.user.username
                localStorage.setItem('user', JSON.stringify(localUser))
                window.dispatchEvent(new Event('user-login'))
              }
              this.goBack()
            } else {
              this.$message.error('保存失败：' + res.data.message)
            }
          }).catch(err => {
            console.error(err)
            this.$message.error('保存请求失败')
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.$message.warning('请检查表单填写是否正确')
        }
      })
    },
    
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.edit-container {
  min-height: 100vh;
  background: transparent !important;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-card {
  max-width: 500px;
  width: 100%;
  background: transparent !important;
  color: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.edit-title {
  font-weight: bold;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #409EFF;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.edit-form {
  margin-top: 1.5rem;
}

/* Element Plus 组件样式覆盖 */
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

:deep(.el-select .el-select__wrapper) {
  background-color: #444 !important;
  border: 1px solid #555;
  border-radius: 8px;
}

:deep(.el-select .el-select__wrapper:hover) {
  border-color: #409EFF;
}

:deep(.el-select .el-select__wrapper.is-focused) {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
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

.button-group {
  margin-top: 2rem;
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

/* 下拉选项样式 */
:global(.el-select-dropdown) {
  background-color: #2d2d2d !important;
  border: 1px solid #555 !important;
}

:global(.el-select-dropdown .el-select-dropdown__item) {
  color: white !important;
  background-color: transparent !important;
}

:global(.el-select-dropdown .el-select-dropdown__item:hover) {
  background-color: #409EFF !important;
}

:global(.el-select-dropdown .el-select-dropdown__item.is-selected) {
  background-color: #409EFF !important;
  color: white !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .edit-container {
    padding: 1rem;
  }
  
  .edit-card {
    padding: 1.5rem;
  }
  
  .edit-title {
    font-size: 1.8rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>