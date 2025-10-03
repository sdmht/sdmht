// ==UserScript==
// @name         Construct 3 解除客户端限制
// @namespace    star2000
// @version      1.4
// @description  模拟个人专业版许可证，以解除客户端里无需后端支持的部分功能限制，比如事件数、效果数、层数、字体数
// @author       star2000
// @match        https://account.construct.net/*
// @run-at       document-start
// @icon         https://editor.construct.net/media/icon-512.png
// @grant        none
// @license      AGPL-3.0-or-later
// ==/UserScript==
'use strict'

if (!location.href.includes('account.construct.net')) return

function uN(t) {
  return t.map((t) => String.fromCharCode(t)).join('')
}
function K9(t) {
  return 'string' == typeof t
}
function zt(t) {
  if (!K9(t)) throw new TypeError('expected string')
}
function vei(t) {
  return zt(t), new TextEncoder('utf-8').encode(t).buffer
}
Crypto = {}
const ya = '00'
Crypto.Kni = function (t) {
  let i = ''
  const e = new DataView(t)
  for (let t = 0; t < e.byteLength; ++t) {
    const s = e.getUint8(t).toString(16)
    i += (ya + s).slice(-ya.length)
  }
  return i
}
Crypto.qni = function (t) {
  return 'string' == typeof t && (t = vei(t)), Crypto.Xni(t)
}
Crypto.Xni = function (t) {
  return window.isSecureContext
    ? crypto.subtle.digest('SHA-256', t).then(Crypto.Kni)
    : Promise.reject(new Error('web crypto only available on secure origins'))
}

async function genLicense() {
  const license = {}
  license.type = 'personal'
  license.scriptingEnabled = true
  license.verificationDate = new Date().toISOString()

  const e = license.verificationDate.toUpperCase().trim(),
    s = license.type.toUpperCase().trim(),
    n = Date.parse(e),
    r = Date.now(),
    h = Math.floor(3024e5)
  if (n < r - h || n > r + h) return !1
  let o = uN([
      97, 118, 88, 84, 82, 51, 66, 77, 55, 75, 112, 117, 88, 66, 51, 115,
    ]),
    a = uN([
      99, 74, 70, 74, 101, 72, 119, 68, 89, 72, 108, 55, 108, 112, 77, 103,
    ])
  s.length > 4 && (o += [...e].reduce((t, i) => t + ('5' === i ? 1 : 0), 0)),
    [...e].reduce((t, i) => t + ('0' === i ? 1 : 0), 0) > 6 &&
      ((a += o.substring(0, 3)), (o = '_' + o))
  let l = 0
  for (const t of e) {
    const i = Number(t)
    isFinite(i) && (l += i)
  }
  l % 3 == 0 && (a = a.substring(0, 5))
  const u = (o + 'A' + e + 'A' + s + 'Α' + a).normalize(),
    c = await Crypto.qni(u)
  license.verificationHash = c.toLowerCase()
  return license
}

let isLogin = false
const originalFetch = window.fetch
window.fetch = async function (url, options) {
  if (url === 'login.json') {
    isLogin = true
  }
  if (url === 'token.json') {
    if (isLogin) {
      const response = await originalFetch(url, options)
      const cj = await response.clone().json()
      if (!cj.response.license || !cj.response.user) {
        return response
      }
      cj.response.license = await genLicense()
      return new Response(JSON.stringify(cj), {
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
    } else {
      return new Response(
        JSON.stringify({
          request: {
            status: 'ok',
          },
          response: {
            user: {
              id: 1,
              username: 'poor only',
              highResAvatar: {
                url: '/favicon.ico',
              },
            },
            license: await genLicense(),
            productType: 'Construct 3',
          },
        }),
        {
          status: 200,
          statusText: 'OK',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }
      )
    }
  }
  return await originalFetch(url, options)
}

window.addEventListener('DOMContentLoaded', async function () {
  const d = await localforage.getItem('login-data')
  if (d) {
    isLogin = true
  } else {
    await localforage.setItem('login-data', {
      userID: 1,
      token: crypto.randomUUID(),
    })
  }
})
