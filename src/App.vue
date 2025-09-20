<template>
  <router-view />
  <span class="absolute-bottom bg-dark text-white" style="width: fit-content">
    当前版本：{{ packageInfo.version }}；在线人数：{{ 在线人数 }}
  </span>
  <pwa-install></pwa-install>
</template>

<script setup lang="ts">
import '@khmyznikov/pwa-install'
import packageInfo from 'app/package.json'
import { 在线人数, 开始心跳, 订阅在线人数 } from 'src/utils/在线'
import VConsole from 'vconsole'

new VConsole({ theme: 'dark' }).setSwitchPosition(0, screen.height)

开始心跳()
订阅在线人数()
defineOptions({
  name: 'App',
})
if ('serviceWorker' in navigator) {
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      location.reload()
      refreshing = true
    }
  })
}
</script>
