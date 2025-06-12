# 神代梦华谭

## 介绍

区区关服拦不住我重写一个！

## 如何游玩

任意设备使用可安装渐进式 Web 应用的浏览器（比如 Edge 或 Chrome）访问并安装 https://sdmht.star2000.work 。然后回到桌面打开神代梦华谭

## 议题悬赏流程
- QQ群：[102804509](https://qm.qq.com/q/PWZyQvtFOU)
- 收集表：https://docs.qq.com/form/page/DZGVYVmx4Z0JIamxs
- 出价表：https://docs.qq.com/sheet/DZFh6a2VDUEtKYVBG
1. 任何人可以编辑收集表，复制选项并修改作为新议题
2. 任何人可以填写收集表，以此给议题悬赏加价，总悬赏金额查看出价表
3. 开发者完成议题时，根据当前出价表创建群收款，并删除收集表中的此议题，然后通知出价者们测试，测出问题要通知开发者改，7天内未测出问题就付账
- 主分支部署地址：https://sdmht.star2000.work/
- 开发分支部署地址：https://sdmht-dev.star2000.work/

## 如何开发

### 安装开发环境

Windows 系统，按`Win+E`打开文件管理器，找个放项目的父文件夹，鼠标移动到文件夹内的空白处，按住`Shift`键的同时右击鼠标，选择`在此处打开 PowerShell 窗口`，然后点下面代码框右上角的复制按钮（鼠标悬浮才显示），接着回到刚才打开的 PowerShell 窗口粘贴，最后按 Enter，等待安装完成。

```sh
Set-ExecutionPolicy rem -s c;iwr -useb https://ghfast.top/https://raw.githubusercontent.com/star2000/scoop/master/install.ps1 | iex
scoop install trae-cn git nodejs-lts yarn
git clone https://ghfast.top/https://github.com/sdmht/sdmht.git
cd sdmht
yarn
trae .
```

以上脚本执行完后会打开 Trae，过完引导后按 F5 启动开发预览，会自动打开浏览器访问，然后你就可以对着浏览器看效果，命令 AI 写代码了。

## 项目结构

- [`src/pages`](src/pages/)：页面，其中[`index.vue`](src/pages/index.vue)是首页，[`card_deck.vue`](src/pages/card_deck.vue)是卡组搭配，[`battle.vue`](src/pages/battle.vue)是对战页面
- [`src/utils`](src/utils/)：工具函数
- [`public`](public/)：参与打包的静态资源文件
- [`src/assets`](src/assets/)：其余的资源文件
- [`src/assets/data`](src/assets/data/)：游戏数据文件（角色、技能、剧情等各种文本以及数值）
- [`mixins/check-skill.yaml`](mixins/check-skill.yaml)：根据技能数据猜测生成的技能效果，用于校验技能效果是否正确

## 框架文档

[Quasar 框架 配置文档 quasar.config.js](https://quasar.dev/quasar-cli-webpack/quasar-config-file/).
[Phaser 框架 文档](https://docs.phaser.io)
