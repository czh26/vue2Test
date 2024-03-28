// 分时函数
export const performChunk = (datas) => {
  if (datas.length === 0) return null
  let i = 0
  const _run = () => {
    if (i >= datas.length) return null
    requestIdleCallback((idle) => {
      while (idle.timeRemaining() > 0 && i < datas.length) {
        const div = document.createElement('div')
        div.textContent = i
        document.getElementById('test').appendChild(div)
        i++
      }
      _run()
    })
  }
  _run()
}
