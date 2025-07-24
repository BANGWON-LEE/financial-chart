import { useEffect, useState } from 'react'
import AskChart from '../components/chart/AskChart'
import { getUpbitPastData, upBitSocketData } from '../api/api'

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

  useEffect(() => {
    loadUpbitPastData(setUpbitData).then(() => {
      upBitSocketData(setUpbitData)
    })
  }, [])

  return (
    <div>
      <AskChart
        type={'candlestick'}
        // data={[...pastData, ...upbitData]}
        data={upbitData.slice(-190)}
        // data={upbitData}
        width={836}
        height={342}
        uniqueChartName={'realTime'}
        timePropertyName={'x'}
      />
    </div>
  )
}
