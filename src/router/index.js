// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Dashboard.vue'),
      },
    ],
  },
  {
    path: '/verification',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/verification',
        name: 'Verification',
        component: () => import(/* webpackChunkName: "home" */ '@/views/PendingVerification.vue'),
      },
    ],
  },
  {
    path: '/giftcard-trades',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/giftcard-trades',
        name: 'GiftcardTrades',
        component: () => import(/* webpackChunkName: "home" */ '@/views/GiftcardTrades.vue'),
      },
    ],
  },
  {
    path: '/withdrawal',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/withdrawal',
        name: 'Withdrawal',
        component: () => import(/* webpackChunkName: "home" */ '@/views/WithdrawFunds.vue'),
      },
    ],
  },
  {
    path: '/trade-history',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/trade-history',
        name: 'TradingHistory',
        component: () => import(/* webpackChunkName: "home" */ '@/views/TradingHistory.vue'),
      },
    ],
  },
  {
    path: '/users',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Users.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Login.vue'),
      },
    ],
  },
  {
    path: '/messages',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/messages',
        name: 'Messages',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Messages.vue'),
      },
    ],
  },
  {
    path: '/activities',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/activities',
        name: 'Activities',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Activities.vue'),
      },
    ],
  },
  {
    path: '/setup',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/setup',
        name: 'Setup',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Setup.vue'),
      },
      {
        path: '/giftcard-country/:id',
        name: 'GiftcardCountry',
        component: () => import(/* webpackChunkName: "home" */ '@/views/GiftcardCountry.vue'),
      },
      {
        path: '/giftcard-country/giftcard-denominations/:id',
        name: 'GiftcardDenominations',
        component: () => import(/* webpackChunkName: "home" */ '@/views/GiftcardDenominations.vue'),
      },
    ],
  },
  {
    path: '/crypto-setup',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/crypto-setup',
        name: 'CryptoSetup',
        component: () => import(/* webpackChunkName: "home" */ '@/views/CryptoSetup.vue'),
      },
    ],
  },
  {
    path: '/crypto-trades',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/crypto-trades',
        name: 'CryptoTradingHistory',
        component: () => import(/* webpackChunkName: "home" */ '@/views/CryptoTradingHistory.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
