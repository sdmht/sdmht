const fs = require('fs')
const path = require('path')
const base = path.join(__dirname, 'src', 'assets', 'data')
function load(file) {
  const lines = fs.readFileSync(path.join(base, file), 'utf8').split(/\r?\n/).filter(Boolean)
  const header = lines[0].split(';')
  return lines.slice(1).map((l) => {
    const o = {}; const cells = l.split(';')
    header.forEach((h, i) => (o[h] = cells[i])); return o
  })
}
const cards = load('ron_cfg_card_effect.csv')
const skills = load('ron_cfg_skill.csv')
const skillById = new Map(skills.map((s) => [Number(s['技能ID']), s]))
const seen = new Set()
function isChoiceRoot(id) {
  if (seen.has(id)) return false
  seen.add(id)
  const s = skillById.get(id)
  return s && s['选择规则'] === '1'
}
let cnt = 0
for (const c of cards) {
  if (c['类型'] !== '1') continue
  const root = Number(c['技能'])
  if (!root) continue
  if (!isChoiceRoot(root)) continue
  const s = skillById.get(root)
  cnt++
  if (String(s['何时触发']) !== '0') {
    console.log('非发动时的选择卡：', c['编号'], c['卡牌名称'], '何时触发=', s['何时触发'])
  }
}
console.log('选择类神迹卡数量：', cnt)
