import { app, BrowserWindow, Menu } from 'electron'
import { autoUpdater } from 'electron-updater'
import os from 'os'
import path from 'path'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

let mainWindow: BrowserWindow | undefined

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  })

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined
  })
}

app.commandLine.appendSwitch('force_high_performance_gpu')
Menu.setApplicationMenu(null)
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow()
  }
})

function regularlyCheckUpdate() {
  if (!app.getAppPath().includes('WindowsApps')) {
    autoUpdater.checkForUpdates()
    setInterval(() => {
      if (!autoUpdater.isUpdaterActive()) {
        autoUpdater.checkForUpdates()
      }
    }, 60000)
  }
}
app.once('ready', regularlyCheckUpdate)
autoUpdater.on('update-available', (info) => {
  mainWindow?.setTitle(`开始更新到 ${info.version}`)
})
autoUpdater.on('download-progress', (progressObj) => {
  mainWindow?.setTitle(`正在下载更新 ${progressObj.percent}%`)
})
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall(true, true)
})
