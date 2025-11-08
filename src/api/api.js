import axios from 'axios'

import { outerChartRealSignal } from '../util/signal'
import { outerDataStore } from '../util/chartEventAction'
import { loadUpbitCurrentData } from '../pages/main'

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

function clearCacheMap(cache) {
  const sizeResetCondition = 60
  if (cache.size > sizeResetCondition) {
    cache.clear()
  }
}

function checkDuplicationTime(cache, secondTimestamp, newData) {
  const candle = cache.get(secondTimestamp) || newData

  if (!cache.has(secondTimestamp)) {
    // console.log('secondTimestamp', secondTimestamp)
    cache.set(secondTimestamp, newData)
  } else {
    clearCacheMap(cache)
    candle.h = Math.max(candle.h, newData.h)
    candle.l = Math.min(candle.l, newData.l)
    candle.c = newData.c
    // 소켓에 들어오는 데이터가 초 단위로 여러번 들어옴 따라서, 같은 초의 마지막 거래 가격을 갱신하기 위해
    // candle.c = newData.c로 할당해야 함
  }

  return cache.get(secondTimestamp) || candle
}

export function upBitSocketDataLoad(setUpbitData) {
  const ctx = {
    reconnectAttempts: 0,
    socket: null,
    reconnectTimer: null,
    cache: new Map(),
    setUpbitData,
  }

  connectUpbit(ctx, ctx.setUpbitData)
}

function handleUpbitTextMessage(text, cache, setUpbitData) {
  const data = JSON.parse(text)
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
    setUpbitData(prev => {
      const newArr = [...prev]
      const lastIndex = newArr.length - 1
      if (prev[lastIndex].x === result.x) {
        newArr[lastIndex] = result
        return [...newArr, ...store.get()]
      }

      return [...prev, ...store.get(), result]
    })
    if (store.get().length > 0) {
      store.reset()
    }
  } else if (signal.isOn('ChartEvent') === false) {
    store.set(result)
  }
}

// startPollingFallback 제거: 폴링 없이 WS만 사용

function scheduleReconnect(ctx) {
  if (ctx.reconnectTimer) return
  ctx.reconnectAttempts += 1
  // const delayMs = Math.min(30000, 1000 * Math.pow(2, ctx.reconnectAttempts))
  const delayMs = 5000
  console.warn('[Upbit WS] 연결 실패, 재시도 예정', {
    attempt: ctx.reconnectAttempts,
    retryInMs: delayMs,
  })
  ctx.reconnectTimer = setTimeout(() => {
    ctx.reconnectTimer = null
    connectUpbit(ctx, ctx.setUpbitData)
  }, delayMs)
}

function connectUpbit(ctx, setUpbitData) {
  ctx.socket = new WebSocket('wss://api.upbit.com/websocket/v1')
  ctx.socket.onerror = e => {
    loadUpbitCurrentData(setUpbitData).then(() => {
      console.log('error signal', e)
      // console.log('check')
      scheduleReconnect(ctx)
    })
    // throw new Error()
  }

  ctx.socket.binaryType = 'arraybuffer'

  ctx.socket.onopen = () => {
    const requestField = [
      { ticket: 'test' },
      { type: 'ticker', codes: ['KRW-BTC'] },
      { format: 'DEFAULT' },
    ]

    // console.log('send', ctx.socket.send(JSON.stringify(requestField)))

    ctx.socket.send(JSON.stringify(requestField))

    ctx.reconnectAttempts = 0
    console.info('[Upbit WS] 연결 성공')
  }

  ctx.socket.onmessage = event => {
    const dataObj = event.data
    if (dataObj instanceof ArrayBuffer) {
      const text = new TextDecoder('utf-8').decode(new Uint8Array(dataObj))
      try {
        handleUpbitTextMessage(text, ctx.cache, ctx.setUpbitData)
      } catch (_) {}
      return
    }
    if (typeof Blob !== 'undefined' && dataObj instanceof Blob) {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          handleUpbitTextMessage(reader.result, ctx.cache, ctx.setUpbitData)
        } catch (_) {}
      }
      reader.readAsText(dataObj)
      return
    }
    if (typeof dataObj === 'string') {
      try {
        handleUpbitTextMessage(dataObj, ctx.cache, ctx.setUpbitData)
      } catch (_) {}
    }
  }

  ctx.socket.onerror = err => {
    console.error('[Upbit WS] 소켓 오류', err)
    try {
      ctx.socket.close()
    } catch (_) {}
  }

  ctx.socket.onclose = () => {
    console.warn('[Upbit WS] 연결 종료, 재연결 시도')
    scheduleReconnect(ctx)
  }
}
