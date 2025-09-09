import { formatRequestDate } from './date'

const signalMap = new Map()
signalMap.set('ChartEvent', true)
signalMap.set('chartCurrentFocusDate', formatRequestDate(new Date()))

export function outerChartRealSignal() {
  return {
    update: (event, status) => signalMap.set(event, status),
    get: event => signalMap.get(event),
    isOn: event => signalMap.get(event) === true,
  }
}
