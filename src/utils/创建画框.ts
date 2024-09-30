import { useEventListener } from '@vueuse/core'
import _ from 'lodash'
import * as PIXI from 'pixi.js'
useEventListener(
  window,
  'resize',
  _.debounce(
    () => {
      location.reload()
    },
    1000,
    { leading: false }
  )
)
function 创建画框(选项: Partial<PIXI.IApplicationOptions> = {}) {
  const 画框 = new PIXI.Application<HTMLCanvasElement>({
    width: innerWidth * 2,
    height: innerHeight * 2,
    backgroundAlpha: 0,
    autoDensity: true,
    ...选项,
  })
  const 画布 = 画框.view
  画布.style.width = '100%'
  画布.style.height = '100%'

  画框.ticker.maxFPS = 60
  return 画框
}
export { 创建画框 }
