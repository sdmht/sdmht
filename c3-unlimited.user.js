// ==UserScript==
// @name         Construct 3 解除客户端限制
// @namespace    star2000
// @version      2.0
// @description  模拟个人专业版许可证，以解除客户端里无需后端支持的部分功能限制，比如事件数、效果数、层数、字体数
// @author       star2000
// @match        https://editor.construct.net/*
// @run-at       document-start
// @icon         https://editor.construct.net/media/icon-512.png
// @grant        none
// @license      AGPL-3.0-or-later
// ==/UserScript==
'use strict'

if (!location.href.includes('editor.construct.net')) return

function randomInt(t) {
  return Math.floor(Math.random() * t)
}

function EOe(t) {
  return new TextEncoder('utf-8').encode(t).buffer
}
const ma = '0123456789abcdef'
function xFe(t) {
  let i = ''
  const e = new Uint8Array(t)
  for (let t = 0; t < e.length; ++t) {
    const s = e[t],
      n = 15 & s
    i += ma[s >> 4] + ma[n]
  }
  return i
}
function dAs(t) {
  return window.isSecureContext
    ? crypto.subtle.digest('SHA-256', t).then(xFe)
    : Promise.reject(new Error('web crypto only available on secure origins'))
}
function los(t) {
  return 'string' == typeof t && (t = EOe(t)), dAs(t)
}

const weekMS = 7 * 24 * 60 * 60 * 1000,
  WN = Infinity,
  HN = Infinity,
  KN = Infinity,
  VN = Infinity,
  license = 'personal',
  release = 46200

async function generateLoginRecord(userName, userId) {
  const e = randomInt(86400),
    s = randomInt(weekMS),
    n = 22,
    r = randomInt(1e8),
    h = randomInt(365)
  const now = Date.now()
  let expirationTime = now + weekMS
  let l = WN * HN * KN
  isFinite(l) || (l = '.')
  let u = VN
  isFinite(u) || (u = '.')
  const c =
      '.' +
      (r + userId) +
      userName +
      l +
      [...(h + release).toString()].reverse().join('') +
      '.' +
      u +
      s +
      license +
      n +
      Math.floor(now / 14 + expirationTime / 14 - s) +
      '97111',
    d = await los(c)
  return [
    h,
    WN,
    s,
    userName,
    e,
    HN,
    now,
    userId,
    n,
    license,
    r,
    expirationTime,
    VN,
    release,
    KN,
    d,
  ]
}
window.addEventListener('DOMContentLoaded', async () => {
  while (!window.localforage) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  await localforage.setItem('.', await generateLoginRecord('poor only', 1))
})
