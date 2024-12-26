declare module '*.csv' {
  const value: Record<string, string>[]
  export default value
}
declare module 'assets/data/ron_cfg_bullet.csv' {
  const value: Record<
    '编号' | '特效类型' | '发动时长' | '落下时间' | '受击时长' | '震屏类型' | '黑屏',
    string
  >[]
  export default value
}
declare module 'assets/data/ron_cfg_clothes_main.csv' {
  const value: Record<
    | '服装编号'
    | '适用主神ID'
    | '赠送头像'
    | '是否处于调试中'
    | '专属BGM'
    | '特殊弹幕'
    | 'Live2D插入画'
    | '语音'
    | 'Q版'
    | '卡面'
    | '名字'
    | '描述'
    | '物品图标'
    | '变身服装',
    string
  >[]
  export default value
}
declare module 'assets/data/ron_cfg_clothes_sub.csv' {
  const value: Record<'编号' | '画师' | '皮肤名称' | '附属神名称', string>[]
  export default value
}
declare module 'assets/data/ron_cfg_card_bullet.csv' {
  const value: Record<
    | '编号'
    | '阵营'
    | '类型'
    | '品质'
    | '攻击力'
    | '吟唱时间'
    | '弹幕攻击范围'
    | '是否暴露自身'
    | '是否驱散迷雾'
    | '消耗'
    | '技能'
    | '仅系统用'
    | '是否处于调试中'
    | '献祭比重值'
    | '重铸铸造费用'
    | '拆解所得'
    | '是否可铸造'
    | '是否可拆解与献祭'
    | '卡牌名称'
    | '描述'
    | '排序编号'
    | '美术资源'
    | '弹幕特效'
    | '画师'
    | '调整'
    | '版本',
    string
  >[]
  export default value
}
declare module 'assets/data/ron_cfg_card_effect.csv' {
  const value: Record<
    | '编号'
    | '阵营'
    | '品质'
    | '类型'
    | '技能'
    | '仅系统用'
    | '是否处于调试中'
    | '献祭比重值'
    | '重铸铸造费用'
    | '拆解所得'
    | '是否可铸造'
    | '是否可拆解与献祭'
    | '卡牌名称'
    | '描述'
    | '排序编号'
    | '美术资源'
    | '画师'
    | '是否调整'
    | '调整版本',
    string
  >[]
  export default value
}
declare module 'assets/data/ron_cfg_card_infor.csv' {
  const value: Record<
    | '编号'
    | '名称'
    | '种类'
    | '技能名称'
    | '攻击力'
    | '生命值'
    | '技能'
    | '势力'
    | '画师'
    | 'CV'
    | '技能发动'
    | '语音阵亡'
    | '语音攻击1'
    | '语音攻击2'
    | '语音杂谈1'
    | '语音杂谈2'
    | '基本信息'
    | '背景描述'
    | '故事1'
    | '故事2'
    | '故事3'
    | '故事4'
    | '故事5'
    | '调试中',
    string
  >[]
  export default value
}
declare module 'assets/data/ron_cfg_card_main.csv' {
  const value: Record<
    | '编号'
    | '阵营'
    | '攻击力'
    | '生命值'
    | '移动力'
    | '技能1'
    | '技能2'
    | '技能3'
    | '仅系统用'
    | '是否处于调试中'
    | '卡牌名称'
    | '描述'
    | 'CV'
    | '画师'
    | '美术资源',
    string
  >[]
  export default value
}
declare module 'assets/data/ron_cfg_card_sub.csv' {
  const value: Record<
    | '编号'
    | '阵营'
    | '类型'
    | '攻击力'
    | '生命值'
    | '移动力'
    | '关联头像'
    | '品质'
    | '可否攻击'
    | '可否装填'
    | '可否移动'
    | '技能'
    | '仅系统用'
    | '伙伴卡ID'
    | '是否处于调试中'
    | '献祭比重值'
    | '重铸铸造费用'
    | '拆解所得'
    | '是否可铸造'
    | '是否可拆解与献祭'
    | '卡牌名称'
    | '描述'
    | '美术资源'
    | 'CV'
    | '画师'
    | '是否调整'
    | '调整版本',
    string
  >[]
  export default value
}
declare module 'assets/data/ron_cfg_skill.csv' {
  const value: Record<
    | '技能ID'
    | '技能名称'
    | '技能描述'
    | '消耗'
    | '何时触发'
    | '触发辅助'
    | '对敌我方'
    | '目标类型'
    | '选择规则'
    | '选择范围'
    | '效果类型'
    | '效果值'
    | '附带技能'
    | '回合最大使用次数'
    | '单场最大使用次数'
    | '是否有有益的'
    | '是否处于调试中',
    string
  >[]
  export default value
}
declare module 'assets/data/ron_cfg_tag.csv' {
  const value: Record<'编号' | '效果名' | '效果描述', string>[]
  export default value
}
