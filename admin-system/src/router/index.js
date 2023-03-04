import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: "/admin"
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/menu/MenuFrame.vue'),
    children: [
      {
        path: '/',
        name: 'mainIndex',
        component: () => import('../views/index/index.vue'),
      },
      {
        path: '/user',
        name: 'mainUser',
        component: () => import('../views/user/user.vue'),
      },
      {
        path: '/audit',
        name: 'mainAudit',
        component: () => import('../views/audit/audit.vue'),
      },
      {
        path: '/audit/detail',
        name: 'mainAuditDetail',
        component: () => import('../views/audit/detail.vue'),
      },
      {
        path: '/config',
        name: 'mainConfig',
        component: () => import('../views/config/config.vue'),
      },
      {
        path: '/downloadrecord',
        name: 'mainDownloadrecord',
        component: () => import('../views/annex_download/annex_download.vue'),
      }
    ]
  },
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/login.vue'),
      }
]

const router = new VueRouter({
  routes
})

export default router
