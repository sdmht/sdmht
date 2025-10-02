const playwright = require('playwright')
const readdirp = require('readdirp').readdirpPromise
const fs = require('fs/promises')
const unzipper = require('unzipper')

;(async () => {
  const browser = await playwright.chromium.launch()
  const page = await browser.newPage()

  await page.goto('https://editor.construct.net/')
  await (await page.waitForSelector('#welcomeTourDialog .noThanksLink')).click()

  // 接收文件
  const syncFunctionHandle = await page.evaluateHandle(async () => {
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
  for (const file of await readdirp('.', {
    type: 'files',
    directoryFilter: (f) =>
      ![
        '.git',
        '.github',
        'node_modules',
        'ts-defs',
        'dist',
        'mixins',
        'assets',
      ].includes(f.basename),
    fileFilter: (f) =>
      ![/^\./, /\.uistate\.json$/].some((v) => v.test(f.basename)) &&
      ![
        'build.js',
        'package.json',
        'yarn.lock',
        'tsconfig.json',
        'README.md',
        'LICENSE',
      ].includes(f.basename),
  })) {
    const path = file.path.replace(/\\/g, '/')
    const content = new Uint8Array(await fs.readFile(path))

    console.log('导入文件', path)
    await syncFunctionHandle.evaluate(
      async (fn, arg) => await fn(arg),
      [path, content]
    )
  }
  await page.evaluate(async () => {
    window.showDirectoryPicker = async ({ id }) => {
      const handle = await navigator.storage.getDirectory()
      return await handle.getDirectoryHandle(id)
    }
  })

  console.log('打开项目')
  await (await page.waitForSelector('#buttonOpen')).click()
  await (await page.waitForSelector('#spMenuButtonOpen .fromFolder')).click()
  await page.waitForSelector('#propertiesBar:not([hide])')
  await page.waitForTimeout(3000)
  await page.keyboard.press('F6')
  await (await page.waitForSelector("span:has-text('Web (HTML5)')")).click()
  await page.click('.nextButton')
  await (
    await page.waitForSelector('#exportStandardOptionsDialog .nextButton')
  ).click()
  console.log('导出项目')
  await page.waitForSelector('#webExportReportDialog')

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('.downloadExportedProject'),
  ])
  const downloadFile = await download.path()
  const zipFile = await unzipper.Open.file(downloadFile)
  await zipFile.extract({ path: './dist' })
  await browser.close()
  console.log('完成')
})()
