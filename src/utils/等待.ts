function 等待(秒: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, 秒 * 1000)
  })
}
export { 等待 }
