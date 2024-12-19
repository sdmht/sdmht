<template>
  <router-view />
  <span class="absolute-bottom bg-dark text-white" style="width: fit-content">
    当前版本：{{ packageInfo.version }}；在线人数：{{ 在线人数 }}
  </span>
  <pwa-install />
</template>

<script setup lang="ts">
import '@khmyznikov/pwa-install'
import packageInfo from 'app/package.json'
import { 在线人数, 开始心跳, 订阅在线人数 } from 'src/utils/在线'
开始心跳()
订阅在线人数()
</script>
