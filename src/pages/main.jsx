import { useEffect, useRef, useState } from 'react'
import AskChart from '../components/chart/AskChart'
import { getUpbitPastData, upBitSocketDataLoad } from '../api/api'
import { firebaseConfig } from '../api/firebase'
import { initializeApp } from 'firebase/app'
// import { getMessaging, getToken } from 'firebase/messaging'
import { outerChartRealSignal } from '../util/signal'
import { xRangeEvent } from '../util/chartEventAction'
import { formatRequestDate, formatTimestamp } from '../util/date'

export async function loadUpbitCurrentData(setUpbitData) {
  const pastData = await getUpbitPastData(formatRequestDate(new Date()))

  const pastUpbitDataObj = pastData.data.map(data => ({
    o: data.opening_price,
    x: new Date(data.candle_date_time_kst).getTime(),
    h: data.high_price,
    l: data.low_price,
    c: data.trade_price,
  }))

  const result = pastUpbitDataObj.reverse()
  // console.log('폴링 확인', result, '<===>', pastData)
  // setUpbitData(prev => [...prev, ...result])
  setUpbitData(prev => [...prev, ...result])
}

export default function Main() {
  const [upbitData, setUpbitData] = useState([])
  async function loadUpbitPastData(setUpbitData, focusDate) {
    const pastData = await getUpbitPastData(focusDate)

    const pastUpbitDataObj = pastData.data.map(data => ({
      o: data.opening_price,
      x: new Date(data.candle_date_time_kst).getTime(),
      h: data.high_price,
      l: data.low_price,
      c: data.trade_price,
    }))

    setUpbitData(pastUpbitDataObj.reverse())
  }

  useEffect(() => {
    let cleanupSocket

    loadUpbitPastData(setUpbitData, focusDate)
      .then(() => {
        cleanupSocket = upBitSocketDataLoad(setUpbitData)
      })
      .catch(error => {
        console.error('초기 과거 데이터 로드 실패', error)
        setUpbitData([])
      })

    return () => {
      cleanupSocket()
    }
  }, [])

  async function loadUpbitMorePastData(focusDate) {
    const pastData = await getUpbitPastData(focusDate)

    const pastUpbitDataObj = pastData.data.map(data => ({
      o: data.opening_price,
      x: new Date(data.candle_date_time_kst).getTime(),
      h: data.high_price,
      l: data.low_price,
      c: data.trade_price,
    }))

    const result = pastUpbitDataObj.reverse()

    setUpbitData(prev => [...result, ...prev])
  }

  const app = initializeApp(firebaseConfig)

  // const message = getMessaging(app)
  const chartRef = useRef(null)
  const [xState, setXState] = useState(-30)
  const signal = outerChartRealSignal()
  const [focusDate, setFocusDate] = useState(
    signal.get('chartCurrentFocusDate'),
    // formatRequestDate(new Date())
  )
  useEffect(() => {
    xRangeEvent(chartRef.current.canvas, setXState)
  })

  const dataFirstDate = () => upbitData[0]?.x !== undefined && upbitData[0]?.x

  useEffect(() => {
    document.addEventListener('ChartEvent', e => {
      signal.update('ChartEvent', false)
      const msFocusDate = dataFirstDate()
      let firstDate = e.detail.focusDate.start
      if (
        formatTimestamp(firstDate) !==
        formatTimestamp(new Date(dataFirstDate()))
      ) {
        return
      }

      const timeTerm = msFocusDate - firstDate > -1757413885000
      if (timeTerm) {
        compareDateRange(formatRequestDate(new Date(dataFirstDate())))
      }
    })
  })

  useEffect(() => {
    if (focusDate !== signal.get('chartCurrentFocusDate')) {
      loadUpbitMorePastData(focusDate)
    }
  }, [focusDate])

  function compareDateRange(firstDate) {
    setFocusDate(firstDate)
  }

  function updateXaxisEnd(xState) {
    const zeroRagne =
      (xState >= 0 && xState < 1) || (xState <= 0 && xState > -1) || xState >= 0
    return zeroRagne ? -30 : xState
  }

  function updateXaxisStart(xState) {
    const staticNum = xState >= -1 ? -1 : xState
    return staticNum
  }

  return (
    <div>
      <AskChart
        type={'candlestick'}
        data={upbitData.slice(
          updateXaxisEnd(xState),
          updateXaxisStart(xState + 29),
        )}
        width={836}
        height={342}
        uniqueChartName={'realTime'}
        timePropertyName={'x'}
        chartRef={chartRef}
      />
    </div>
  )
}
