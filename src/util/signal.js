const signalMap = new Map()
signalMap.set('ChartEvent', true)

export function outerChartRealSignal() {
  return {
    update: (event, status) => signalMap.set(event, status),
    get: event => signalMap.get(event),
    isOn: event => signalMap.get(event) === true,
  }
}
