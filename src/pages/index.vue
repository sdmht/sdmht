<template>
  <div
    ref="首页框"
    class="overflow-hidden full-height full-width flex justify-between bg-dark"
  >
    <div class="text-white col">
      本站为神代梦华谭玩家收集原动画资源后自制复活的仿品，请勿用于商业行为
      <ol>
        使用方式
        <template v-if="是否苹果端">
          <li>在Safari浏览器中打开此页面</li>
          <li>点击导航栏中的“分享”按钮</li>
          <li>点击“添加到主屏幕”</li>
        </template>
        <template v-else-if="是否移动端">
          <li>如果没有看到安装弹窗，换Edge浏览器打开此页面</li>
          <li>
            点击弹窗中的安装，如果之前隐藏了安装引导弹窗，点菜单>添加至手机>安装（如果切到应用信息，权限管理>其他权限>桌面快捷方式>始终允许，再次安装）
          </li>
        </template>
        <template v-else>
          <li>如果没有看到安装弹窗，换Edge浏览器打开此页面</li>
          <li>
            点击弹窗中的安装，如果之前隐藏了安装引导弹窗，点地址栏右边收藏旁边的安装
          </li>
        </template>
        <li>退出浏览器从桌面打开神代梦华谭</li>
      </ol>
      <ol>
        相关视频
        <li>
          <a href="/PV.webm">鸾鸟剧情PV（超清120帧HDR重制版）</a>
        </li>
        <li>
          <a href="/OP.webm">开场OP</a>
        </li>
      </ol>
      <ol>
        反馈渠道
        <li>
          <a href="https://qm.qq.com/q/PWZyQvtFOU" target="_blank"
            >QQ群：重制神代梦华谭</a
          >
        </li>
        <li>
          <a href="https://github.com/sdmht/sdmht/issues" target="_blank"
            >源代码仓库议题</a
          >
        </li>
      </ol>
      <ol>
        参与开发（有电脑就能尝试指挥AI写代码，方法在仓库的自述里，没有代码功底一样能改，千里之行始于足下）
        <li>
          <a href="https://github.com/sdmht/sdmht/" target="_blank"
            >源代码仓库</a
          >
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { 创建画框 } from 'src/utils/创建画框'
import { 加载动画, 加载子画面 } from 'src/utils/加载动画'
import { 播放场景背景音乐 } from 'src/utils/播放音频'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// import { useQuasar } from 'quasar'

// const q = useQuasar()

// function 是否未授权通知() {
//   return Notification.permission === 'default'
// }
// function 请求授权通知() {
//   Notification.requestPermission().then((permission) => {
//     if (permission === 'granted') {
//       location.reload()
//     }
//   })
// }
// if (是否未授权通知()) {
//   q.dialog({
//     title: '请求授权通知',
//     message: '用来在其他玩家开始匹配时通知你',
//     persistent: true,
//     cancel: true,
//     seamless: true,
//     position: 'bottom',
//   }).onOk(() => {
//     请求授权通知()
//   })
// }

const 是否苹果端 = /Macintosh|iPhone|iPad|iPod/i.test(navigator.userAgent)
const 是否移动端 = /Mobile|Android/i.test(navigator.userAgent)

let 首页框 = ref<HTMLDivElement>()

let router = useRouter()

onMounted(async () => {
  if (!首页框.value) return
  播放场景背景音乐('loading/登录_01.mp3')

  const 画框 = 创建画框({
    width: 720 * devicePixelRatio,
    height: 1280 * devicePixelRatio,
  })
  let 画布 = 画框.view
  首页框.value.appendChild(画布)
  画布.style.width = 'auto'
  画布.style.aspectRatio = String(画布.width / 画布.height)

  const 背景 = await 加载子画面('loading/0001_bg.webp')
  画框.stage.addChild(背景)
  背景.width = 画布.width
  背景.height = 画布.height

  const 浮空城 = await 加载子画面('loading/_0001_图层-101.webp')
  画框.stage.addChild(浮空城)
  浮空城.y = 画布.height * 0.25
  浮空城.scale.set((画布.width * 0.4) / 浮空城.width)

  const 图标 = await 加载子画面('loading/LOGO.webp')
  画框.stage.addChild(图标)
  图标.scale.set((画布.width * 0.5) / 图标.width)

  const 人物 = await 加载动画('loading/spineasset/登入界面_2.json')
  画框.stage.addChild(人物)
  人物.x = 画布.width / 2
  人物.y = 画布.height / 2
  人物.scale.set((画布.height * 1) / 人物.height)
  人物.state.addAnimation(0, 'eye_off', false, 0)
  function 眨眼() {
    人物.state.addAnimation(0, 'eye_on', false, 0)
    人物.state.addAnimation(0, 'eye', true, 0)
  }
  眨眼()
  setInterval(() => {
    眨眼()
  }, 8000)

  const 点击开始 = await 加载子画面('loading/tap to start.webp')

  画框.stage.addChild(点击开始)
  点击开始.scale.set((画布.width * 0.5) / 点击开始.width)
  点击开始.x = (画布.width - 点击开始.width) / 2
  点击开始.y = 画布.height * 0.65

  点击开始.alpha = 0
  setInterval(() => {
    if (点击开始.alpha >= 1) 点击开始.alpha = 0
    点击开始.alpha += 0.004
  }, 10)

  useEventListener(画布, 'click', () => {
    router.push('/card_deck')
  })
})
</script>
