import { Notify } from 'quasar'
import { 主神信息列表, 弹幕卡信息列表, 神迹卡信息列表, 附属神信息列表 } from './信息'

type 编号卡组类型 = {
  卡组名: string
  主神: number
  主神技能: 1 | 2 | 3
  附属神: number[]
  弹幕卡: number[]
  神迹卡: number[]
}

function 编号卡组转字符串(卡组: 编号卡组类型): string {
  return btoa(
    JSON.stringify([
      encodeURIComponent(卡组.卡组名),
      卡组.主神技能,
      卡组.主神 - 10000,
      卡组.附属神.map((x) => x - 20000),
      卡组.神迹卡.map((x) => x - 30000),
      卡组.弹幕卡.map((x) => x - 40000),
    ]),
  )
}
function 字符串转编号卡组(字符串: string): 编号卡组类型 {
  const 数据 = JSON.parse(atob(字符串)) as [string, 1 | 2 | 3, number, number[], number[], number[]]
  const 卡组 = {
    卡组名: decodeURIComponent(数据[0]),
    主神技能: 数据[1],
    主神: 数据[2] + 10000,
    附属神: 数据[3].map((x) => x + 20000),
    神迹卡: 数据[4].map((x) => x + 30000),
    弹幕卡: 数据[5].map((x) => x + 40000),
  }
  const 错误列表: string[] = []
  if (卡组.附属神.length != 2) {
    错误列表.push('附属神数量不为2')
  }
  if (卡组.神迹卡.length + 卡组.弹幕卡.length != 20) {
    错误列表.push('神迹卡+弹幕卡总数不为20')
  }
  if (
    主神信息列表.findIndex((x) => parseInt(x.仅系统用) == 0 && parseInt(x.编号) === 卡组.主神) == -1
  ) {
    错误列表.push(`不存在非系统用的编号为${卡组.主神}的主神`)
  }
  for (const 附属神 of 卡组.附属神) {
    if (
      附属神信息列表.findIndex((x) => parseInt(x.仅系统用) == 0 && parseInt(x.编号) === 附属神) ==
      -1
    ) {
      错误列表.push(`不存在非系统用的编号为${附属神}的附属神`)
    }
  }
  for (const 神迹卡 of 卡组.神迹卡) {
    if (
      神迹卡信息列表.findIndex((x) => parseInt(x.仅系统用) == 0 && parseInt(x.编号) === 神迹卡) ==
      -1
    ) {
      错误列表.push(`不存在非系统用的编号为${神迹卡}的神迹卡`)
    }
  }
  for (const 弹幕卡 of 卡组.弹幕卡) {
    if (
      弹幕卡信息列表.findIndex((x) => parseInt(x.仅系统用) == 0 && parseInt(x.编号) === 弹幕卡) ==
      -1
    ) {
      错误列表.push(`不存在非系统用的编号为${弹幕卡}的弹幕卡`)
    }
  }
  if (错误列表.length > 0) {
    for (const 错误 of 错误列表) {
      Notify.create({
        message: 错误,
        type: 'negative',
      })
    }
    throw 错误列表
  }
  return 卡组
}

export { 字符串转编号卡组, 编号卡组转字符串 }
export type { 编号卡组类型 }
