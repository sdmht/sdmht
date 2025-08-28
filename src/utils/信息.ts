import ron_cfg_card_bullet from 'assets/data/ron_cfg_card_bullet.csv'
import ron_cfg_card_effect from 'assets/data/ron_cfg_card_effect.csv'
import ron_cfg_card_infor from 'assets/data/ron_cfg_card_infor.csv'
import ron_cfg_card_main from 'assets/data/ron_cfg_card_main.csv'
import ron_cfg_card_sub from 'assets/data/ron_cfg_card_sub.csv'
import 主神皮肤 from 'assets/data/ron_cfg_clothes_main.csv'
import ron_cfg_clothes_sub from 'assets/data/ron_cfg_clothes_sub.csv'
import ron_cfg_skill from 'assets/data/ron_cfg_skill.csv'

const 卡信息 = ron_cfg_card_infor.sort(
  (_a, _b) => parseInt(_b.编号) - parseInt(_a.编号),
)

const 附属神皮肤 = ron_cfg_clothes_sub.sort(
  (_a, _b) => parseInt(_b.编号) - parseInt(_a.编号),
)

const 主神信息列表 = ron_cfg_card_main
  .sort((_a, _b) => parseInt(_b.编号) - parseInt(_a.编号))
  .sort((_a, _b) => parseInt(_a.仅系统用) - parseInt(_b.仅系统用))

const 附属神信息列表 = ron_cfg_card_sub
  .sort((_a, _b) => parseInt(_b.编号) - parseInt(_a.编号))
  .sort((_a, _b) => parseInt(_a.仅系统用) - parseInt(_b.仅系统用))

const 弹幕卡信息列表 = ron_cfg_card_bullet
  .sort((a, b) => parseInt(b.编号) - parseInt(a.编号))
  .sort((_a, _b) => parseInt(_a.仅系统用) - parseInt(_b.仅系统用))

const 神迹卡信息列表 = ron_cfg_card_effect
  .sort((a, b) => parseInt(b.编号) - parseInt(a.编号))
  .sort((_a, _b) => parseInt(_a.仅系统用) - parseInt(_b.仅系统用))

const 技能信息列表 = ron_cfg_skill.sort(
  (a, b) => parseInt(b.技能ID) - parseInt(a.技能ID),
)

function 获得卡信息(名称或编号: string | number) {
  const 类型 = typeof 名称或编号 == 'number' ? '编号' : '名称'
  const 信息 = 卡信息.find((_神) => _神[类型] == 名称或编号)
  return 信息
}

function 获得主神信息(名称或编号: string | number) {
  const 类型 = typeof 名称或编号 == 'number' ? '编号' : '卡牌名称'
  const 信息 = 主神信息列表.find((_神) => _神[类型] == 名称或编号)
  if (!信息) {
    throw new Error(`没有${类型}为${名称或编号}的主神`)
  }
  return 信息
}

function 获得附属神信息(名称或编号: string | number) {
  const 类型 = typeof 名称或编号 == 'number' ? '编号' : '卡牌名称'
  const 信息 = 附属神信息列表.find((_神) => _神[类型] == 名称或编号)
  if (!信息) {
    throw new Error(`没有${类型}为${名称或编号}的附属神`)
  }
  return 信息
}

function 获得弹幕卡信息(名称或编号: string | number) {
  const 类型 = typeof 名称或编号 == 'number' ? '编号' : '卡牌名称'
  const 信息 = 弹幕卡信息列表.find((_卡) => _卡[类型] == 名称或编号)
  if (!信息) {
    throw new Error(`没有${类型}为${名称或编号}的弹幕卡`)
  }
  return 信息
}

function 获得神迹卡信息(名称或编号: string | number) {
  const 类型 = typeof 名称或编号 == 'number' ? '编号' : '卡牌名称'
  const 信息 = 神迹卡信息列表.find((_卡) => _卡[类型] == 名称或编号)
  if (!信息) {
    throw new Error(`没有${类型}为${名称或编号}的神迹卡`)
  }
  return 信息
}

function 获得技能信息(技能ID: number) {
  const 信息 = 技能信息列表.find((r) => parseInt(r.技能ID) == 技能ID)
  if (!信息) {
    throw new Error(`没有ID为${技能ID}的技能`)
  }
  return 信息
}

export {
  主神信息列表,
  主神皮肤,
  卡信息,
  弹幕卡信息列表,
  技能信息列表,
  神迹卡信息列表,
  获得主神信息,
  获得卡信息,
  获得弹幕卡信息,
  获得技能信息,
  获得神迹卡信息,
  获得附属神信息,
  附属神信息列表,
  附属神皮肤,
}
