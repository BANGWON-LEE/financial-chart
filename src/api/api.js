import axios from 'axios'

import { outerChartRealSignal } from '../util/signal'
import { xaxisStore } from '../util/xaxisState'
import { outerDataStore } from '../util/chartEventAction'

// export function upBitSocketData(setUpbitData, realSignal) {
//   const socket = new WebSocket('wss://api.upbit.com/websocket/v1')

//   socket.onopen = () => {
//     const requestField = [
//       { ticket: 'test' },
//       { type: 'ticker', codes: ['KRW-BTC'] },
//       {
//         format: 'DEFAULT',
//       },
//     ]
//     socket.send(JSON.stringify(requestField))
//   }

//   const cache = new Map()

//   socket.onmessage = event => {
//     const reader = new FileReader()
//     reader.readAsText(event.data)
//     reader.onload = () => {
//       const data = JSON.parse(reader.result)
//       const secondTimestamp = Math.floor(data.timestamp / 1000)
//       const newData = {
//         o: data.trade_price,
//         x: secondTimestamp * 1000,
//         h: data.trade_price,
//         l: data.trade_price,
//         c: data.trade_price,
//       }

//       const candle = cache.get(secondTimestamp) || newData

//       if (!cache.has(secondTimestamp)) {
//         // console.log('secondTimestamp', secondTimestamp)
//         cache.set(secondTimestamp, newData)
//       } else {
//         candle.h = Math.max(candle.h, newData.h)
//         candle.l = Math.min(candle.l, newData.l)
//         candle.c = newData.c
//         // 소켓에 들어오는 데이터가 초 단위로 여러번 들어옴 따라서, 같은 초의 마지막 거래 가격을 갱신하기 위해
//         // candle.c = newData.c로 할당해야 함
//       }

//       // console.log('활동 활동')

//       if (realSignal === true) {
//         setUpbitData(prev => {
//           return [...prev, candle]
//         })
//       } else {
//         setUpbitData(candle)
//       }
//     }
//   }
// }

export function getUpbitPastData(focusDate) {
  // const url = `https://api.upbit.com/v1/candles/seconds?market=KRW-BTC&count=${range}`
  const url = `https://api.upbit.com/v1/candles/seconds?market=KRW-BTC&count=200&to=${focusDate}`

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        resolve(response)
      })
      .catch(err => reject(err))
  })
}

const store = outerDataStore()

function checkDuplicationTime(cache, secondTimestamp, newData) {
  const candle = cache.get(secondTimestamp) || newData

  if (!cache.has(secondTimestamp)) {
    // console.log('secondTimestamp', secondTimestamp)
    cache.set(secondTimestamp, newData)
  } else {
    candle.h = Math.max(candle.h, newData.h)
    candle.l = Math.min(candle.l, newData.l)
    candle.c = newData.c
    // 소켓에 들어오는 데이터가 초 단위로 여러번 들어옴 따라서, 같은 초의 마지막 거래 가격을 갱신하기 위해
    // candle.c = newData.c로 할당해야 함
  }

  return cache.get(secondTimestamp) || candle
}

export function upBitSocketDataLoad(setUpbitData) {
  const socket = new WebSocket('wss://api.upbit.com/websocket/v1')

  socket.binaryType = 'arraybuffer'
  socket.onopen = () => {
    const requestField = [
      { ticket: 'test' },
      { type: 'ticker', codes: ['KRW-BTC'] },
      {
        format: 'DEFAULT',
      },
    ]
    socket.send(JSON.stringify(requestField))
  }

  const cache = new Map()

  socket.onmessage = event => {
    const textData = new TextDecoder('utf-8').decode(event.data)

    // const reader = new FileReader()
    // reader.readAsText(textData)
    // reader.onload = () => {
    const data = JSON.parse(textData)
    const secondTimestamp = Math.floor(data.timestamp / 1000)
    const newData = {
      o: data.trade_price,
      x: secondTimestamp * 1000,
      h: data.trade_price,
      l: data.trade_price,
      c: data.trade_price,
    }

    const result = checkDuplicationTime(cache, secondTimestamp, newData)

    const signal = outerChartRealSignal()

    if (signal.isOn('ChartEvent') === true) {
      // console.log('pastUpbitData', pastUpbitData())

      setUpbitData(prev => {
        return [...prev, ...store.get(), result]
      })
      if (store.get().length > 0) {
        store.reset()
      }
    } else if (signal.isOn('ChartEvent') === false) {
      store.set(result)
    }
    // }
  }
}
