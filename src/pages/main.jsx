import { useEffect, useRef, useState } from 'react'
import AskChart from '../components/chart/AskChart'
import { getUpbitPastData, upBitSocketDataLoad } from '../api/api'
import { firebaseConfig } from '../api/firebase'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { outerChartRealSignal } from '../util/signal'
import { xRangeEvent } from '../util/chartEventAction'
import { formatRequestDate, formatTimestamp } from '../util/date'

export async function loadUpbitCurrentData() {
  const pastData = await getUpbitPastData(formatRequestDate(new Date()))

  const pastUpbitDataObj = pastData.data.map(data => ({
    o: data.opening_price,
    x: new Date(data.candle_date_time_kst).getTime(),
    // x: data.candle_date_time_kst,
    h: data.high_price,
    l: data.low_price,
    c: data.trade_price,
  }))

  const result = pastUpbitDataObj.reverse()
  setUpbitData(prev => [...prev, ...result])
}

async function loadUpbitMorePastData(focusDate) {
  const pastData = await getUpbitPastData(focusDate)

  const pastUpbitDataObj = pastData.data.map(data => ({
    o: data.opening_price,
    x: new Date(data.candle_date_time_kst).getTime(),
    // x: data.candle_date_time_kst,
    h: data.high_price,
    l: data.low_price,
    c: data.trade_price,
  }))

  const result = pastUpbitDataObj.reverse()

  setUpbitData(prev => [...result, ...prev])
}

export default function Main() {
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
    loadUpbitPastData(setUpbitData, focusDate).then(() => {
      upBitSocketDataLoad(setUpbitData)
    })

    // async function setupFCM() {
    //   if ('serviceWorker' in navigator) {
    //     const registration = await navigator.serviceWorker.register(
    //       '/firebase-messaging-sw.js',
    //       {
    //         type: 'module',
    //       }
    //     )
    //     const permission = await Notification.requestPermission()
    //     if (permission === 'granted') {
    //       const token = await getToken(message, {
    //         vapidKey: import.meta.env.VITE_FIREBASE_VAPID_PUBLIC_KEY,
    //         serviceWorkerRegistration: registration, // 🔥 핵심
    //       })
    //       console.log('✅ FCM 토큰:', token)
    //     }
    //   }
    // }
    // setupFCM()
  }, [])

  const [upbitData, setUpbitData] = useState([])
  const app = initializeApp(firebaseConfig)

  const message = getMessaging(app)
  const chartRef = useRef(null)
  const [xState, setXState] = useState(-30)
  const signal = outerChartRealSignal()
  const [focusDate, setFocusDate] = useState(
    signal.get('chartCurrentFocusDate')
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
        // data={upbitData.slice(-420)}
        data={upbitData.slice(
          updateXaxisEnd(xState),
          updateXaxisStart(xState + 29)
        )}
        width={836}
        height={342}
        // height={342}
        uniqueChartName={'realTime'}
        timePropertyName={'x'}
        chartRef={chartRef}
      />
    </div>
  )
}
