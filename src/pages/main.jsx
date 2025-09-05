import { useEffect, useRef, useState } from 'react'
import AskChart from '../components/chart/AskChart'
import { getUpbitPastData, upBitSocketDataLoad } from '../api/api'
import { firebaseConfig } from '../api/firebase'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { outerChartRealSignal } from '../util/signal'
import { xRangeEvent } from '../util/chartEventAction'

export default function Main() {
  async function loadUpbitPastData(setUpbitData) {
    const pastData = await getUpbitPastData()

    const pastUpbitDataObj = pastData.data.map(data => ({
      o: data.opening_price,
      x: new Date(data.timestamp).getTime(),
      h: data.high_price,
      l: data.low_price,
      c: data.trade_price,
    }))

    setUpbitData(pastUpbitDataObj.reverse())
    // return pastData
  }
  const [upbitData, setUpbitData] = useState([])
  const app = initializeApp(firebaseConfig)

  const message = getMessaging(app)
  const chartRef = useRef(null)
  const [xState, setXState] = useState(-10)

  useEffect(() => {
    xRangeEvent(chartRef.current.canvas, setXState)
  })

  useEffect(() => {
    const signal = outerChartRealSignal()
    loadUpbitPastData(setUpbitData).then(() => {
      upBitSocketDataLoad(setUpbitData)
    })

    document.addEventListener('ChartEvent', () => {
      signal.update('ChartEvent', false)
      // }
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

  return (
    <div>
      <AskChart
        type={'candlestick'}
        // data={upbitData.slice(-420)}
        data={upbitData.slice(xState)}
        width={836}
        height={342}
        uniqueChartName={'realTime'}
        timePropertyName={'x'}
        chartRef={chartRef}
      />
    </div>
  )
}

export function outerDataStore() {
  const storeArr = []

  return {
    get: function () {
      return storeArr
    },
    set: function (chartData) {
      storeArr.push(chartData)
    },
  }
}
