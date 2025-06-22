<template>
  <el-header height="60px" class="header">
    <el-row justify="space-between" align="middle" style="height: 100%;">
      <el-menu
        mode="horizontal"
        :default-active="activeMenu"
        class="nav-menu"
        @select="handleSelect"
        background-color="#151515"
        text-color="#ccc"
        active-text-color="#409EFF"
      >
        <el-menu-item index="home">首页</el-menu-item>
        <el-menu-item index="shop">商店</el-menu-item>
        <el-menu-item index="coop">合作</el-menu-item>
        <!-- 管理员专用菜单项放在前面，优先显示 -->
        <el-menu-item v-if="isAdmin" index="users" class="admin-menu-item">
          <el-icon><User /></el-icon>
          用户管理
        </el-menu-item>
        <el-menu-item v-if="isAdmin" index="items" class="admin-menu-item">
          <el-icon><ShoppingBag /></el-icon>
          商品管理
        </el-menu-item>
        <!-- 关于本站放到最后，优先收起 -->
        <el-menu-item index="aboutme">关于本站</el-menu-item>
      </el-menu>

      <!-- 用户信息部分 -->
      <el-dropdown @command="handleUserCommand">
        <span class="el-dropdown-link user-info">
          <el-avatar
            size="default"
            :src="user.avatar"
            style="margin-right: 8px"
          ></el-avatar>
          {{ user.name }}
          <!-- 管理员标识 -->
          <el-tag v-if="isAdmin" type="warning" size="small" style="margin-left: 8px;">
            管理员
          </el-tag>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-if="isLoggedIn" command="UserEditView">
              <el-icon><Edit /></el-icon>
              修改个人信息
            </el-dropdown-item>
            <!-- 备份的管理功能入口，当主菜单收起时可用 -->
            <el-dropdown-item v-if="isAdmin" command="users" divided>
              <el-icon><User /></el-icon>
              用户管理
            </el-dropdown-item>
            <el-dropdown-item v-if="isAdmin" command="items">
              <el-icon><ShoppingBag /></el-icon>
              商品管理
            </el-dropdown-item>
            <!-- 关于本站的备份入口 -->
            <el-dropdown-item command="aboutme" divided>
              <el-icon><InfoFilled /></el-icon>
              关于本站
            </el-dropdown-item>
            <el-dropdown-item v-if="isLoggedIn" command="logout" divided>
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
            <el-dropdown-item v-else command="login">
              <el-icon><UserFilled /></el-icon>
              登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-row>
  </el-header>
</template>

<script>
import { User, Edit, SwitchButton, UserFilled, ShoppingBag, InfoFilled } from '@element-plus/icons-vue'

