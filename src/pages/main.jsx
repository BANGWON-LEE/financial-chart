import { useEffect, useRef, useState } from 'react'
import AskChart from '../components/chart/AskChart'
import { getUpbitPastData, upBitSocketDataLoad } from '../api/api'
import { firebaseConfig } from '../api/firebase'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { xRangeEvent } from '../util/chartEventAction'
import { formatRequestDate, formatTimestamp } from '../util/date'
import { transformUpbitData, reverseDataOrder } from '../util/dataTransformers'
import { updateXaxisEnd, updateXaxisStart, getDataFirstDate, handleDateRangeComparison } from '../util/chartHelpers'
import { useChartContext } from '../context/ChartContext'

export async function loadUpbitCurrentData(setUpbitData) {
  const pastData = await getUpbitPastData(formatRequestDate(new Date()))
  const result = reverseDataOrder(transformUpbitData(pastData.data))
  setUpbitData(prev => [...prev, ...result])
}

export default function Main() {
  const [upbitData, setUpbitData] = useState([])
  
  console.log('Main component rendered!')
  
  return (
    <div style={{ padding: '20px', background: '#f0f0f0' }}>
      <h1>Financial Chart Debug</h1>
      <p>Data items: {upbitData.length}</p>
      <p>If you see this, React is working!</p>
    </div>
  )
}
