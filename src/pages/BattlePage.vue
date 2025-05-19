<template>
  <div id="游戏容器"></div>
</template>

<script setup lang="ts">
import 文件列表 from 'assets/文件列表.json'
import _ from 'lodash'
import p from 'phaser'
import 'phaser/plugins/spine/dist/SpinePlugin.min.js'
import { onMounted, onUnmounted } from 'vue'

// import { 事件总线 } from 'utils/事件总线'

const 宽 = 1920
const 高 = 1080

class 对战场景 extends p.Scene {
  constructor() {
    super('对战场景')
  }

  preload() {
    const 背景编号 = _.sample(
      文件列表
        .filter((f) => f.match(/background\/BackgroundBattle_\d+\.webp/))
        .map((f) => f.match(/\d+/)![0]),
    )
    this.load.image('背景图', `background/BackgroundBattle_${背景编号}.webp`)
    this.load.audio('背景音乐', `background/BackgroundBattle_${背景编号}.mp3`)
  }

  async create() {
    const 背景图 = this.add.image(宽 / 2, 高 / 2, '背景图')
    背景图.setScale(宽 / 背景图.width)
    this.sound.add('背景音乐', { loop: true, volume: 0.1 }).play()
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