export default {
  name: 'NavBar',
  components: {
    User,
    Edit,
    SwitchButton,
    UserFilled,
    ShoppingBag,
    InfoFilled
  },
  data() {
    return {
      activeMenu: '',
      user: {
        name: '访客',
        avatar: 'https://www.loliapi.com/acg/pp/',
        admin: '0'
      }
    }
  },
  computed: {
    isLoggedIn() {
      return this.user.name !== '访客'
    },
    isAdmin() {
      return this.isLoggedIn && this.user.admin === '1'
    }
  },
  created() {
    this.syncUserFromStorage()
    this.activeMenu = this.$route.name || 'home'  
    window.addEventListener('user-login', this.syncUserFromStorage)
  },
  watch: {
  '$route.name'(newVal) {
    this.activeMenu = newVal 
  }
  },
  beforeUnmount() {
    window.removeEventListener('user-login', this.syncUserFromStorage)
  },
  methods: {
    syncUserFromStorage() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr)
          this.user.name = userObj.username
          this.user.admin = userObj.admin || '0'
          this.user.avatar = 'https://www.loliapi.com/acg/pp/?t=' + Date.now()
        } catch (e) {
          console.warn('解析用户信息失败', e)
        }
      } else {
        this.user = {
          name: '访客',
          avatar: 'https://www.loliapi.com/acg/pp/',
          admin: '0'
        }
      }
    },
    handleSelect(index) {
      if ((index === 'users' || index === 'items') && !this.isAdmin) {
        this.$message.warning('您没有权限访问此功能')
        return
      }
      this.$router.push({ name: index })
    },
    handleUserCommand(command) {
      if (command === 'logout') {
        this.$confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.success('您已退出登录')
          localStorage.removeItem('logined')
          localStorage.removeItem('loginExpire')
          localStorage.removeItem('user')
          this.user = {
            name: '访客',
            avatar: 'https://www.loliapi.com/acg/pp/',
            admin: '0'
          }
          this.$router.push({ name: 'home' })
        }).catch(() => {
          // 取消退出
        })
      }
      else if (command === 'login') {
        this.$router.push({ name: 'login' })
      }
      else if (command === 'items') {
        if (this.isAdmin) {
          this.$router.push({ name: 'items' })
        } else {
          this.$message.warning('您没有权限访问商品管理')
        }
      }
      else if (command === 'UserEditView') {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        console.log('当前用户信息:', user)
        if (user.id) {
          console.log('准备跳转到:', `/update/${user.id}`)
          this.$router.push(`/update/${user.id}`)
        } else {
          this.$message.error('未找到用户ID，无法跳转')
        }
      }
      else if (command === 'users') {
        if (this.isAdmin) {
          this.$router.push({ name: 'users' })
        } else {
          this.$message.warning('您没有权限访问用户管理')
        }
      }
      else if (command === 'aboutme') {
        this.$router.push({ name: 'aboutme' })
      }
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #151515;
  border-bottom: 1px solid #333;
}

.nav-menu {
  border: none;
  /* 确保菜单有足够空间 */
  flex: 1;
  max-width: calc(100% - 200px); /* 为用户信息区域预留空间 */
}

.user-info {
  display: flex;
  align-items: center;
  color: #ccc;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
  white-space: nowrap; /* 防止用户名换行 */
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #409EFF;
}

.admin-menu-item {
  color: #ff0000 !important;  /* 使用红色系，表示管理员权限 */
  font-weight: 500;
}

/* 管理员菜单项激活状态 */
.nav-menu .el-menu-item.admin-menu-item.is-active {
  color: #ff0000 !important;
  background-color: rgba(245, 108, 108, 0.1) !important;
  border-bottom: 2px solid #ff0000 !important;
}

/* 管理员菜单项悬停状态 */
.nav-menu .el-menu-item.admin-menu-item:hover {
  color: #7a7979 !important;
  background-color: rgba(245, 108, 108, 0.05) !important;
}

/* 下拉菜单样式 - 深色主题 */
:deep(.el-dropdown-menu) {
  background-color: #1a1a1a !important;
  border: 1px solid #333 !important;     
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
}

:global(.el-dropdown-menu) {
  background-color: #1a1a1a !important;
  border: 1px solid #333 !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
}

:deep(.el-dropdown-menu__item) {
  color: #ccc !important;
  background-color: transparent !important;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  transition: all 0.3s ease;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #333 !important;
  color: #409EFF !important;
}

:global(.el-dropdown-menu__item) {
  color: #ccc !important;
  background-color: transparent !important;
}

:global(.el-dropdown-menu__item:hover) {
  background-color: #333 !important;
  color: #409EFF !important;
}

:deep(.el-dropdown-menu__item.is-divided) {
  border-top: 1px solid #333;
}

:deep(.el-dropdown-menu__item .el-icon) {
  color: #666;
}

:deep(.el-dropdown-menu__item:hover .el-icon) {
  color: #409EFF;
}

:deep(.el-dropdown-menu__item.is-disabled) {
  color: #444;
}

:deep(.el-dropdown-menu__item.is-disabled:hover) {
  background-color: transparent;
  color: #444;
}

:deep(.el-dropdown-menu__item.is-disabled .el-icon) {
  color: #444;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu {
    max-width: calc(100% - 150px);
  }
  
  .user-info {
    padding: 8px;
  }
  
  .user-info span {
    display: none; /* 小屏幕隐藏用户名文字 */
  }
}
</style>