// ==UserScript==
// @name         Construct 3 解除客户端限制
// @namespace    star2000
// @version      2.1
// @description  模拟个人专业版许可证，以解除客户端里无需后端支持的部分功能限制，比如事件数、效果数、层数、字体数
// @author       star2000
// @match        https://editor.construct.net/*
// @run-at       document-start
// @icon         https://editor.construct.net/media/icon-512.png
// @grant        none
// @license      AGPL-3.0-or-later
// ==/UserScript==
'use strict'

if (
  !location.href.includes('editor.construct.net') ||
  !location.href.endsWith('/')
)
  return

const ma = '0123456789abcdef',
  license = 'personal',
  validMS = 7 * 24 * 60 * 60 * 1000

function randomInt(t) {
  return Math.floor(Math.random() * t)
}
function stringToArrayBuffer(t) {
  return new TextEncoder('utf-8').encode(t).buffer
}
function shuffle(t) {
  let i = ''
  const e = new Uint8Array(t)
  for (let t = 0; t < e.length; ++t) {
    const s = e[t],
      n = 15 & s
    i += ma[s >> 4] + ma[n]
  }
  return i
}
function customSHA(t) {
  return window.isSecureContext
    ? crypto.subtle.digest('SHA-256', t).then(shuffle)
    : Promise.reject(new Error('web crypto only available on secure origins'))
}
function generateHash(t) {
  return 'string' == typeof t && (t = stringToArrayBuffer(t)), customSHA(t)
}

async function generateLoginRecord(userName, userId) {
  const mainScript = document.querySelector('script[src*="main"]')
  if (!mainScript) return
  const mainJsResp = await fetch(mainScript.src)
  const mainJsText = await mainJsResp.text()
  const releaseRangeEnd = mainJsText.lastIndexOf('.URL=')
  const releaseRangeStart = mainJsText.lastIndexOf('{}', releaseRangeEnd)
  const release = parseInt(
    mainJsText.substring(releaseRangeStart, releaseRangeEnd).match(/\d{3,}/)[0]
  )
  const saltRangeEnd = mainJsText.lastIndexOf('localforage.setItem("."')
  const saltRangeStart = mainJsText.lastIndexOf('+', saltRangeEnd)
  const salt = mainJsText
    .substring(saltRangeStart, saltRangeEnd)
    .match(/\d{3,}/)[0]

  const e = randomInt(86400),
    s = randomInt(validMS),
    n = 22,
    r = randomInt(1e8),
    h = randomInt(365)
  const now = Date.now()
  let expirationTime = now + validMS
  const c =
      '.' +
      (r + userId) +
      userName +
      '.' +
      [...(h + release).toString()].reverse().join('') +
      '.' +
      '.' +
      s +
      license +
      n +
      Math.floor(now / 14 + expirationTime / 14 - s) +
      salt,
    hash = await generateHash(c)
  return [
    h,
    Infinity,
    s,
    userName,
    e,
    Infinity,
    now,
    userId,
    n,
    license,
    r,
    expirationTime,
    Infinity,
    release,
    Infinity,
    hash,
  ]
}

window.addEventListener('DOMContentLoaded', async () => {
  while (!window.localforage) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  await localforage.removeItem(',')
  await localforage.setItem('.', await generateLoginRecord('poor only', 1))
})
