import { ExtensionType, extensions, utils } from '@pixi/core'
import { useEventListener } from '@vueuse/core'
import { Howl } from 'howler'
import { 获得资源 } from './美术资源'

function checkDataUrl(url: string, mimes: string) {
  if (Array.isArray(mimes)) {
    for (const mime of mimes) if (url.startsWith(`data:${mime}`)) return !0
    return !1
  }
  return url.startsWith(`data:${mimes}`)
}
function checkExtension(url: string, extension: string | string[]) {
  const tempURL = url.split('?')[0],
    ext = utils.path.extname(tempURL).toLowerCase()
  return Array.isArray(extension) ? extension.includes(ext) : ext === extension
}
const loadMp3 = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: 1,
  },
  name: 'loadMp3',
  test(url: string) {
    return checkDataUrl(url, 'audio/mpeg') || checkExtension(url, '.mp3')
  },
  async load(url: string) {
    return new Howl({ src: url, preload: true })
  },
}
extensions.add(loadMp3)

function 播放音频(文件: string) {
  const 音频元素 = document.createElement('audio')
  音频元素.src = 文件
  音频元素.volume = 0.25
  音频元素.play()
  return 音频元素
}
function 播放神威语音(美术资源: number[]) {
  const 文件 = 获得资源(美术资源, (f, i) => f === `flash/FlashVoice_${i}.mp3`)
  if (文件) {
    return 播放音频(文件)
  }
}
function 获得音频元素(id: string) {
  let 音频元素 = document.getElementById(id) as HTMLAudioElement | null
  if (!音频元素) {
    音频元素 = document.createElement('audio')
    音频元素.id = id
    document.body.appendChild(音频元素)
  }
  return 音频元素
}
function 播放语音(美术资源: number[], 类别: string) {
  const 文件 = 获得资源(美术资源, (f, i) =>
    f.match(`^character/${类别}_${i}(_[0-9]{2})?.mp3$`)
  )
  if (文件) {
    const 音频元素 = 获得音频元素(类别)
    if (音频元素.src != 文件) {
      音频元素.src = 文件
      音频元素.volume = 0.25
      音频元素.play()
    }
  }
}
function 播放攻击语音(美术资源: number[]) {
  播放语音(美术资源, 'VoiceAtk')
}
function 播放死亡语音(美术资源: number[]) {
  播放语音(美术资源, 'VoiceDie')
}
function 播放待机语音(美术资源: number[]) {
  播放语音(美术资源, 'VoiceIdle')
}
function 播放技能语音(美术资源: number[]) {
  播放语音(美术资源, 'VoiceSkill')
}
function 播放攻击音效(美术资源: number[]) {
  return 播放语音(美术资源, 'SoundAtk')
}
async function 播放场景背景音乐(url: string) {
  const 音频元素 = 获得音频元素('bgm')
  音频元素.src = url
  音频元素.loop = true
  音频元素.volume = 0.15
  useEventListener(
    document.body,
    'click',
    () => {
      if (音频元素.paused) {
        音频元素.play()
      }
    },
    { once: true }
  )
  await 音频元素.play()
}
async function 播放角色背景音乐(美术资源: number[]) {
  const 音频元素 = 获得音频元素('bgm')
  const 文件 = 获得资源(美术资源, (f, i) => f === `bgm/BGM_character_${i}.mp3`)
  if (文件 && !音频元素.src.endsWith(文件)) {
    音频元素.src = 文件
    音频元素.loop = true
    音频元素.volume = 0.1
    await 音频元素.play()
  }
}

export {
  播放场景背景音乐,
  播放待机语音,
  播放技能语音,
  播放攻击语音,
  播放攻击音效,
  播放死亡语音,
  播放神威语音,
  播放角色背景音乐,
  播放音频,
}
