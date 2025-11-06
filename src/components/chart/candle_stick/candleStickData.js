import { xaxisStore } from '../../../util/xaxisState'

export function setCandleStickData(data) {
  return {
    datasets: [
      {
        type: 'candlestick',
        label: 'BTC/USD',
        barThickness: 3,
        backgroundColors: {
          up: 'rgba(0, 194, 84, 1)', // Green for bullish candles (close > open)
          down: 'rgba(252, 34, 0, 1)', // Red for bearish candles (close < open)
          unchanged: 'rgba(143, 143, 143, 1)', // Gray for unchanged candles (close = open)
        },
        data: data.map(d => ({
          x: d.x,
          o: d.o,
          h: d.h,
          l: d.l,
          c: d.c,
        })),
      },
    ],
  }
}

/**
 * 캔들스틱 스타일 세팅: 트레이딩뷰 스타일 참고
 */
export function setInitialCandleStickStyle(
  lineData,
  uniqueChartName,
  timePropertyName
) {
  const dataTitle = Object.keys(lineData)
  const notLabelTitleArr = dataTitle.filter(
    el => el.toString() !== timePropertyName
  )

  // const styleArr = getStorage(uniqueChartName)

  const styleStateObjArr = notLabelTitleArr.map((label, index) => ({
    id: 'candleStick' + index,
    name: label,
    // borderColor: styleArr?.[index]?.borderColor || colorArr[index]?.rgb,
    // backgroundColor: styleArr?.[index]?.backgroundColor || colorArr[index]?.rgb,
    type: 'candlestick',
  }))

  return styleStateObjArr
}

/**
 * 캔들스틱 차트 옵션 세팅
 */

export function setInitialOptionCandleStick() {
  //   const optionUniqueChartName = uniqueChartName + 'Option'
  //   const styleArr = getStorage(optionUniqueChartName)

  //   const optionMaxTicksLimit = styleArr?.scales?.x?.ticks?.maxTicksLimit

  const zoomOptions = {
    pan: {
      enabled: true,
      mode: 'x',
      onPan: ({ chart }) => {
        // console.log('chart pan', chart)
      },
    },
    zoom: {
      wheel: { enabled: true },
      pinch: { enabled: true },

      mode: 'x',
    },
  }

  const options = {
    parsing: false,
    responsive: false,
    maintainAspectRatio: true,
    plugins: {
      zoom: zoomOptions,
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: ctx => {
            const ohlc = ctx.raw
            return `O: ${ohlc.o} H: ${ohlc.h} L: ${ohlc.l} C: ${ohlc.c}`
          },
        },
      },
    },
    animation: false,
    scales: {
      x: {
        // display: true,
        type: 'time',
        time: {
          parser: 'yyyy-MM-dd HH:mm:ss', // date-fns 형식
          tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
          unit: 'second', // 초 단위까지
        },
        ticks: {
          autoSkip: false,
          maxTicksLimit: 20,
        },
        grid: {
          color: '#e0e3eb',
        },
      },
      y: {
        // display: true,

        beginAtZero: false,
        grid: {
          color: '#e0e3eb',
        },
      },
    },
  }

  return options
}

/**
 * 캔들스틱 옵션 재설정 (심플)
 */

const xaxis = xaxisStore()
export function setOptionCandleStickData() {
  // let rangeNum = 480
  const zoomOptions = {
    pan: {
      enabled: true,
      mode: 'x',

      onPan: ({ chart }) => {
        const myEvent = new CustomEvent('ChartEvent', {
          detail: {
            focusDetail: { min: chart.scales.x.min, max: chart.scales.x.max },
          },
        })

        document.dispatchEvent(myEvent)
        // console.log('이동 중...', chart.scales.x.min, chart.scales.x.max)
      },
    },
    zoom: {
      wheel: { enabled: true },
      pinch: { enabled: true },
      mode: 'x',
      speed: 5,
      threshold: 5,
      onZoomStart: ({ chart }) => {
        // console.log('zoomChar', chart)
        if (xaxis.getX() >= -30) return false
        const myEvent = new CustomEvent('ChartEvent', {
          detail: {
            focusDate: { start: chart.scales.x.min },
          },
        })
        document.dispatchEvent(myEvent)
      },
    },
  }

  const options = {
    responsive: false,
    plugins: {
      zoom: zoomOptions,
      legend: { position: 'bottom' },
      tooltip: {
        enabled: true,
        callbacks: {
          label: ctx => {
            const ohlc = ctx.raw
            return `O: ${ohlc.o} H: ${ohlc.h} L: ${ohlc.l} C: ${ohlc.c}`
          },
        },
      },
      mode: 'x',
    },
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'yyyy-MM-dd HH:mm:ss', // date-fns 형식
          tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
          unit: 'second', // 분 단위까지
        },
        ticks: {
          autoSkip: true,
          stepSize: 0.85,
          maxTicksLimit: 13,
          callback: val => {
            // console.log('tick raw value:', val, typeof val)
            return new Date(val).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          },
        },
        grid: {
          color: '#e0e3eb',
        },
      },
      y: {
        beginAtZero: false,
        // min: 155200000,
        // max: 155480000,
        ticks: {
          stepSize: 40000,
        },
        grid: {
          color: '#e0e3eb',
        },
      },
    },
  }

  return options
}
