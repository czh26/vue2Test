import { getDistance } from 'ol/sphere'

function getCoors (startCoor, endCoor) {
  const xDis = endCoor[0] - startCoor[0]
  const yDis = endCoor[1] - startCoor[1]
  // 计算x坐标的增量
  const xUnitstep = xDis / 2000
  const yUnitstep = yDis / 2000
  let x = startCoor[0]
  let y = startCoor[1]
  const coorArr = []
  for (let i = 0; i <= 2000; i++) {
    x = x + xUnitstep
    y = y + yUnitstep
    coorArr.push([x, y])
  }
  return coorArr
}

function getCoorsByRtio (ratio, startCoor, endCoor) {
  ratio = ratio * 1.60665
  // ratio = Math.pow(ratio,2)/1000
  console.log(ratio)
  const xDis = endCoor[0] - startCoor[0]
  const yDis = endCoor[1] - startCoor[1]
  // 计算x坐标的增量
  const xUnitstep = xDis / (ratio)
  const yUnitstep = yDis / (ratio)
  let x = startCoor[0]
  let y = startCoor[1]
  const coorArr = []
  for (let i = 0; i <= (ratio); i++) {
    x = x + xUnitstep
    y = y + yUnitstep
    coorArr.push([x, y])
  }
  return coorArr
}

function calculateRatio (coors) {
  if (coors.length < 1) {
    return
  }
  // 计算各个线段的距离
  const distance = [] // 各个线段路程的集合
  for (let i = 0; i < coors.length - 1; i++) {
    distance.push(Math.floor(sphereDistance(coors[i], coors[i + 1])))
  }
  return distance
}
// 数组去重 方法1
function uniqueBySet (arr) {
  return Array.from(new Set(arr))
}
// 数组去重 方法2
function uniqueByMap (arr) {
  const map = new Map()
  const array = new Array([])
  for (let i = 0; i < arr.length; i++) {
    if (map.has(arr[i].toString())) {
      map.set(arr[i].toString(), true)
    } else {
      map.set(arr[i].toString(), false)
      array.push(arr[i])
    }
  }
  return array
}

// 计算2个经纬度点之间的距离
function sphereDistance (coor1, coor2) {
  return getDistance(coor1, coor2)
}

export {
  getCoors,
  calculateRatio,
  getCoorsByRtio,
  uniqueByMap,
  uniqueBySet,
  sphereDistance
}
