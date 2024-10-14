/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js

/* eslint-disable @typescript-eslint/no-var-requires */

const { configure } = require('quasar/wrappers')

module.exports = configure(function (ctx) {
  return {
    // https://v2.quasar.dev/quasar-cli-webpack/supporting-ts
    supportTS: {
      tsCheckerConfig: {
        eslint: {
          enabled: true,
          files: './src/**/*.{ts,tsx,js,jsx,vue}',
        },
      },
    },

    // https://v2.quasar.dev/quasar-cli-webpack/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-webpack/boot-files
    boot: [],

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-css
    css: ['app.css'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v7',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-build
    build: {
      vueRouterMode: 'hash', // available values: 'hash', 'history'

      // transpile: false,
      // publicPath: '/',

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      env: require('dotenv').config().parsed,

      // https://v2.quasar.dev/quasar-cli-webpack/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpack(chain) {
        const VueAutoRoutingPlugin = require('vue-auto-routing/lib/webpack-plugin')
        chain.plugin('vue-auto-routing').use(
          new VueAutoRoutingPlugin({
            pages: 'src/pages',
            importPrefix: 'pages/',
            outFile: 'src/router/routes.ts',
          })
        )
        chain.module
          .rule('csv')
          .test(/\.csv$/)
          .use('csv-loader')
          .loader('csv-loader')
          .options({
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
          })
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-devServer
    devServer: {
      server: {
        type: 'http',
      },
      port: 8080,
      open: true, // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-framework
    framework: {
      config: {
        notify: {
          position: 'top',
        },
      },

      // iconSet: 'material-icons', // Quasar icon set
      lang: 'zh-CN', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ['Notify', 'Dialog'],
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-webpack/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      maxAge: 1000 * 60 * 60 * 24 * 30,
      // Tell browser when a file from the server should expire from cache (in ms)

      // chainWebpackWebserver (/* chain */) {},

      middlewares: [
        ctx.prod ? 'compression' : '',
        'render', // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli-webpack/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'

      /** @type {import('workbox-build').WebpackGenerateSWOptions} */
      workboxOptions: {
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 2 ** 30,
        include: [
          'index.html',
          'prebattle/布阵_01.mp3',
          'prebattle/放下神明.mp3',
          'prebattle/抓起神明.mp3',
          'prefab/pvp/角色移动.mp3',
          'prefab/pvp/胜利_01.mp3',
          'prefab/pvp/失败_01.mp3',
          'prefab/pvp/我方回复，点选人物.mp3',
          'prefab/pvp/我方回合，行动开始.mp3',
          'prefab/pvp/storing.mp3',
          'pvp/倒计时--结束.webp',
          'pvp/倒计时--潜行.webp',
          'pvp/attack 1.webp',
          'pvp/di.webp',
          'pvp/field/FlashLine.webp',
          'pvp/field/shengdun.webp',
          'pvp/gongji.webp',
          'pvp/icon xiaohao red.webp',
          'pvp/icon xiaohao.webp',
          'pvp/jieshu.webp',
          'pvp/kazu.webp',
          'pvp/qiyuan.webp',
          'pvp/shenwei.webp',
          'pvp/shoupai.webp',
          'pvp/xia.webp',
          /^(css|js|background|bgm|flash|loading|spine)\//,
          /^character\/.+\.mp3$/,
          /^character\/CharacterHeadL_.+\.webp$/,
          /^maincard\/CharacterHeadM_.+\.webp$/,
          /^prefab\/pvp\/打击\d+\.mp3$/,
          /^prefab\/pvp\/effect\d+\.mp3$/,
        ],
        navigateFallbackDenylist: [/\.webm$/, /^\/(admin|api|static|media)\//],
        runtimeCaching: [
          {
            urlPattern: /.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxAgeSeconds: 365 * 24 * 60 * 60,
                maxEntries: 1000000,
              },
            },
          },
        ],
      },

      // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
      // if using workbox in InjectManifest mode
      // chainWebpackCustomSW (/* chain */) {},

      manifest: {
        name: '神代梦华谭',
        short_name: '神代梦华谭',
        description: '区区关服拦不住我重写一个',
        display: 'standalone',
        orientation: 'landscape',
        background_color: '#000000',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'builder', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        asar: false,
        appId: 'sdmht',
        npmRebuild: false,
        win: {
          target: ['nsis'],
        },
        appx: {
          applicationId: 'sdmht',
          identityName: '',
          publisher: 'CN=DAEDB467-37AD-45E0-ABC2-F8D31A662066',
          languages: 'zh-CN',
        },
        publish: {
          provider: 'generic',
          url: 'https://sdmhtexe.star2000.work/',
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          allowToChangeInstallationDirectory: true,
        },
        electronLanguages: ['zh-CN'],
        files: [],
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackMain(/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackMain also available besides this chainWebpackMain
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackPreload(/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackPreload also available besides this chainWebpackPreload
      },
    },
  }
})
