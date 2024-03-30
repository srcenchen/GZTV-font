// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/home/HomeLayout.vue'),
    redirect: '/online-video',
    children: [
      {
        path: 'online-video',
        name: '在线视频',
        component: () => import('@/views/OnlineVideo.vue'),
      },
      {
        path: 'live-room',
        name: '直播大厅',
        component: () => import('@/views/LiveRoom.vue'),
      }
    ],
  },
  {
    path: '/video-player',
    component: () => import('@/layouts/player/VideoPlayer.vue'),
  },
  {
    path: '/live-player',
    component: () => import('@/layouts/player/LivePlayer.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/layouts/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/admin/video-manage',
    children: [
      {
        path: 'video-manage',
        component: () => import('@/views/admin/VideoManage.vue'),
      },
      {
        path: 'group-manage',
        component: () => import('@/views/admin/GroupManage.vue'),
      },
      {
        path: 'live-manage',
        component: () => import('@/views/admin/LiveManage.vue'),
      },
      {
        path: 'system-manage',
        component: () => import('@/views/admin/SystemManage.vue'),
      }
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/online-video",
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 判断是否需要登录
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 判断是否已经登录
    if (localStorage.getItem('username')) {
      next()
    } else {
      next({
        path: '/',
      })
      alert('请先登录')
    }
  } else {
    next()
  }
})
export default router
