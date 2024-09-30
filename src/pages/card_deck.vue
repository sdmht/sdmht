<template>
  <q-list>
    <q-item clickable v-ripple class="q-pa-lg">
      <div class="text-h4 full-width text-center">创建卡组</div>
    </q-item>
    <div class="text-center">向左划卡组进入战斗界面</div>
    <template v-for="(卡组, k) in 编号卡组列表" :key="k">
      <q-slide-item
        :style="`width: ${
          $q.screen.width > $q.screen.height ? 5 : 10
        }0%; display: inline-block`"
        left-color="dark"
        right-color="red"
        @left="
          (e) => {
            e.reset()
            编辑卡组(卡组)
          }
        "
        @right="
          (e) => {
            e.reset()
            匹配对手(卡组)
          }
        "
      >
        <template v-slot:left>
          <img
            style="height: 50vh"
            src="~assets/assetbundle/texture/Background_PVE.webp"
          />
        </template>
        <template v-slot:right>
          <img
            style="height: 50vh"
            src="~assets/assetbundle/texture/Background_Rank.webp"
          />
        </template>
        <q-item clickable v-ripple>
          <div>
            <div class="text-h4 text-center">{{ 卡组.卡组名 }}</div>
            <img
              draggable="false"
              style="width: 50%"
              :title="获得主神信息(卡组.主神).卡牌名称"
              :src="`maincard/CharacterHeadM_${
                获得主神信息(卡组.主神).美术资源
              }.webp`"
            />
            <img
              v-for="(编号, i) in 卡组.附属神"
              :key="i"
              draggable="false"
              :style="`width: ${50 / 卡组.附属神.length}%; aspect-ratio: 1`"
              :title="获得附属神信息(编号).卡牌名称"
              :src="`character/CharacterHeadL_${
                获得附属神信息(编号).美术资源
              }.webp`"
            />
          </div>
        </q-item>
      </q-slide-item>
    </template>
  </q-list>
</template>
<script setup lang="ts">
import { 获得主神信息, 获得附属神信息 } from 'src/utils/信息'
import { 编号卡组列表, 编号卡组类型, 编号卡组转字符串 } from 'src/utils/卡组'
import { 播放场景背景音乐 } from 'src/utils/播放音频'
import { 暗色模式 } from 'src/utils/暗色模式'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => {
  播放场景背景音乐('main/BGM_day.mp3')
})
暗色模式()

async function 匹配对手(卡组: 编号卡组类型) {
  router.push({
    name: 'battle',
    query: {
      卡组: 编号卡组转字符串(卡组),
    },
  })
}
function 编辑卡组(卡组: 编号卡组类型) {
  console.log(卡组)
}
</script>
