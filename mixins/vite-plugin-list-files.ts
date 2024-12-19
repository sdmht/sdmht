import fs from 'fs'
import { globSync } from 'glob'
import path from 'path'
import type { Plugin } from 'vite'

function 生成文件列表(): Plugin {
  return {
    name: '生成文件列表',
    apply: 'build',
    buildStart() {
      const 静态文件目录 = path.resolve(__dirname, '../public')
      const 文件列表 = globSync(`${静态文件目录}/**/*`)
        .filter((file) => fs.statSync(file).isFile())
        .map((file) => file.replace(/\\/g, '/').replace('public/', ''))

      fs.writeFileSync(
        path.join(__dirname, '../src/assets/文件列表.json'),
        JSON.stringify(文件列表, null, 2) + '\n',
      )
      console.log('文件列表已生成')
    },
  }
}
export default 生成文件列表
