import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // 前台
  {
    path: '/',
    component: () => import('../views/Frontend.vue'),
    children: [
      {
        path: '/',
        component: () => import('../views/Home.vue'),
        meta: {
          title: '首頁'
        }
      },
      {
        // 子路由前方不用加上 /
        path: 'products',
        component: () => import('../views/Products.vue'),
        meta: {
          title: '產品列表'
        }
      },
      {
        path: 'product/:id', // 使用動態路由
        component: () => import('../views/Product.vue'),
        meta: {
          title: '產品介紹'
        }
      },
      {
        path: 'cart',
        component: () => import('../views/Cart.vue'),
        meta: {
          title: '購物車'
        }
      }
    ]
  },
  // 登入路由獨立
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登入'
    }
  },
  // 後台
  {
    path: '/admin',
    component: () => import('../views/Dashboard/Dashboard.vue'),
    children: [
      {
        path: 'products',
        component: () => import('../views/Dashboard/Products.vue'),
        meta: {
          title: '產品管理'
        }
      },
      {
        path: 'orders',
        component: () => import('../views/Dashboard/Orders.vue'),
        meta: {
          title: '訂單管理'
        }
      },
      {
        path: 'coupons',
        component: () => import('../views/Dashboard/Coupons.vue'),
        meta: {
          title: '優惠券管理'
        }
      }
    ]
  },
  // 錯誤路由重新導向回首頁
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) {
    return {
      top: 0
    }
  }
})

export default router
