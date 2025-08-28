import p from 'phaser'

const 随机类 = new p.Math.RandomDataGenerator('随机数种子')

class 基类 {
  id: number
  constructor() {
    this.id = 随机类.real()
  }
}

class 目标类 extends 基类 {
  static 目标列表: 目标类[] = []
  是否我方: boolean
  //效果列表: 效果类[] = []
  constructor(是否我方: boolean) {
    super()
    this.是否我方 = 是否我方
    目标类.目标列表.push(this)
  }
  我方<T extends 目标类>(类: new (...args: never[]) => T) {
    return 目标类.目标列表.filter(
      (x) => x instanceof 类 && x.是否我方 == this.是否我方,
    ) as T[]
  }
  敌方<T extends 目标类>(类: new (...args: never[]) => T) {
    return 目标类.目标列表.filter(
      (x) => x instanceof 类 && x.是否我方 != this.是否我方,
    ) as T[]
  }
}

class 单位类 extends 目标类 {}

export { 基类, 目标类, 单位类, 随机类 }
