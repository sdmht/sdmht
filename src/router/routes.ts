function index() {
  return import(/* webpackChunkName: "index" */ 'pages/index.vue')
}
function battle() {
  return import(/* webpackChunkName: "battle" */ 'pages/battle.vue')
}
function card_deck() {
  return import(/* webpackChunkName: "card_deck" */ 'pages/card_deck.vue')
}
function login() {
  return import(/* webpackChunkName: "login" */ 'pages/login.vue')
}
function video() {
  return import(/* webpackChunkName: "video" */ 'pages/video.vue')
}

export default [
  {
    name: 'index',
    path: '/',
    component: index,
  },
  {
    name: 'battle',
    path: '/battle',
    component: battle,
  },
  {
    name: 'card_deck',
    path: '/card_deck',
    component: card_deck,
  },
  {
    name: 'login',
    path: '/login',
    component: login,
  },
  {
    name: 'video',
    path: '/video',
    component: video,
  },
]
