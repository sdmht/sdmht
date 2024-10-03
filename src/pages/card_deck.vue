<template>
  <q-list>
    <q-item v-ripple class="q-pa-lg" clickable @click="卡组弹窗 = true">
      <div class="text-h4 full-width text-center">创建卡组</div>
    </q-item>
    <div class="text-center">卡组向左划进入战斗界面，向右划删除</div>
    <template v-for="(卡组, k) in 编号卡组列表" :key="k">
      <q-slide-item
        :style="`width: ${
          $q.screen.width > $q.screen.height ? 5 : 10
        }0%; display: inline-block`"
        left-color="dark"
        right-color="red"
        @left="
          (e) => {
            e.reset()
            删除卡组(卡组)
          }
        "
        @right="
          (e) => {
            e.reset()
            匹配对手(卡组)
          }
        "
      >
        <template v-slot:left>
          <img
            style="height: 50vh"
            src="~assets/assetbundle/texture/Background_PVE.webp"
          />
        </template>
        <template v-slot:right>
          <img
            style="height: 50vh"
            src="~assets/assetbundle/texture/Background_Rank.webp"
          />
        </template>
        <q-item clickable v-ripple @click="复刻卡组(卡组)">
          <div>
            <div class="text-h4 text-center">{{ 卡组.卡组名 }}</div>
            <img
              draggable="false"
              style="width: 50%"
              :title="获得主神信息(卡组.主神).卡牌名称"
              :src="`maincard/CharacterHeadM_${
                获得主神信息(卡组.主神).美术资源
              }.webp`"
            />
            <img
              v-for="(编号, i) in 卡组.附属神"
              :key="i"
              draggable="false"
              :style="`width: ${50 / 卡组.附属神.length}%; aspect-ratio: 1`"
              :title="获得附属神信息(编号).卡牌名称"
              :src="`character/CharacterHeadL_${
                获得附属神信息(编号).美术资源
              }.webp`"
            />
          </div>
        </q-item>
      </q-slide-item>
    </template>
  </q-list>
  <q-dialog v-model="卡组弹窗">
    <q-card class="bg-dark" style="min-width: 500px">
      <q-form @submit="创建卡组()" @reset="卡组.重置()">
        <q-card-section>
          <div class="text-h6">创建卡组</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="卡组.卡组名.value"
            label="卡组名称"
            :rules="[(val) => !!val || '卡组名称不能为空']"
          />
          <q-select
            v-model="卡组.主神.value"
            :options="主神列表"
            label="主神"
            :option-label="
              (主神) => `${主神.卡牌名称}${主神.主神技能}：${主神.技能名称}`
            "
            map-options
            :rules="[(val) => !!val || '主神不能为空']"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <img
                    height="80px"
                    :src="`character/CharacterHeadL_${scope.opt.美术资源}.webp`"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    >{{ scope.opt.卡牌名称 }}
                    {{ scope.opt.主神技能 }}</q-item-label
                  >
                  <q-item-label
                    >{{ scope.opt.技能名称 }}：{{
                      scope.opt.技能描述
                    }}</q-item-label
                  >
                  <q-item-label caption
                    >消耗：{{ scope.opt.技能消耗 }}；回合最大使用次数：{{
                      scope.opt.回合最大使用次数
                    }}；单场最大使用次数：{{
                      scope.opt.单场最大使用次数
                    }}</q-item-label
                  >
                  <q-item-label caption
                    >被动：{{ scope.opt.被动技能名称 }}：{{
                      scope.opt.被动技能描述
                    }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select
            v-model="卡组.附属神.value"
            multiple
            :options="可选附属神列表"
            label="附属神"
            option-label="卡牌名称"
            option-value="编号"
            emit-value
            map-options
            use-input
            input-debounce="0"
            @filter="
              (val, update) => {
                update(() => {
                  可选附属神列表 = val
                    ? 附属神列表.filter(
                        (v) =>
                          v.卡牌名称.indexOf(val) > -1 ||
                          v.描述.indexOf(val) > -1
                      )
                    : 附属神列表
                  可选附属神列表 = 可选附属神列表.sort(
                    (a, b) => a.品质 - b.品质
                  )
                })
              }
            "
            :rules="[(val) => val.length == 2 || '附属神数量必须为2']"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <img
                    height="80px"
                    :src="`character/CharacterHeadL_${scope.opt.美术资源}.webp`"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.卡牌名称 }}</q-item-label>
                  <q-item-label caption
                    >生命值：{{ scope.opt.生命值 }}；攻击力：{{
                      scope.opt.攻击力
                    }}；移动力：{{ scope.opt.移动力 }}</q-item-label
                  >
                  <q-item-label caption>{{ scope.opt.描述 }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select
            v-model="卡组.神迹卡.value"
            multiple
            :options="可选神迹卡列表"
            label="神迹卡"
            option-label="卡牌名称"
            map-options
            use-input
            counter
            input-debounce="0"
            @filter="
              (val, update) => {
                update(() => {
                  更新可选神迹卡列表(
                    val
                      ? 神迹卡列表.filter(
                          (v) =>
                            v.卡牌名称.indexOf(val) > -1 ||
                            v.描述.indexOf(val) > -1
                        )
                      : 神迹卡列表
                  )
                })
              }
            "
            reactive-rules
            :rules="[
              () =>
                卡组.神迹卡.value.length + 卡组.弹幕卡.value.length == 20 ||
                '神迹卡+弹幕卡总数必须为20',
            ]"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <img
                    height="80px"
                    :src="`card/CardL_${scope.opt.美术资源}.webp`"
                  />
                </q-item-section>
                <q-item-label>
                  <q-item-label>{{ scope.opt.卡牌名称 }}</q-item-label>
                  <q-item-label caption
                    >品质：{{
                      { 1: '传说', 2: '稀有', 3: '普通' }[
                        scope.opt.品质 as number
                      ]
                    }}</q-item-label
                  >
                  <q-item-label caption
                    >消耗：{{ 获得技能信息(scope.opt.技能).消耗 }}</q-item-label
                  >
                  <q-item-label caption>{{ scope.opt.描述 }}</q-item-label>
                </q-item-label>
              </q-item>
            </template>
          </q-select>
          <q-select
            v-model="卡组.弹幕卡.value"
            multiple
            :options="可选弹幕卡列表"
            label="弹幕卡"
            option-label="卡牌名称"
            map-options
            use-input
            counter
            input-debounce="0"
            @filter="
              (val, update) => {
                update(() => {
                  更新可选弹幕卡列表(
                    val
                      ? 弹幕卡列表.filter(
                          (v) =>
                            v.卡牌名称.indexOf(val) > -1 ||
                            v.描述.indexOf(val) > -1 ||
                            `${v.消耗}${v.攻击力}${v.吟唱时间}`.indexOf(val) >
                              -1
                        )
                      : 弹幕卡列表
                  )
                })
              }
            "
            reactive-rules
            :rules="[
              () =>
                卡组.神迹卡.value.length + 卡组.弹幕卡.value.length == 20 ||
                '神迹卡+弹幕卡总数必须为20',
            ]"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <img
                    height="80px"
                    :src="`card/CardL_${scope.opt.美术资源}.webp`"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.卡牌名称 }}</q-item-label>
                  <q-item-label caption
                    >品质：{{
                      { 1: '传说', 2: '稀有', 3: '普通' }[
                        scope.opt.品质 as number
                      ]
                    }}</q-item-label
                  >
                  <q-item-label caption
                    >消耗：{{ scope.opt.消耗 }}；攻击力：{{
                      scope.opt.攻击力
                    }}；吟唱时间：{{ scope.opt.吟唱时间 }}</q-item-label
                  >
                  <q-item-label caption>{{ scope.opt.描述 }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions>
          <q-btn
            label="重置"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
          <q-space />
          <q-btn
            v-if="卡组.卡组"
            label="复制卡组码"
            @click="复制卡组码(卡组.卡组)"
          />
          <q-btn v-else label="粘贴卡组码" @click="粘贴卡组码()" />
          <q-space />
          <q-btn
            label="保存"
            type="submit"
            color="primary"
            :disable="!卡组.卡组"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import _ from 'lodash'
import { copyToClipboard, useQuasar } from 'quasar'
import {
  主神信息列表,
  弹幕卡信息列表,
  神迹卡信息列表,
  获得主神信息,
  获得技能信息,
  获得附属神信息,
  附属神信息列表,
} from 'src/utils/信息'
import {
  字符串转编号卡组,
  编号卡组类型,
  编号卡组转字符串,
} from 'src/utils/卡组'
import { 播放场景背景音乐 } from 'src/utils/播放音频'
import { 暗色模式 } from 'src/utils/暗色模式'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const q = useQuasar()

const 编号卡组列表 = ref<编号卡组类型[]>([])

const router = useRouter()
onMounted(() => {
  播放场景背景音乐('main/BGM_day.mp3')
})
暗色模式()

async function 匹配对手(卡组: 编号卡组类型) {
  router.push({
    name: 'battle',
    query: {
      卡组: 编号卡组转字符串(卡组),
    },
  })
}

const 主神列表 = 主神信息列表
  .filter((x) => x.仅系统用 == 0)
  .reduce(
    (pv, v) => {
      const 主神信息 = 获得主神信息(v.编号)
      const 技能信息 = [
        获得技能信息(主神信息.技能1),
        获得技能信息(主神信息.技能2),
        获得技能信息(主神信息.技能3),
      ]
      技能信息.forEach((x, i) => {
        const 被动技能 = 获得技能信息(
          typeof x.附带技能 === 'string'
            ? parseInt(x.附带技能.split(',').at(-1)!)
            : x.附带技能
        )
        pv.push({
          主神: v.编号,
          卡牌名称: v.卡牌名称,
          美术资源: v.美术资源,
          主神技能: (i + 1) as 1 | 2 | 3,
          技能名称: x.技能名称,
          技能描述: x.技能描述,
          技能消耗: x.消耗,
          回合最大使用次数: x.回合最大使用次数,
          单场最大使用次数: x.单场最大使用次数,
          被动技能名称: 被动技能.技能名称,
          被动技能描述: 被动技能.技能描述,
        })
      })
      return pv
    },
    [] as {
      主神: number
      卡牌名称: string
      美术资源: number
      主神技能: 1 | 2 | 3
      技能名称: string
      技能描述: string
      技能消耗: number
      回合最大使用次数: number
      单场最大使用次数: number
      被动技能名称: string
      被动技能描述: string
    }[]
  )
const 附属神列表 = 附属神信息列表.filter((x) => x.仅系统用 == 0)
const 神迹卡列表 = 神迹卡信息列表.filter((x) => x.仅系统用 == 0)
const 弹幕卡列表 = 弹幕卡信息列表.filter((x) => x.仅系统用 == 0)
const 可选附属神列表 = ref(附属神列表)
const 可选神迹卡列表 = ref<typeof 神迹卡列表>([])
const 可选弹幕卡列表 = ref<typeof 弹幕卡列表>([])
function 更新可选神迹卡列表(_神迹卡列表: typeof 神迹卡列表) {
  可选神迹卡列表.value = _神迹卡列表
    .concat(
      _神迹卡列表
        .filter((x) => x.品质 > 1)
        .map((x) => ({
          ...x,
          卡牌名称: x.卡牌名称 + ' 2',
        }))
    )
    .sort((a, b) => a.排序编号 - b.排序编号)
    .sort((a, b) => a.品质 - b.品质)
}
更新可选神迹卡列表(神迹卡列表)
function 更新可选弹幕卡列表(_弹幕卡列表: typeof 弹幕卡列表) {
  可选弹幕卡列表.value = _弹幕卡列表
    .concat(
      _弹幕卡列表
        .filter((x) => x.品质 > 1)
        .map((x) => ({
          ...x,
          卡牌名称: x.卡牌名称 + ' 2',
        }))
    )
    .sort((a, b) => a.排序编号 - b.排序编号)
    .sort((a, b) => a.品质 - b.品质)
}
更新可选弹幕卡列表(弹幕卡列表)

const 卡组弹窗 = ref(false)

class 卡组选择类 {
  卡组名 = ref('')
  主神 = ref<(typeof 主神列表)[0]>()
  附属神 = ref<number[]>([])
  神迹卡 = ref<typeof 神迹卡列表>([])
  弹幕卡 = ref<typeof 弹幕卡列表>([])
  get 卡组() {
    if (
      this.主神.value &&
      this.附属神.value.length == 2 &&
      this.神迹卡.value.length + this.弹幕卡.value.length == 20
    ) {
      return {
        卡组名: this.卡组名.value,
        主神: this.主神.value.主神,
        主神技能: this.主神.value.主神技能,
        附属神: this.附属神.value,
        神迹卡: this.神迹卡.value.map((x) => x.编号),
        弹幕卡: this.弹幕卡.value.map((x) => x.编号),
      }
    }
  }
  重置() {
    this.卡组名.value = ''
    this.主神.value = undefined
    this.附属神.value = []
    this.神迹卡.value = []
    this.弹幕卡.value = []
  }
}
const 卡组 = new 卡组选择类()

function 保存卡组() {
  localStorage.setItem('卡组列表', JSON.stringify(编号卡组列表.value))
}
function 读取卡组() {
  const _卡组列表 = localStorage.getItem('卡组列表')
  if (_卡组列表) {
    编号卡组列表.value = JSON.parse(_卡组列表)
  }
}
读取卡组()

function 创建卡组() {
  if (卡组.卡组) {
    编号卡组列表.value.push(卡组.卡组)
    保存卡组()
    卡组.重置()
    卡组弹窗.value = false
  }
}
function 删除卡组(_卡组: 编号卡组类型) {
  if (confirm('确定删除卡组？')) {
    _.remove(编号卡组列表.value, (x) => _.eq(x, _卡组))
    保存卡组()
  }
}
function 复刻卡组(_卡组: 编号卡组类型) {
  卡组.卡组名.value = _卡组.卡组名
  卡组.主神.value = 主神列表.find(
    (x) => x.主神 == _卡组.主神 && x.主神技能 == _卡组.主神技能
  )
  卡组.附属神.value = _卡组.附属神
  卡组.神迹卡.value = []
  _卡组.神迹卡.forEach((x) => {
    const 神迹卡 = 可选神迹卡列表.value.find(
      (y) => y.编号 == x && !卡组.神迹卡.value.includes(y)
    )
    if (神迹卡) {
      卡组.神迹卡.value.push(神迹卡)
    }
  })
  卡组.弹幕卡.value = []
  _卡组.弹幕卡.forEach((x) => {
    const 弹幕卡 = 可选弹幕卡列表.value.find(
      (y) => y.编号 == x && !卡组.弹幕卡.value.includes(y)
    )
    if (弹幕卡) {
      卡组.弹幕卡.value.push(弹幕卡)
    }
  })
  卡组弹窗.value = true
}
function 复制卡组码(_卡组: 编号卡组类型) {
  copyToClipboard(编号卡组转字符串(_卡组))
    .then(() => q.notify({ type: 'positive', message: '复制成功' }))
    .catch((reason) => {
      q.notify({ type: 'negative', message: '复制失败：' + reason })
    })
}
function 粘贴卡组码() {
  navigator.clipboard
    .readText()
    .then((text) => {
      try {
        复刻卡组(字符串转编号卡组(text))
        q.notify({ type: 'positive', message: '粘贴成功' })
      } catch (e) {
        q.notify({ type: 'negative', message: '格式错误：' + e })
      }
    })
    .catch((reason) => {
      q.notify({ type: 'negative', message: '粘贴失败：' + reason })
    })
}
</script>
