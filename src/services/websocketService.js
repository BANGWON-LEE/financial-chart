/**
 * Upbit WebSocket 연결 관리 서비스
 */

export class WebSocketManager {
  constructor() {
    this.reconnectAttempts = 0
    this.socket = null
    this.reconnectTimer = null
    this.cache = new Map()
    this.isConnected = false
  }

  /**
   * WebSocket 연결 시작
   * @param {Function} setUpbitData - 데이터 업데이트 함수
   */
  connect(setUpbitData) {
    this.setUpbitData = setUpbitData
    this.createConnection()
  }

  /**
   * WebSocket 연결 생성
   */
  createConnection() {
    this.socket = new WebSocket(
      `wss://api.upbit.com/websocket/v1?cb=${crypto.randomUUID()}&cache_bust=${Date.now()}&no_proxy=1`
    )

    this.socket.binaryType = 'arraybuffer'
    this.setupEventHandlers()
  }

  /**
   * WebSocket 이벤트 핸들러 설정
   */
  setupEventHandlers() {
    this.socket.onopen = () => this.handleOpen()
    this.socket.onmessage = (event) => this.handleMessage(event)
    this.socket.onerror = (error) => this.handleError(error)
    this.socket.onclose = () => this.handleClose()
  }

  /**
   * 연결 성공 처리
   */
  handleOpen() {
    const requestField = [
      { ticket: 'test' },
      { type: 'ticker', codes: ['KRW-BTC'] },
      { format: 'DEFAULT' },
    ]

    this.socket.send(JSON.stringify(requestField))
    this.reconnectAttempts = 0
    this.isConnected = true
    console.info('[Upbit WS] 연결 성공')
  }

  /**
   * 메시지 수신 처리
   * @param {MessageEvent} event - WebSocket 메시지 이벤트
   */
  handleMessage(event) {
    const dataObj = event.data
    
    if (dataObj instanceof ArrayBuffer) {
      const text = new TextDecoder('utf-8').decode(new Uint8Array(dataObj))
      this.processTextMessage(text)
      return
    }
    
    if (typeof Blob !== 'undefined' && dataObj instanceof Blob) {
      const reader = new FileReader()
      reader.onload = () => this.processTextMessage(reader.result)
      reader.readAsText(dataObj)
      return
    }
    
    if (typeof dataObj === 'string') {
      this.processTextMessage(dataObj)
    }
  }

  /**
   * 텍스트 메시지 처리
   * @param {string} text - 수신한 텍스트 데이터
   */
  processTextMessage(text) {
    try {
      const data = JSON.parse(text)
      const newData = this.transformSocketData(data)
      const secondTimestamp = Math.floor(data.timestamp / 1000)
      const result = this.checkDuplicationTime(secondTimestamp, newData)
      
      this.handleDataUpdate(result)
    } catch (error) {
      console.error('[Upbit WS] 메시지 처리 오류:', error)
    }
  }

  /**
   * WebSocket 데이터 변환
   * @param {Object} data - 원본 WebSocket 데이터
   * @returns {Object} 변환된 캔들스틱 데이터
   */
  transformSocketData(data) {
    return {
      o: data.trade_price,
      x: Math.floor(data.timestamp / 1000) * 1000,
      h: data.trade_price,
      l: data.trade_price,
      c: data.trade_price,
    }
  }

  /**
   * 중복 시간 데이터 체크 및 처리
   * @param {number} secondTimestamp - 초 단위 타임스탬프
   * @param {Object} newData - 새로운 데이터
   * @returns {Object} 처리된 데이터
   */
  checkDuplicationTime(secondTimestamp, newData) {
    const candle = this.cache.get(secondTimestamp) || newData

    if (!this.cache.has(secondTimestamp)) {
      this.cache.set(secondTimestamp, newData)
    } else {
      this.clearCacheIfNeeded()
      candle.h = Math.max(candle.h, newData.h)
      candle.l = Math.min(candle.l, newData.l)
      candle.c = newData.c
    }

    return this.cache.get(secondTimestamp) || candle
  }

  /**
   * 캐시 크기 체크 및 정리
   */
  clearCacheIfNeeded() {
    const sizeResetCondition = 60
    if (this.cache.size > sizeResetCondition) {
      this.cache.clear()
    }
  }

  /**
   * 데이터 업데이트 처리
   * @param {Object} result - 처리된 데이터
   */
  handleDataUpdate(result) {
    // Context API 상태 확인을 위한 이벤트 발생
    const chartEvent = new CustomEvent('GetChartSignal', { 
      detail: { action: 'isOn', event: 'chartEvent' } 
    })
    document.dispatchEvent(chartEvent)
    
    // 임시로 전역 상태 사용
    const isChartEventOn = document._chartSignal?.isOn('chartEvent') ?? true
    const store = this.getDataStore()

    if (isChartEventOn) {
      this.setUpbitData(prev => {
        const newArr = [...prev]
        const lastIndex = newArr.length - 1
        if (prev[lastIndex]?.x === result.x) {
          newArr[lastIndex] = result
          return [...newArr, ...store.get()]
        }
        return [...prev, ...store.get(), result]
      })
      if (store.get().length > 0) {
        store.reset()
      }
    } else {
      store.set(result)
    }
  }

  /**
   * 데이터 저장소 가져오기
   * @returns {Object} 데이터 저장소 객체
   */
  getDataStore() {
    // 전역에 저장된 데이터 저장소 가져오기
    return window._dataStore || { get: () => [], set: () => {}, reset: () => {} }
  }

  /**
   * 연결 오류 처리
   * @param {Error} error - WebSocket 오류
   */
  handleError(error) {
    console.error('[Upbit WS] 소켓 오류', error)
    this.scheduleReconnect()
  }

  /**
   * 연결 종료 처리
   */
  handleClose() {
    console.warn('[Upbit WS] 연결 종료, 재연결 시도')
    this.isConnected = false
    this.scheduleReconnect()
  }

  /**
   * 재연결 스케줄링
   */
  scheduleReconnect() {
    if (this.reconnectTimer) return
    
    this.reconnectAttempts += 1
    const delayMs = 1700
    
    console.warn('[Upbit WS] 연결 실패, 재시도 예정', {
      attempt: this.reconnectAttempts,
      retryInMs: delayMs,
    })
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.createConnection()
    }, delayMs)
  }

  /**
   * 연결 종료
   */
  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.isConnected = false
  }
}

// 싱글톤 인스턴스
export const websocketManager = new WebSocketManager()
