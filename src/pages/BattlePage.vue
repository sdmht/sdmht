<template>
  <div id="游戏容器"></div>
</template>

<script setup lang="ts">
import 文件列表 from 'assets/文件列表.json'
import _ from 'lodash'
import p from 'phaser'
import 'phaser/plugins/spine/dist/SpinePlugin.min.js'
import { 事件总线 } from 'src/utils/事件总线'
import { 加载子画面 } from 'src/utils/加载动画'
//import { 字符串转编号卡组 } from 'src/utils/卡组'
import { onMounted, onUnmounted } from 'vue'
//import { useRoute } from 'vue-router'

// import { 事件总线 } from 'utils/事件总线'

const 宽 = 1920
const 高 = 1080
const 背景编号 = _.sample(
  文件列表
    .filter((f) => f.match(/background\/BackgroundBattle_\d+\.webp/))
    .map((f) => f.match(/\d+/)![0]),
)
//const 路由 = useRoute()
const 人数 = 2
//const 我方卡组 = 字符串转编号卡组(路由.query['卡组'] as string)
const 格 = 4

class 对战场景 extends p.Scene {
  constructor() {
    super('对战场景')
  }

  preload() {
    this.load.audio('背景音乐', `background/BackgroundBattle_${背景编号}.mp3`)
  }

  async create() {
    this.sound.add('背景音乐', { loop: true, volume: 0.1 }).play()

    const 背景图 = await 加载子画面(this, '背景图', `background/BackgroundBattle_${背景编号}.webp`)
    背景图.setScale(宽 / 背景图.width)

    const 边 = Math.min(高, 宽) * 0.5
    const 位宽 = (边 / 格) * 1.3
    const 线宽 = 位宽 / 25
    const 场地横轴间隔 = 宽 / 人数
    const 横轴起点偏移 = (场地横轴间隔 - 边) / 3

    const 迷雾层 = this.add.container()
    迷雾层.alpha = 0.5

    for (let i = 0; i < 人数; i++) {
      const 横 = 横轴起点偏移 + 场地横轴间隔 * i + 位宽 / 2
      const 纵 = (高 - 边) / 2 + 位宽 / 2
      const 迷雾区 = this.add.container(横, 纵)
      迷雾层.add(迷雾区)
      for (let r = 0; r < 格; r++) {
        const 迷雾行 = this.add.container(0, r * 位宽)
        迷雾区.add(迷雾行)
        for (let c = 0; c < 格; c++) {
          const 迷雾格 = this.add.rectangle(c * 位宽, 0, 位宽, 位宽, 0x000000)
          迷雾行.add(迷雾格)
        }
      }
    }

    const 边框层 = this.add.graphics()
    边框层.lineStyle(线宽, 0xffffff)

    for (let i = 0; i < 人数; i++) {
      const 横 = 横轴起点偏移 + 场地横轴间隔 * i
      const 纵 = (高 - 边) / 2
      for (let r = 0; r < 格; r++) {
        for (let c = 0; c < 格; c++) {
          边框层.moveTo((c + 2 / 5) * 位宽 + 横, r * 位宽 + 纵)
          边框层.lineTo(c * 位宽 + 横, r * 位宽 + 纵)
          边框层.lineTo(c * 位宽 + 横, (r + 2 / 5) * 位宽 + 纵)
          边框层.moveTo((c + 3 / 5) * 位宽 + 横, r * 位宽 + 纵)
          边框层.lineTo((c + 1) * 位宽 + 横, r * 位宽 + 纵)
          边框层.lineTo((c + 1) * 位宽 + 横, (r + 2 / 5) * 位宽 + 纵)
          边框层.moveTo(c * 位宽 + 横, (r + 3 / 5) * 位宽 + 纵)
          边框层.lineTo(c * 位宽 + 横, (r + 1) * 位宽 + 纵)
          边框层.lineTo((c + 2 / 5) * 位宽 + 横, (r + 1) * 位宽 + 纵)
          if (r == 格 - 1 || c == 格 - 1) {
            边框层.moveTo((c + 1) * 位宽 + 横, (r + 3 / 5) * 位宽 + 纵)
            边框层.lineTo((c + 1) * 位宽 + 横, (r + 1) * 位宽 + 纵)
            边框层.lineTo((c + 3 / 5) * 位宽 + 横, (r + 1) * 位宽 + 纵)
          }
        }
      }
    }
    边框层.strokePath()

    事件总线.on('事件1', () => {
      console.log('事件1开始')
      事件总线.emit('事件2')
      console.log('事件1结束')
    })
    事件总线.on('事件2', () => {
      console.log('事件2开始')
      事件总线.emit('事件3')
      console.log('事件2结束')
    })

    事件总线.emit('事件1')
  }
}

let 游戏: p.Game

onMounted(() => {
  游戏 = new p.Game({
    type: p.AUTO,
    width: 宽,
    height: 高,
    parent: '游戏容器',
    scene: 对战场景,
    scale: {
      mode: p.Scale.ScaleModes.FIT,
      autoCenter: p.Scale.Center.CENTER_BOTH,
    },
    plugins: { scene: [{ key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }] },
  })
})
onUnmounted(() => {
  游戏.plugins.destroy()
  游戏.destroy(true)
})
</script>
