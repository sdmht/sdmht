import { useSubscription } from '@vue/apollo-composable'
import { uid } from 'quasar'
import { graphql } from 'src/gen'
import { ref } from 'vue'

const 我方编号 = uid()
const 在线人数 = ref()
function 开始心跳() {
  useSubscription(
    graphql(`
      subscription heartbeat($uid: String!) {
        heartbeat(uid: $uid)
      }
    `),
    { uid: 我方编号 }
  )
}
function 订阅在线人数() {
  useSubscription(
    graphql(`
      subscription onlineCount {
        onlineCount
      }
    `)
  ).onResult((res) => {
    在线人数.value = res.data?.onlineCount ?? 0
  })
}
export { 在线人数, 开始心跳, 我方编号, 订阅在线人数 }
