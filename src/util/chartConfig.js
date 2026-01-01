import {
  setInitialCandleStickStyle,
  setInitialOptionCandleStick,
} from '../components/chart/candle_stick/candleStickData'

/**
 * 차트 타입별 설정 매핑 객체
 */
export const chartConfigMap = {
  candlestick: {
    getInitialStyle: setInitialCandleStickStyle,
    getInitialOption: setInitialOptionCandleStick,
  },
  // 향후 다른 차트 타입 추가 가능
  // line: {
  //   getInitialStyle: setInitialLineStyle,
  //   getInitialOption: setInitialOptionLine,
  // },
}

/**
 * 차트 타입에 따른 초기 스타일 설정 가져오기
 * @param {string} type - 차트 타입
 * @param {Array} data - 차트 데이터
 * @param {string} uniqueChartName - 차트 고유 이름
 * @param {string} timePropertyName - 시간 속성 이름
 * @returns {Object} 초기 스타일 설정
 */
export function getChartInitialStyle(type, data, uniqueChartName, timePropertyName) {
  const config = chartConfigMap[type]
  if (!config) {
    throw new Error(`지원하지 않는 차트 타입입니다: ${type}`)
  }
  
  return config.getInitialStyle(data, uniqueChartName, timePropertyName)
}

/**
 * 차트 타입에 따른 초기 옵션 설정 가져오기
 * @param {string} type - 차트 타입
 * @param {string} uniqueChartName - 차트 고유 이름
 * @returns {Object} 초기 옵션 설정
 */
export function getChartInitialOption(type, uniqueChartName) {
  const config = chartConfigMap[type]
  if (!config) {
    throw new Error(`지원하지 않는 차트 타입입니다: ${type}`)
  }
  
  return config.getInitialOption(uniqueChartName)
}
