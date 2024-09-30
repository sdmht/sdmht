import * as PXUI from '@pixi/ui'
import * as PIXI from 'pixi.js'

function 获得按钮(
  文本: string,
  字号: number,
  x: number,
  y: number,
  宽度: number,
  高度: number,
  点击事件: Parameters<
    InstanceType<typeof PXUI.Button>['onPress']['connect']
  >[0]
) {
  const 按钮背景 = new PIXI.Graphics()
    .beginFill(0x000000, 0.5)
    .drawRect(0, 0, 宽度, 高度)
    .endFill()
  按钮背景.x = x
  按钮背景.y = y
  const 按钮 = new PXUI.Button(按钮背景)
  按钮.onPress.connect(点击事件)
  const 文本对象 = new PIXI.Text(文本, {
    fill: 0xffffff,
    fontSize: 字号,
  })
  文本对象.x = (按钮.view.width - 文本对象.width) / 2
  文本对象.y = (按钮.view.height - 文本对象.height) / 2
  按钮.view.addChild(文本对象)
  return 按钮
}

export { 获得按钮 }
