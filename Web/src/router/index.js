import { createRouter, createWebHistory } from 'vue-router'
import itemsView from '@/views/itemsView.vue'
// import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'

const routes = [
   {
    path: '/shop',
    name: 'shop',
    component: () => import('../views/ShopView.vue')
  },
  {
    path:'/aboutme',
    name:'aboutme',
    component:()=>import('../views/AboutMe.vue')
  },
  {
    path:'/coop',
    name:'coop',
    component:()=>import('../views/CoopView.vue')
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path:'/home',
    name:'home',
    component:()=>import('../views/HomeView.vue')
  },
  {
    path:'/service',
    name:'service',
    component:()=>import('../views/ServiceView.vue')
  },
  {
    path:'/privacy',
    name:'privacy',
    component:()=>import('../views/privacyView.vue')
  },
  {
    path: '/users',
    name: 'users',
    component: () => import( '../views/UsersView.vue'),
    meta: { requireAuth: true , requireAdmin: true }
  },
   {
    path: '/login',
    name: 'login',
    component: () => import( '../views/LoginView.vue')
  },
  {
  path: '/register',
  name: 'register',
  component: () => import('../views/RegisterView.vue')
  },
  {
  path: '/cookie',
  name: 'cookie',
  component: () => import('../views/cookieView.vue')
  },
   {
  path: '/contact',
  name: 'contact',
  component: () => import('../views/contactusView.vue')
  },
  {
  path: '/help',
  name: 'help',
  component: () => import('../views/helpView.vue')
  },
   {
  path: '/items',
  name: 'items',
  component: itemsView,
  meta: { requireAuth: true, requireAdmin: true  }
  // component: () => import('../views/itemsView.vue')
  },
   {
  path: '/update/:id',
  name: 'UserEditView',
  component: () => import('../views/UserEditView.vue')
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('logined') === '1'
  const now = Date.now()
  const expire = parseInt(localStorage.getItem('loginExpire') || '0')

  if (to.meta.requireAuth) {
    if (!isLogin || now > expire) {
      // 清除登录状态
      localStorage.removeItem('logined')
      localStorage.removeItem('user')
      localStorage.removeItem('loginExpire')

      // 显示提示消息
      ElMessage({
        message: '您还没有登录，请先登录后再访问该页面',
        type: 'warning',
        duration: 2000
      })

      // 正确地跳转到登录页
      next('/login')
      return
    }
  }
  //管理员判断
   if (to.meta.requireAdmin) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.admin !== '1') {
        ElMessage.error('您没有权限访问该页面')
        return next('/home') // 或跳转到其它安全页面
      }
    } catch (e) {
      ElMessage.error('用户信息异常，请重新登录')
      localStorage.clear()
      return next('/login')
    }
  }
  next()
})

export default router
