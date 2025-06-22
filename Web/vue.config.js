const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    https: false,

   proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    pathRewrite: { '^/api': '' }  
  }
  
}
  }
})
