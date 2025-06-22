<template>
  <div class="login-card">
    <div class="login-container">
      <h2>用户登录</h2>
      <p data-index="0">
        用户名: 
        <input type="text" 
               class="form-input" 
               v-model="username" 
               placeholder="请输入用户名" 
               @focus="handleInputFocus" 
               @blur="handleInputBlur"/>
      </p>
      <p data-index="1">
        密码: 
        <input type="password" 
               class="form-input" 
               v-model="password" 
               placeholder="请输入密码"
               @focus="handleInputFocus" 
               @blur="handleInputBlur"/>
      </p>
      <p class="button-group" data-index="2">
        <input type="button" value="登录" class="login-btn" @mouseover="handleHover" @click="doLogin" />
      </p>
      <p v-if="errorMsg" class="alert" data-index="3">{{ errorMsg }}</p>
      <p class="button-group" data-index="4">
        <button class="register-btn register-button" @mouseover="handleHover" @click="$router.push({ name: 'register' })">
          注册新账号
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import { login } from '../http/users.js'
import gsap from 'gsap'

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMsg: ''
    }
  },
  created() {
    const logined = localStorage.getItem('logined')
    const expire = localStorage.getItem('loginExpire')
    const user = localStorage.getItem('user')

    if (logined === '1' && expire && user) {
      const now = Date.now()
      if (now < parseInt(expire)) {
        const userObj = JSON.parse(user)
        if (userObj.admin === '1') {
          this.$router.push('users')
        } else {
          this.$router.push('home')
        }
      } else {
        localStorage.clear()
      }
    }
  },
  mounted() {
    // 卡片动画
    this.beforeCardEnter(this.$el)
    this.cardEnter(this.$el, () => {})

    // 表单项依次进入
    const items = this.$el.querySelectorAll('[data-index]')
    items.forEach((el, index) => {
      el.dataset.index = index
      this.beforeFormItemEnter(el)
      this.formItemEnter(el, () => {})
    })
  },
  methods: {
    beforeCardEnter(el) {
      gsap.set(el, { opacity: 0, y: 50, scale: 0.95 })
    },
    cardEnter(el, done) {
      gsap.to(el, {
        duration: 0.8,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'power3.out',
        onComplete: done
      })
    },
    beforeFormItemEnter(el) {
      gsap.set(el, { opacity: 0, y: 20 })
    },
    formItemEnter(el, done) {
      const delay = el.dataset.index * 0.15
      gsap.to(el, {
        duration: 0.6,
        delay: delay,
        opacity: 1,
        y: 0,
        ease: 'back.out(1.7)',
        onComplete: done
      })
    },
    handleInputFocus(e) {
      gsap.to(e.target, {
        duration: 0.3,
        scale: 1.02,
        boxShadow: '0 4px 20px rgba(64, 158, 255, 0.25)'
      })
    },
    handleInputBlur(e) {
      gsap.to(e.target, {
        duration: 0.3,
        scale: 1,
        boxShadow: 'none'
      })
    },
    handleHover(e) {
      gsap.to(e.target, {
        duration: 0.3,
        y: -2,
        overwrite: 'auto'
      })
    },

    
    doLogin() {
      if (!this.username || !this.password) {
        this.errorMsg = '用户名和密码不能为空！'
        return
      }

      const buttons = document.querySelectorAll('.button-group button, .button-group input')
      gsap.to(buttons, {
        duration: 0.3,
        opacity: 0.8,
        y: 2
      })

      login(this.username, this.password).then(res => {
        if (res.data.code === 200) {
          const now = Date.now()
          const expireTime = now + 24 * 60 * 60 * 1000
          const user = res.data.user
          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('logined', '1')
          localStorage.setItem('loginExpire', expireTime.toString())
          window.dispatchEvent(new Event('user-login'))

          gsap.to('.login-card', {
            duration: 0.6,
            opacity: 0,
            y: -50,
            scale: 0.95,
            ease: 'power3.inOut',
            onComplete: () => {
              if (user.admin === '1') {
                this.$router.push('users')
              } else {
                this.$router.push('home')
              }
            }
          })
        } else {
          this.errorMsg = res.data.msg || '登录失败'
        }
      }).catch(() => {
        this.errorMsg = '网络错误，请稍后重试'
      })
    }
  }
}
</script>

<style scoped>
/* 你原有的完整样式： */
.login-container {
  max-width: 400px;
  margin: 4rem auto;
  background-color: #2d2d2d;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
}

.login-container h2 {
  font-weight: bold;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.login-container p {
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
  text-align: left;
}

.login-container input[type="text"],
.login-container input[type="password"] {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: #444;
  color: white;
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 新增：支持动画 */
}

.login-container input[type="text"]::placeholder,
.login-container input[type="password"]::placeholder {
  color: #aaa;
}

.login-container input[type="button"] {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1.8rem;
  background-color: #409EFF;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease; /* 新增：支持动画 */
}

.login-container input[type="button"]:hover {
  background-color: #66b1ff;
}

/* 注册按钮样式 */
.register-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #409EFF;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease; /* 新增：支持动画 */
}

.register-button:hover {
  background-color: #66b1ff;
}

/* 警告提示 */
.login-container .alert {
  color: #ff6b6b;
  margin-top: 1rem;
  font-size: 0.9rem;
  transition: opacity 0.3s ease, transform 0.4s ease; /* 新增：支持动画 */
}

/* 卡片动画包裹容器 */
.login-card {
  transform-origin: center;
  transition: all 0.3s ease; /* 支持 scale、opacity 等动画 */
}
</style>

