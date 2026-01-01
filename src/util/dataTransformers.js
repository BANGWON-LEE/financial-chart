/**
 * 업비트 API 데이터를 캔들스틱 차트 형식으로 변환
 * @param {Array} apiData - 업비트 API 응답 데이터 배열
 * @returns {Array} 캔들스틱 차트 데이터 배열
 */
export function transformUpbitData(apiData) {
  return apiData.map(data => ({
    o: data.opening_price,
    x: new Date(data.candle_date_time_kst).getTime(),
    h: data.high_price,
    l: data.low_price,
    c: data.trade_price,
  }))
}

/**
 * WebSocket 실시간 데이터를 캔들스틱 형식으로 변환
 * @param {Object} socketData - WebSocket 실시간 데이터
 * @returns {Object} 캔들스틱 데이터 객체
 */
export function transformWebSocketData(socketData) {
  const secondTimestamp = Math.floor(socketData.timestamp / 1000)
  return {
    o: socketData.trade_price,
    x: secondTimestamp * 1000,
    h: socketData.trade_price,
    l: socketData.trade_price,
    c: socketData.trade_price,
  }
}

/**
 * 변환된 데이터를 역순으로 정렬 (오래된 데이터가 앞에 오도록)
 * @param {Array} data - 변환된 데이터 배열
 * @returns {Array} 역순으로 정렬된 데이터 배열
 */
export function reverseDataOrder(data) {
  return data.reverse()
}
