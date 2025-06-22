<template>
  <div class="contact-container" ref="contactCard">
    <h2>联系我们</h2>
    <form @submit.prevent="submitForm" class="contact-form">
      <label for="name">姓名</label>
      <input
        id="name"
        type="text"
        v-model="form.name"
        placeholder="请输入您的姓名"
        required
        @focus="inputFocus"
        @blur="inputBlur"
      />

      <label for="email">邮箱</label>
      <input
        id="email"
        type="email"
        v-model="form.email"
        placeholder="请输入您的邮箱"
        required
        @focus="inputFocus"
        @blur="inputBlur"
      />

      <label for="message">留言内容</label>
      <textarea
        id="message"
        v-model="form.message"
        placeholder="请输入您的留言"
        required
        rows="5"
        @focus="inputFocus"
        @blur="inputBlur"
      ></textarea>

      <button
        type="submit"
        class="submit-btn"
        @mouseenter="buttonHover"
        @mouseleave="buttonLeave"
      >
        发送留言
      </button>
    </form>
  </div>
</template>

<script>
import gsap from "gsap";

export default {
  name: "contactusView",
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
      },
    };
  },
  mounted() {
    // 页面卡片入场动画
    gsap.from(this.$refs.contactCard, {
      duration: 0.6,
      opacity: 0,
      y: 40,
      ease: "power3.out",
    });
  },
  methods: {
    submitForm() {
      if (
        !this.form.name.trim() ||
        !this.form.email.trim() ||
        !this.form.message.trim()
      ) {
        alert("请填写所有必填项！");
        return;
      }
      // 这里可以做表单提交逻辑
      alert(`感谢您的留言，${this.form.name}！`);
      // 提交后清空表单
      this.form.name = "";
      this.form.email = "";
      this.form.message = "";
    },
    buttonHover(event) {
      gsap.to(event.target, {
        duration: 0.3,
        scale: 1.05,
        boxShadow: "0 4px 12px #409EFF",
      });
    },
    buttonLeave(event) {
      gsap.to(event.target, { duration: 0.3, scale: 1, boxShadow: "none" });
    },
    inputFocus(event) {
      gsap.to(event.target, { duration: 0.3, borderColor: "#409EFF" });
    },
    inputBlur(event) {
      gsap.to(event.target, { duration: 0.3, borderColor: "#ccc" });
    },
  },
};
</script>

<style scoped>
.contact-container {
  max-width: 700px;
   width: 90%;
  margin: 4rem auto;
 background: linear-gradient(135deg, #2d2d2d, #b3b2b2);
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
}

.contact-container h2 {
  font-weight: bold;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.contact-form label {
  margin-bottom: 0.3rem;
  font-weight: 600;
  font-size: 1rem;
  color: #ddd;
}

.contact-form input,
.contact-form textarea {
  margin-bottom: 1.3rem;
  padding: 0.6rem 1rem;
  font-size: 1.1rem;
  border-radius: 6px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  background-color: #444;
  color: white;
  outline: none;
  transition: border-color 0.3s ease;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #bbb;
}

.submit-btn {
  align-self: center;
  padding: 0.75rem 2rem;
  background: linear-gradient(90deg, #409EFF, #66b1ff);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(90deg, #66b1ff, #409EFF);
  box-shadow: 0 4px 12px #409eff;
}
</style>
