import axios from 'axios'

import { outerDataStore } from '../util/chartEventAction'
import { transformUpbitData, reverseDataOrder } from '../util/dataTransformers'
import { websocketManager } from '../services/websocketService'

export function getUpbitPastData(focusDate) {
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

export function upBitSocketDataLoad(setUpbitData) {
  // 데이터 저장소를 전역에 임시 저장
  window._dataStore = outerDataStore()
  
  // WebSocket 매니저를 통해 연결
  websocketManager.connect(setUpbitData)
}
