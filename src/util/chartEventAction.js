import { setOptionCandleStickData } from '../components/chart/candle_stick/candleStickData'
import { xaxisStore } from './xaxisState'
// import { chartRef } from '../components/chart/candle_stick/CandleStickMain'

const chart = setOptionCandleStickData()
const xaxis = xaxisStore()

let xActive = 0
export const xRangeEvent = (chartRef, setXState) => {
  chartRef.addEventListener('wheel', e => {
    console.log('wheel event', e)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      // 좌우 휠 동작 감지
      e.preventDefault()
      if (e.deltaX < xActive) {
        xaxis.leftX()
        console.log('xaxis@@gg', xaxis.getX())
      } else if (e.deltaX > xActive) {
        xaxis.rightX()
        // setXState(xais)
      }
      setXState(xaxis.getX())
      // xActive = e.deltaX
      // chart.pan({ x: xaxis.getX() }, undefined, 'default')
    }
  })
}
