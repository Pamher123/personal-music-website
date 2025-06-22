<template>
  <div class="register-container" ref="registerCard">
    <h2>用户注册</h2>
    <form @submit.prevent="register">
      <p data-index="0">
        <label>用户名</label>
        <input
          ref="inputs"
          type="text"
          v-model="form.username"
          placeholder="请输入用户名"
          required
          @focus="inputFocus"
          @blur="inputBlur"
        />
      </p>
      <p data-index="1">
        <label>密码：</label>
        <input
          ref="inputs"
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
          required
          @focus="inputFocus"
          @blur="inputBlur"
        />
      </p>
      <p data-index="2">
        <label>性别：</label>
        <select
          ref="inputs"
          v-model="form.sex"
          @focus="inputFocus"
          @blur="inputBlur"
        >
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
      </p>
      <p data-index="3">
        <label>年龄：</label>
        <input
          ref="inputs"
          type="number"
          v-model="form.age"
          placeholder="请输入年龄"
          required
          @focus="inputFocus"
          @blur="inputBlur"
        />
      </p>
      <p data-index="4">
        <input
          ref="submitBtn"
          type="submit"
          value="注册"
          @mouseenter="buttonHover"
          @mouseleave="buttonLeave"
        />
      </p>
    </form>
    <p v-if="message" class="alert" ref="alert">{{ message }}</p>
  </div>
</template>

<script>
import { registerUser } from '../http/users.js'
import gsap from 'gsap'

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        sex: 'male',
        age: ''
      },
      message: ''
    }
  },
  mounted() {
    // 卡片整体入场动画
    this.beforeCardEnter(this.$refs.registerCard)
    this.cardEnter(this.$refs.registerCard)

    // 表单项依次入场动画
    const items = this.$refs.registerCard.querySelectorAll('[data-index]')
    items.forEach((el, index) => {
      el.dataset.index = index
      this.beforeFormItemEnter(el)
      this.formItemEnter(el)
    })
  },
  methods: {
    beforeCardEnter(el) {
      gsap.set(el, { opacity: 0, y: 50, scale: 0.95 })
    },
    cardEnter(el) {
      gsap.to(el, {
        duration: 0.8,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'power3.out'
      })
    },
    beforeFormItemEnter(el) {
      gsap.set(el, { opacity: 0, y: 20 })
    },
    formItemEnter(el) {
      const delay = el.dataset.index * 0.15
      gsap.to(el, {
        duration: 0.6,
        delay,
        opacity: 1,
        y: 0,
        ease: 'back.out(1.7)'
      })
    },
    inputFocus(event) {
      gsap.to(event.target, { duration: 0.3, scale: 1.05, boxShadow: '0 4px 20px rgba(64, 158, 255, 0.5)' })
    },
    inputBlur(event) {
      gsap.to(event.target, { duration: 0.3, scale: 1, boxShadow: 'none' })
    },
    buttonHover(event) {
      gsap.to(event.target, { duration: 0.3, scale: 1.05, boxShadow: '0 6px 24px rgba(64, 158, 255, 0.6)' })
    },
    buttonLeave(event) {
      gsap.to(event.target, { duration: 0.3, scale: 1, boxShadow: 'none' })
    },
    register() {
      registerUser(this.form)
        .then(res => {
          if (res.data.code === 200) {
            this.message = '注册成功！'
            this.$router.push({ name: 'shop' })
          } else {
            this.message = '注册失败：' + (res.data.message || '未知错误')
            this.shakeAlert()
          }
        })
        .catch(err => {
          this.message = '请求错误：' + err
          this.shakeAlert()
        })
    },
    shakeAlert() {
      if (!this.$refs.alert) return
      gsap.fromTo(
        this.$refs.alert,
        { x: -10 },
        { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: "power1.inOut" }
      )
    }
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 4rem auto;
  background-color: #2d2d2d;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
  transform-origin: center;
  transition: all 0.3s ease;
}

.register-container h2 {
  font-weight: bold;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.register-container p {
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
  text-align: left;
}

.register-container label {
  display: inline-block;
  width: 70px;
}

.register-container input[type="text"],
.register-container input[type="password"],
.register-container input[type="number"],
.register-container select {
  width: calc(100% - 80px);
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: #444;
  color: white;
  box-sizing: border-box;
  vertical-align: middle;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.register-container input::placeholder {
  color: #aaa;
}

.register-container input[type="submit"] {
  width: 100%;
  padding: 0.75rem;
  background-color: #409EFF;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.register-container input[type="submit"]:hover {
  background-color: #66b1ff;
  box-shadow: 0 4px 12px #409EFF;
}

/* 错误提示 */
.register-container .alert {
  color: #ff6b6b;
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
  transition: opacity 0.3s ease, transform 0.4s ease;
}
</style>
