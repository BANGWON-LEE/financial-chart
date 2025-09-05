import { setOptionCandleStickData } from '../components/chart/candle_stick/candleStickData'
import { xaxisStore } from './xaxisState'
// import { chartRef } from '../components/chart/candle_stick/CandleStickMain'

const chart = setOptionCandleStickData()
const xaxis = xaxisStore()

export const xRangeEvent = (chartRef, setXState) => {
  chartRef.addEventListener('wheel', e => {
    console.log('wheel event', e)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      // 좌우 휠 동작 감지
      e.preventDefault()

      // 오른쪽 스크롤 → 왼쪽으로 팬
      // if (e.deltaX) {
      // 왼쪽 스크롤 → 오른쪽으로 팬
      xaxis.leftX()
      setXState(xaxis.getX())
      console.log('xaxis@@gg', xaxis.getX())
      chart.pan({ x: xaxis.getX() }, undefined, 'default')
      // }

      // if (xaxis.getXRange() < -1000) {
      // }
      // else {
      //   xaxis.rightX()
      //   chart.pan({ x: xaxis.getX() }, undefined, 'default')
      // }
    }
  })
}
