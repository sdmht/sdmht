<template>
  <div
    ref="首页框"
    class="overflow-hidden full-height full-width flex justify-between bg-dark"
  >
    <div class="text-white">
      本站为神代梦华谭玩家收集原动画资源后自制复活的仿品，请勿用于商业行为
      <ol>
        使用方式
        <li>电脑版（推荐）：https://sdmhtexe.star2000.work/latest.exe</li>
        <li>
          手机用Edge浏览器，菜单>添加至手机>安装（如果切到应用信息，权限管理>其他权限>桌面快捷方式>始终允许，再次安装），然后回到桌面打开神代梦华谭
        </li>
        <li>网页版：https://sdmht.star2000.work</li>
      </ol>
      <ol>
        反馈渠道
        <li>QQ群：102804509</li>
        <li>源代码仓库议题：https://gitee.com/star2000/sdmht/issues</li>
      </ol>
      <ol>
        参与开发
        <li>
          教程：https://gitee.com/star2000/sdmht/blob/master/参与开发教程.md
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
