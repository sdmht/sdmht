<template>
  <div id="游戏容器"></div>
</template>

<script setup lang="ts">
import 文件列表 from 'assets/文件列表.json'
import _ from 'lodash'
import p from 'phaser'
import 'phaser/plugins/spine/dist/SpinePlugin.min.js'
import { 加载子画面 } from 'src/utils/加载动画'
import { onMounted, onUnmounted } from 'vue'

// import { 事件总线 } from 'utils/事件总线'

const 宽 = 1920
const 高 = 1080
const 背景编号 = _.sample(
  文件列表
    .filter((f) => f.match(/background\/BackgroundBattle_\d+\.webp/))
    .map((f) => f.match(/\d+/)![0]),
)

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
