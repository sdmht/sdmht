import { useSubscription } from '@vue/apollo-composable'
import { uid } from 'quasar'
import { gql } from 'src/gen'
import { ref } from 'vue'

const 我方编号 = uid()
const 在线人数 = ref()
function 开始心跳() {
  useSubscription(
    gql(`
      subscription heartbeat($uid: String!) {
        heartbeat(uid: $uid)
      }
    `),
    { uid: 我方编号 },
  )
}
function 订阅在线人数() {
  useSubscription(
    gql(`
      subscription onlineCount {
        onlineCount
      }
    `),
  ).onResult((res) => {
    在线人数.value = res.data?.onlineCount ?? 0
  })
}
export { 在线人数, 开始心跳, 我方编号, 订阅在线人数 }
