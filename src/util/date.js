export function formatTimestamp(ms) {
  const date = new Date(ms)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작
  const day = String(date.getDate()).padStart(2, '0')

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function formatRequestDate(focusDate) {
  return focusDate.toISOString()
}
export function formatMSDate(date) {
  return new Date(date).getTime()
}
