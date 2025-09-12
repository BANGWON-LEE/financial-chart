import { setOptionCandleStickData } from '../components/chart/candle_stick/candleStickData'
import { outerChartRealSignal } from './signal'
import { xaxisStore } from './xaxisState'
// import { chartRef } from '../components/chart/candle_stick/CandleStickMain'

const chart = setOptionCandleStickData()
const xaxis = xaxisStore()
const signal = outerChartRealSignal()

let xActive = 0
export const xRangeEvent = (chartRef, setXState) => {
  chartRef.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      // 좌우 휠 동작 감지
      e.preventDefault()
      if (e.deltaX < xActive) {
        xaxis.leftX()
      } else if (e.deltaX > xActive) {
        xaxis.rightX()
      }
      setXState(xaxis.getX())
      if (xaxis.getX() >= -30) signal.update('ChartEvent', true)
    }
  })
}

export function outerDataStore() {
  let storeArr = []

  return {
    get: function () {
      return storeArr
    },
    set: function (chartData) {
      // console.log('store Check', chartData)
      storeArr.push(chartData)
      // console.log('store get check', storeArr)
    },
    reset: function () {
      // 배열 초기화를 위한 메서드
      // alert('reset Do it')
      storeArr = []
      return
      // console.log('mine',)
    },
  }
}
