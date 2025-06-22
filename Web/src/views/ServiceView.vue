<template>
  <div class="service-container">
    <h1>服务条款</h1>
    <p>欢迎使用本网站服务。请您在使用前仔细阅读以下条款：</p>

    <section>
      <h2>1. 服务内容</h2>
      <p>我们致力于为用户提供高质量的产品和服务，但不保证服务绝对无误或不中断。</p>
    </section>

    <section>
      <h2>2. 用户责任</h2>
      <p>用户需合法使用本网站服务，不得利用服务进行违法或侵害他人权益的行为。</p>
    </section>

    <section>
      <h2>3. 账号安全</h2>
      <p>用户应妥善保管账号信息，因账号泄露产生的损失由用户自行承担。</p>
    </section>

    <section>
      <h2>4. 知识产权</h2>
      <p>本网站内容及相关资料的版权归本公司所有，未经许可不得擅自复制或传播。</p>
    </section>

    <section>
      <h2>5. 免责条款</h2>
      <p>在法律允许范围内，对于因使用服务导致的任何直接或间接损失，我们不承担责任。</p>
    </section>

    <section>
      <h2>6. 条款修改</h2>
      <p>我们保留随时修改服务条款的权利，修改后的条款将在网站上公布并生效。</p>
    </section>

    <section>
      <h2>7. 法律适用与争议解决</h2>
      <p>本条款受中华人民共和国法律管辖，因条款引起的争议由双方协商解决，协商不成可提交法院诉讼。</p>
    </section>

    <section>
      <h2>联系我们</h2>
      <p>如有任何疑问，请通过以下方式联系我们：</p>
      <p>Email: bilibiliwatermoon@gmail.com</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ServiceView'
}
</script>

<style scoped>
.service-container {
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

.service-container h1 {
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.service-container h2 {
  font-size: 1.8rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 0.3rem;
}

.service-container p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #ccc;
}

@media screen and (max-width: 480px) {
  .service-container {
    margin: 1.5rem;
    padding: 1.5rem 1.8rem;
  }

  .service-container h1 {
    font-size: 2rem;
  }

  .service-container h2 {
    font-size: 1.4rem;
  }

  .service-container p {
    font-size: 1rem;
  }
}
</style>
