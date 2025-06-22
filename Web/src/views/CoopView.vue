<template>
  <div class="about-me-container">
    <h1>关于合作</h1>
    <p>
    如果有合作需求，请发邮件至1023487701@qq.com
    </p>

   
  </div>
</template>

<script>
export default {
  name: 'CoopView'
}
</script>

<style scoped>
.about-me-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: #333;
  font-family: 'Arial', sans-serif;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #409EFF;
}

p {
    color: antiquewhite;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.images {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.images img {
  width: 250px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.images img:hover {
  transform: scale(1.05);
}
</style>
