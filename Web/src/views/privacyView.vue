<template>
  <div class="privacy-container">
    <h1>隐私政策</h1>
    <p>感谢您使用本网站。我们非常重视您的隐私保护，以下是我们的隐私政策说明：</p>

    <section>
      <h2>1. 信息收集</h2>
      <p>我们可能会收集您在使用本网站时提供的个人信息，如用户名、联系方式等，以及自动收集的使用数据。</p>
    </section>

    <section>
      <h2>2. 信息使用</h2>
      <p>我们收集的信息将用于提供、维护和改进我们的服务，以及与您沟通和提供个性化体验。</p>
    </section>

    <section>
      <h2>3. 信息保护</h2>
      <p>我们采取合理的技术和管理措施保护您的个人信息，防止未经授权的访问、泄露或篡改。</p>
    </section>

    <section>
      <h2>4. 信息共享</h2>
      <p>除非法律要求或获得您的同意，我们不会将您的个人信息透露给第三方。</p>
    </section>

    <section>
      <h2>5. 用户权利</h2>
      <p>您有权访问、更正或删除您的个人信息，具体请联系我们的客服邮箱。</p>
    </section>

    <section>
      <h2>6. Cookie 使用</h2>
      <p>我们使用 Cookie 来提升用户体验，您可以通过浏览器设置管理 Cookie。</p>
    </section>

    <section>
      <h2>7. 政策更新</h2>
      <p>我们可能不定期更新隐私政策，更新后会及时通知您，建议定期查看。</p>
    </section>

    <section>
      <h2>联系我们</h2>
      <p>如有任何隐私相关问题，请通过以下方式联系我们：</p>
      <p>Email: bilibiliwatermoon@gmail.com</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PrivacyView'
}
</script>

<style scoped>
.privacy-container {
  max-width: 700px;
  margin: 3rem auto;
  padding: 2rem 2.5rem;
  background-color: #2d2d2d;
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.privacy-container h1 {
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.privacy-container h2 {
  font-size: 1.8rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 0.3rem;
}

.privacy-container p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #ccc;
}

@media screen and (max-width: 480px) {
  .privacy-container {
    margin: 1.5rem;
    padding: 1.5rem 1.8rem;
  }

  .privacy-container h1 {
    font-size: 2rem;
  }

  .privacy-container h2 {
    font-size: 1.4rem;
  }

  .privacy-container p {
    font-size: 1rem;
  }
}
</style>
