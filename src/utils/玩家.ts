import { 目标类 } from './游戏'
import type { 编号卡组类型 } from './卡组'
import type { 初始数据类型 } from './数据通道'
import { 主神类 } from './神明'

class 玩家类 extends 目标类 {
  主神: 主神类
  格 = 4
  constructor(是否我方: boolean, 卡组: 编号卡组类型 | 初始数据类型) {
    super(是否我方)
    console.log(是否我方, 卡组)
    this.主神 = new 主神类(是否我方)
  }
}

export { 玩家类 }
