import { useSubscription, UseSubscriptionReturn } from '@vue/apollo-composable'
import { uid } from 'quasar'
import { graphql } from 'src/gen'
import { HeartbeatSubscription } from 'src/gen/graphql'
import { ref } from 'vue'

const 我方编号 = uid()
let 心跳:
  | UseSubscriptionReturn<HeartbeatSubscription, { uid: string }>
  | undefined = undefined
const 在线人数 = ref()
function 开始心跳() {
  if (!心跳) {
    心跳 = useSubscription(
      graphql(`
        subscription heartbeat($uid: String!) {
          heartbeat(uid: $uid)
        }
      `),
      { uid: 我方编号 }
    )
    心跳.onError(() => {
      setTimeout(() => {
        心跳?.restart()
      }, 1000)
    })
  }
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
