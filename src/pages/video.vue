<template>
  <video
    ref="video"
    style="height: 100vh; aspect-ratio: 16/9"
    controls
    autofocus
    :src="video_src"
  ></video>
</template>
<script setup lang="ts">
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const video_src = route.query.src as string

const video = ref<HTMLVideoElement>()

onMounted(() => {
  if (video.value) {
    new Plyr(video.value, {
      keyboard: {
        focused: false,
        global: true,
      },
      controls: [
        'play-large',
        'rewind',
        'play',
        'fast-forward',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'settings',
        'pip',
        'fullscreen',
      ],
    })
  }
})
</script>
