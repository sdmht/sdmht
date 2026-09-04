const fs = require('fs')
const path = require('path')
const base = path.join(__dirname, 'src', 'assets', 'data')

function load(file) {
  const txt = fs.readFileSync(path.join(base, file), 'utf8')
  const lines = txt.split(/\r?\n/).filter((l) => l.trim())
  const header = lines[0].split(';')
  return lines.slice(1).map((l) => {
    const cells = l.split(';')
    const o = {}
    header.forEach((h, i) => (o[h] = cells[i]))
    return o
  })
}
const cards = load('ron_cfg_card_effect.csv')
const skills = load('ron_cfg_skill.csv')
const skillById = new Map(skills.map((s) => [Number(s['技能ID']), s]))
function children(skill) {
  const raw = skill['附带技能']
  if (raw === undefined || raw === '' || raw === '-1' || raw === '0') return []
  return String(raw)
    .split(',')
    .map((x) => Number(x))
    .filter((x) => x && x > 0)
}
// walk skill tree returning list of skills that would open an independent 选择 dialog
function 独立选择技能列表(rootSkillId) {
  const out = []
  const seen = new Set()
  function walk(id, parentChoosing, parentSkill) {
    if (!id || seen.has(id)) return
    seen.add(id)
    const s = skillById.get(id)
    if (!s) return
    const choosing = s['选择规则'] === '1'
    const sharesParentTarget =
      parentSkill !== undefined &&
      (s['目标类型'] === '0' /*父技能的目标? unclear*/ ||
        (parentChoosing && choosing))
    if (choosing && !(parentSkill !== undefined && parentChoosing && choosing)) {
      // counts as independent dialog ONLY if its parent is not choosing; but if this is root (top), it's the first dialog
      out.push({ id, skill: s, isRoot: parentSkill === undefined })
    }
    // determine whether children share this skill's target
    children(s).forEach((c) => walk(c, choosing, s))
  }
  walk(rootSkillId, false, undefined)
  return out
}
let 多独立选择卡 = []
let 有独立选择卡 = []
for (const c of cards) {
  if (c['类型'] !== '1' && c['类型'] !== '2') continue
  const rootId = Number(c['技能'])
  if (!rootId) continue
  const list = 独立选择技能列表(rootId)
  if (list.length) {
    有独立选择卡.push({ 编号: c['编号'], 类型: c['类型'], 名称: c['卡牌名称'], 技能: rootId, 独立选择: list.map((l) => ({ id: l.id, 名称: l.skill['技能名称'], 目标类型: l.skill['目标类型'], 选择范围: l.skill['选择范围'] })) })
  }
  if (list.length > 1) 多独立选择卡.push({ 编号: c['编号'], 类型: c['类型'], 名称: c['卡牌名称'], list: list.map((l) => `${l.id}(${l.skill['技能名称']})`) })
}
console.log('神迹/秘术卡总数(含系统):', cards.filter((c) => c['类型'] === '1' || c['类型'] === '2').length)
console.log('含>=1个独立选择: ', 有独立选择卡.length)
console.log('含>=2个独立选择(链式多次弹窗): ', 多独立选择卡.length)
console.log(JSON.stringify(多独立选择卡, null, 1))
console.log('--- 全部含独立选择的卡 ---')
for (const k of 有独立选择卡) {
  console.log(k.编号, '类型' + k.类型, k.名称, '->', JSON.stringify(k.独立选择))
}
