<!-- src/components/FooterBar.vue -->
<!-- <template>
  <el-footer class="footer-bar">
    <div class="footer-content">
      <span>© 2025 Pamher 版权所有</span>
      <nav class="footer-nav">
        <a href="#" target="_blank" rel="noopener">关于我们</a>
        <a href="#" target="_blank" rel="noopener">隐私政策</a>
        <a href="#" target="_blank" rel="noopener">联系我们</a>
      </nav>
    </div>
  </el-footer>
</template>

<script>
export default {
  name: "MyFootBar",
};
</script>

<style scoped>
.footer-bar {
  background-color: #151515;
  color: #ccc;
  padding: 15px 20px;
  text-align: center;
  font-size: 14px;
  user-select: none;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  max-width: 900px;
  margin: 0 auto;
  align-items: center;
  flex-wrap: wrap;
}

.footer-nav a {
  color: #ccc;
  margin-left: 20px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-nav a:hover {
  color: #409EFF;
}
</style> -->
<template>
  <el-footer class="footer-bar">
    <div class="footer-content">
      <div class="footer-section">
        <div class="footer-brand">
          <h3 class="brand-name">Pamher</h3>
          <p class="brand-desc">Pamher的个人网站</p>
        </div>
      </div>
      
      <div class="footer-section">
        <nav class="footer-nav">
          <div class="nav-group">
            <h4 class="nav-title">快速链接</h4>
            <a href="#" class="nav-link" @click.prevent="handleLinkClick('aboutme')">关于我们</a>
            <a href="#" class="nav-link" @click.prevent="handleLinkClick('contact')">联系我们</a>
            <a href="#" class="nav-link" @click.prevent="handleLinkClick('help')">帮助中心</a>
          </div>
          <div class="nav-group">
            <h4 class="nav-title">法律条款</h4>
            <a href="#" class="nav-link" @click.prevent="handleLinkClick('privacy')">隐私政策</a>
            <a href="#" class="nav-link" @click.prevent="handleLinkClick('terms')">服务条款</a>
            <a href="#" class="nav-link" @click.prevent="handleLinkClick('cookie')">Cookie政策</a>
          </div>
        </nav>
      </div>
    </div>
    
    <div class="footer-divider"></div>
    
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <span class="copyright">© {{ currentYear }} Pamher 版权所有</span>
        <div class="footer-social">
          <span class="social-text">关注我们</span>
          <div class="social-links">
            <a href="#" class="social-link" title="bilibili" @click.prevent="handleSocialClick('bilibili')">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.414 6.585 0 1.775 1.474 2.789 3.868 1.932 6.446a5.45 5.45 0 0 0 2.242.465c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446C21.459 7.831 17.567 4.544 12.767 4.544c-.349 0-.697.024-1.037.072-.61-.914-1.453-1.689-2.478-2.279A5.681 5.681 0 0 0 8.691 2.188z"/>
              </svg>
            </a>
            <a href="#" class="social-link" title="QQ" @click.prevent="handleSocialClick('qq')">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.64 6.36c-.78-.78-1.83-1.21-2.93-1.21s-2.15.43-2.93 1.21c-.78.78-1.21 1.83-1.21 2.93s.43 2.15 1.21 2.93c.78.78 1.83 1.21 2.93 1.21s2.15-.43 2.93-1.21c.78-.78 1.21-1.83 1.21-2.93s-.43-2.15-1.21-2.93z"/>
              </svg>
            </a>
            <a href="#" class="social-link" title="邮箱" @click.prevent="handleSocialClick('email')">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </el-footer>
</template>

<script>
export default {
  name: "MyFootBar",
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  },
  methods: {
    handleLinkClick(type) {
  switch (type) {
    case 'aboutme':
      this.$router.push({ name: 'aboutme' });
      break;
    case 'contact':
      this.$router.push({ name: 'contact' });
      break;
    case 'help':
      this.$router.push({ name: 'help' });
      break;
    case 'privacy':
      this.$router.push({ name: 'privacy' });
      break;
    case 'terms':
      this.$router.push({ name: 'service' });
      break;
    case 'cookie':
      this.$router.push({ name: 'cookie' });
      break;
    default:
      console.warn('未知的跳转类型:', type);
  }
},

    handleSocialClick(platform) {
      console.log('点击了社交媒体:', platform)
    }
  }
}
</script>

<style scoped>
.footer-bar {
  /* 使用透明/半透明背景，更好地融入页面 */
  /* background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); */
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  padding: 0;
  user-select: none;
  margin-top: 2rem;
  position: relative;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: start;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-brand {
  margin-bottom: 1rem;
}

.brand-name {
  font-size: 1.6rem;
  font-weight: 600;
  color: #409EFF;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
}

.brand-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  line-height: 1.5;
}

.footer-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.nav-group {
  display: flex;
  flex-direction: column;
}

.nav-title {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1rem 0;
  letter-spacing: 0.5px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  padding-left: 0;
}

.nav-link:hover {
  color: #409EFF;
  padding-left: 8px;
  transform: translateX(4px);
}

.nav-link::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 2px;
  background: #409EFF;
  transition: width 0.3s ease;
  border-radius: 1px;
}

.nav-link:hover::before {
  width: 4px;
}

.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 0 2rem;
}

.footer-bottom {
  padding: 1.5rem 2rem;
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
}

.footer-social {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.social-text {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-link:hover {
  background: rgba(64, 158, 255, 0.2);
  border-color: #409EFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.social-icon {
  width: 16px;
  height: 16px;
  fill: rgba(255, 255, 255, 0.6);
  transition: fill 0.3s ease;
}

.social-link:hover .social-icon {
  fill: #409EFF;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1.5rem 1rem;
  }
  
  .footer-nav {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-bottom {
    padding: 1rem;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .footer-divider {
    margin: 0 1rem;
  }
}

@media (max-width: 480px) {
  .brand-name {
    font-size: 1.4rem;
  }
  
  .footer-content {
    padding: 1.2rem 0.75rem;
  }
  
  .nav-group {
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}

/* 如果需要额外的顶部装饰线，可以取消注释
.footer-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.3), transparent);
}
*/
</style>