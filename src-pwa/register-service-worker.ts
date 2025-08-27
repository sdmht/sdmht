// import { useMutation } from '@vue/apollo-composable'
// import gql from 'graphql-tag'
import { register } from 'register-service-worker'

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready(/*registration*/) {
    // if (Notification.permission === 'granted') {
    //   registration.pushManager.getSubscription().then(async (subscription) => {
    //     if (!subscription) {
    //       subscription = await registration.pushManager.subscribe({
    //         userVisibleOnly: true,
    //         applicationServerKey: process.env.VAPID_PUBLIC_KEY,
    //       })
    //     }
    //     const ps = JSON.parse(JSON.stringify(subscription))
    //     useMutation(
    //       gql`mutation addSubscription($ps: PushSubscription!){ addSubscription($ps) }`,
    //       { variables: { ps } }
    //     )
    //   })
    // }
    // console.log('Service worker is active.')
  },

  registered(/* registration */) {
    // console.log('Service worker has been registered.')
  },

  cached(/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  updatefound(/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  updated(/* registration */) {
    // console.log('New content is available; please refresh.')
  },

  offline() {
    // console.log('No internet connection found. App is running in offline mode.')
  },

  error(/* err */) {
    // console.error('Error during service worker registration:', err)
  },
})
