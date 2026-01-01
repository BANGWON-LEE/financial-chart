/**
 * X축 범위 업데이트 헬퍼 함수들
 */

/**
 * X축 끝 범위 업데이트
 * @param {number} xState - 현재 X축 상태
 * @returns {number} 업데이트된 X축 끝 범위
 */
export function updateXaxisEnd(xState) {
  const zeroRange = 
    (xState >= 0 && xState < 1) || 
    (xState <= 0 && xState > -1) || 
    xState >= 0
  return zeroRange ? -30 : xState
}

/**
 * X축 시작 범위 업데이트
 * @param {number} xState - 현재 X축 상태
 * @returns {number} 업데이트된 X축 시작 범위
 */
export function updateXaxisStart(xState) {
  return xState >= -1 ? -1 : xState
}

/**
 * 데이터의 첫 번째 날짜 가져오기
 * @param {Array} data - 차트 데이터 배열
 * @returns {number|null} 첫 번째 데이터의 타임스탬프
 */
export function getDataFirstDate(data) {
  return data[0]?.x !== undefined ? data[0]?.x : null
}

/**
 * 날짜 범위 비교 및 포커스 날짜 업데이트
 * @param {number} msFocusDate - 데이터 첫 날짜
 * @param {number} firstDate - 이벤트 시작 날짜
 * @param {Function} compareDateRange - 날짜 범위 비교 함수
 * @param {Function} formatRequestDate - 날짜 포맷 함수
 */
export function handleDateRangeComparison(msFocusDate, firstDate, compareDateRange, formatRequestDate) {
  const timeTerm = msFocusDate - firstDate > -1757413885000
  if (timeTerm) {
    compareDateRange(formatRequestDate(new Date(msFocusDate)))
  }
}
