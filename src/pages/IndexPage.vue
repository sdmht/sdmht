<template>
  <div id="首页框" class="overflow-hidden full-height full-width flex justify-between bg-dark">
    <div class="text-white col">
      本站为神代梦华谭玩家收集原动画资源后自制复活的仿品，请勿用于商业行为
      <ol>
        使用方式
        <li v-if="!是否移动端">
          用Edge浏览器，点地址栏右边收藏旁边的安装，然后回桌面打开神代梦华谭
        </li>
        <li v-else>
          用Edge浏览器，菜单>添加至手机>安装（如果切到应用信息，权限管理>其他权限>桌面快捷方式>始终允许，再次安装），然后回到桌面打开神代梦华谭
        </li>
      </ol>
      <ol>
        反馈渠道
        <li><a href="https://qm.qq.com/q/PWZyQvtFOU" target="_blank">QQ群：重制神代梦华谭</a></li>
        <li>
          <a href="https://github.com/sdmht/sdmht/issues" target="_blank">源代码仓库议题</a>
        </li>
      </ol>
      <ol>
        参与开发
        <li>
          <a href="https://github.com/sdmht/sdmht/" target="_blank">源代码仓库</a>
        </li>
        <li>
          <a href="https://github.com/sdmht/sdmht/blob/main/参与开发教程.md" target="_blank"
            >参与开发教程</a
          >
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import p from 'phaser'
import 'phaser/plugins/spine/dist/SpinePlugin.min.js'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const 是否移动端 = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)

const 宽 = 1080
const 高 = 1920

const router = useRouter()

class 首页场景 extends p.Scene {
  constructor() {
    super('首页场景')
  }

  preload() {
    this.load.image('背景图', '首页/背景.webp')
    this.load.audio('背景音乐', '首页/神代梦华谭.mp3')
    this.load.image('图标', '首页/图标.webp')
    this.load.image('浮空城', '首页/浮空城.webp')
    this.load.spine('道德天尊', '首页/道德天尊.json', ['首页/道德天尊.atlas'])
    this.load.image('点击启动', '首页/点击启动.webp')
  }

  create() {
    const 背景图 = this.add.image(宽 / 2, 高 / 2, '背景图')
    背景图.setScale(宽 / 背景图.width)
    const 图标 = this.add.image(0, 0, '图标').setOrigin(0)
    图标.setScale((宽 * 0.5) / 图标.width)
    const 浮空城 = this.add.image(0, 高 * 0.2, '浮空城').setOrigin(0)
    浮空城.setScale((宽 * 0.4) / 浮空城.width)
    this.sound.add('背景音乐', { loop: true, volume: 0.1 }).play()
    const 道德天尊 = this.add.spine(宽 / 2, 高 / 2, '道德天尊', 'eye_off', true)
    道德天尊.setScale(宽 / 道德天尊.width / 0.7)
    function 眨眼() {
      道德天尊.addAnimation(0, 'eye_on', false, 0)
      道德天尊.addAnimation(0, 'eye', true, 0)
    }
    眨眼()
    this.time.addEvent({
      delay: 8000,
      callback: 眨眼,
      callbackScope: this,
      loop: true,
    })

    const 点击启动 = this.add.image(宽 / 2, 高 * 0.65, '点击启动')
    this.tweens.add({
      targets: 点击启动,
      alpha: 0,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    })

    this.input.on('pointerdown', () => {
      router.push('/card_deck')
    })
  }
}
let 游戏: p.Game

onMounted(() => {
  游戏 = new p.Game({
    type: p.AUTO,
    width: 宽,
    height: 高,
    parent: '首页框',
    scene: 首页场景,
    scale: { mode: p.Scale.ScaleModes.FIT },
    plugins: { scene: [{ key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }] },
  })
})
onUnmounted(() => {
  游戏.plugins.destroy()
  游戏.destroy(true)
})
</script>
