import { useEffect, useState } from 'react'
import AskChart from '../components/chart/AskChart'
import { getUpbitPastData, upBitSocketDataLoad } from '../api/api'
import { firebaseConfig } from '../api/firebase'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { outerChartRealSignal } from '../util/signal'

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

  // const setChartData = () =>
  //   loadUpbitPastData(setUpbitData).then(() => {
  //     upBitSocketData(setUpbitData)
  //   })

  useEffect(() => {
    const signal = outerChartRealSignal()
    loadUpbitPastData(setUpbitData).then(() => {
      upBitSocketDataLoad(setUpbitData)
    })

    document.addEventListener('ChartEvent', () => {
      console.log('status state111', signal.get('ChartEvent'))

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
        data={upbitData.slice(-300)}
        width={836}
        height={342}
        uniqueChartName={'realTime'}
        timePropertyName={'x'}
      />
    </div>
  )
}

export function outerDataStore() {
  const storeArr = []
  // console.log('바보 데이터', storeArr)

  return {
    get: function () {
      // console.log('get check', storeArr)
      return storeArr
    },
    set: function (chartData) {
      // console.log('chartData', chartData)
      storeArr.push(chartData)
    },
  }
}
