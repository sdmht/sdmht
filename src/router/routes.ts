import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/battle',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/BattlePage.vue') }],
  },
  {
    path: '/card_deck',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CardDeck.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
