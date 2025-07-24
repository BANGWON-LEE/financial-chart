import { Chart } from 'chart.js'

export function getAllStorage() {
  if (typeof window === 'undefined') return

  const savedChartStyle = JSON.parse(localStorage.getItem('askChart')) || null

  return savedChartStyle
}
export function getStorage(uniqueChartName) {
  if (typeof window === 'undefined') return

  const savedChartStyle = JSON.parse(localStorage.getItem('askChart')) || null

  return savedChartStyle?.[uniqueChartName]
}

export function formatData(data) {
  const result = data.reduce((acc, obj) => {
    Object.keys(obj).forEach(key => {
      acc[key] = acc[key] || []
      acc[key].push(obj[key])
    })
    return acc
  }, {})

  return result
}

// export function moveWheelChartArea(chartInfo) {
//   // const chart = new Chart()
//   if (document.activeElement === chartInfo.canvas) {
//     console.log('gkgkgk')
//   }

//   chartInfo.canvas.addEventListener('wheel', event => {
//     event.preventDefault()
//     if (event.deltaX !== 0) {
//       console.log('3r3r3r')
//       event.preventDefault()
//       chartInfo.$zoom.pan({ x: event.deltaX, y: 0 }, undefined, 'default')
//     }
//   })
// }
