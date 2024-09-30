import { useQuasar } from 'quasar'
import { onMounted, onUnmounted } from 'vue'

function 暗色模式() {
  const q = useQuasar()
  onMounted(() => {
    q.dark.set(true)
  })
  onUnmounted(() => {
    q.dark.set(false)
  })
}
export { 暗色模式 }
