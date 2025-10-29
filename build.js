'use strict'

const playwright = require('playwright')
const { readdirpPromise: readdirp } = require('readdirp')
const fs = require('fs/promises')
const unzipper = require('unzipper')

;(async () => {
  const browser = await playwright.chromium.launch()
  const page = await browser.newPage()
  page.setDefaultTimeout(0)

  await page.addInitScript({
    path: './c3-unlimited.user.js',
  })

  await page.goto('https://editor.construct.net/beta')
  await page.locator('#welcomeTourDialog .noThanksLink').click()

  // 接收文件
  const fileReceiver = await page.evaluateHandle(async () => {
    const handle = await navigator.storage.getDirectory()
    const projectFolder = await handle.getDirectoryHandle(
      'open-project-folder',
      { create: true }
    )
    return async ([path, content]) => {
      let dir = projectFolder
      const dirs = path.split('/')
      const fileName = dirs.pop()
      for (const _dir of dirs) {
        dir = await dir.getDirectoryHandle(_dir, { create: true })
      }
      const fileHandle = await dir.getFileHandle(fileName, {
        create: true,
      })
      const file = await fileHandle.createWritable()
      await file.write(content)
      await file.close()
    }
  })
  // 导入文件
  async function importFile(file) {
    const content = new Uint8Array(await fs.readFile(file.fullPath))
    const path = file.path.replace(/\\/g, '/')

    console.log('导入文件', path)
    await fileReceiver.evaluate(
      async (fn, arg) => await fn(arg),
      [path, content]
    )
  }
  const files = await readdirp('./src', {
    type: 'files',
    directoryFilter: (f) => f.basename != 'ts-defs',
    fileFilter: (f) => !/\.uistate\.json$/.test(f.basename),
  })
  await Promise.all(files.map(importFile))

  await page.evaluate(async () => {
    window.showDirectoryPicker = async ({ id }) => {
      const handle = await navigator.storage.getDirectory()
      return await handle.getDirectoryHandle(id)
    }
  })

  console.log('打开项目')
  await page.locator('#buttonOpen').click()
  await page.locator('#spMenuButtonOpen .fromFolder').click()
  ;(async () => {
    while (true) {
      try {
        await page.locator('#addonConfirmInstallDialog .okButton').click()
      } catch {
        break
      }
    }
  })()
  ;(async () => {
    while (true) {
      try {
        await page.locator('#deprecatedFeaturesDialog .okButton').click()
      } catch {
        break
      }
    }
  })()

  await page.locator('#propertiesBar:not([hide])').waitFor()
  await page.waitForTimeout(3000)
  await page.keyboard.press('F6')
  await page.locator("span:has-text('Web (HTML5)')").click()
  await page.locator('.nextButton').click()
  await page.locator('#exportStandardOptionsDialog .nextButton').click()
  console.log('导出项目')
  await page.locator('#webExportReportDialog').waitFor()

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('.downloadExportedProject').click(),
  ])
  const downloadFile = await download.path()
  const zipFile = await unzipper.Open.file(downloadFile)
  await fs.rm('./dist', { recursive: true, force: true })
  await zipFile.extract({ path: './dist' })
  await browser.close()
  console.log('完成')
})()
