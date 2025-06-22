<template>
  <div class="help-container">
    <h1>帮助中心</h1>
    <p>欢迎来到帮助中心！这里汇总了常见问题及解决方案，帮助您更好地使用我们的服务。</p>

    <section>
      <h2>账户相关</h2>
      <ul>
        <li><strong>如何注册账号？</strong> 点击注册页面，填写相关信息完成注册。</li>
        <li><strong>如何修改个人信息？</strong> 登录后进入“修改个人信息”，即可编辑修改。</li>
      </ul>
    </section>

    <section>
      <h2>订单与支付(暂未上线)</h2>
      <ul>
        <!-- <li><strong>支持哪些支付方式？</strong> 我们支持支付宝、微信支付及银行卡支付。</li>
        <li><strong>订单支付失败怎么办？</strong> 请检查网络或支付账户余额，或联系客服协助处理。</li>
        <li><strong>如何查看订单状态？</strong> 登录账户后进入“我的订单”页面查看详情。</li> -->
      </ul>
    </section>

    <section>
      <h2>技术支持</h2>
      <ul>
        <li><strong>本站不提供免费技术支持</strong></li>
        <li><strong>如需技术支持</strong> 请联系站长。</li>
      </ul>
    </section>

    <section>
      <h2>联系站长</h2>
      <p>如需进一步帮助，请联系本人：</p>
      <p>Email: bilibiliwatermoon@gmail.com</p>
      <p>电话: 124125</p>
      <p>工作时间：周一至周五 9:00 - 18:00</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HelpView'
}
</script>

<style scoped>
.help-container {
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

.help-container h1 {
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.help-container h2 {
  font-size: 1.8rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 0.3rem;
}

.help-container p, 
.help-container ul {
  font-size: 1.1rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.help-container ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.help-container ul li {
  margin-bottom: 0.6rem;
}

@media screen and (max-width: 480px) {
  .help-container {
    margin: 1.5rem;
    padding: 1.5rem 1.8rem;
  }

  .help-container h1 {
    font-size: 2rem;
  }

  .help-container h2 {
    font-size: 1.4rem;
  }

  .help-container p, .help-container ul {
    font-size: 1rem;
  }
}
</style>
