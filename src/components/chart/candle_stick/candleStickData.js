// import { formatTimestamp } from '../../../util/date'
// import { getStorage } from '../common/common'
// import { initialMaxTicksLimit } from '../common/initialStyle'
// import { colorArr } from '../style/styleElement'

/**
 * 데이터 세팅: candlestick 전용
 */
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
          unit: 'minute', // 초 단위까지
        },
        ticks: {
          autoSkip: false,
          maxTicksLimit: 20,
        },
        grid: {
          color: '#e0e3eb',
        },
        suggestedMin: new Date() - 480000,
        suggestedMax: new Date(),
      },
      y: {
        // display: true,

        beginAtZero: false,
        grid: {
          color: '#e0e3eb',
        },
      },
    },
    // elements: {
    //   candlestick: {
    //     upColor: '#00FF00',
    //     downColor: '#FF0000',
    //     unchangedColor: '#999999',
    //     borderColor: 'black',
    //     borderWidth: 2,
    //   },
    // },
  }

  return options
}

/**
 * 캔들스틱 옵션 재설정 (심플)
 */
// export let chartEvent = new Event('ChartEvent')
// export let myEvent
export function setOptionCandleStickData() {
  const zoomOptions = {
    pan: {
      enabled: true,
      mode: 'x',

      onPan: ({ chart }) => {
        const myEvent = new CustomEvent('ChartEvent', {
          detail: {
            focusDetail: { min: chart.scales.x.min, max: chart.scales.x.max },
            // toPast: true,
          },
        })
        console.log('chart pan', chart)
        document.dispatchEvent(myEvent)
        // console.log('이동 중...', chart.scales.x.min, chart.scales.x.max)
      },
    },
    zoom: {
      wheel: { enabled: true },
      pinch: { enabled: true },
      mode: 'x',
    },
  }

  const options = {
    responsive: true,
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
    },
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'yyyy-MM-dd HH:mm:ss', // date-fns 형식
          tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
          unit: 'minute', // 분 단위까지
        },
        ticks: {
          autoSkip: true,
          stepSize: 0.25,
          maxTicksLimit: 13,
        },
        grid: {
          color: '#e0e3eb',
        },
      },
      y: {
        beginAtZero: false,

        grid: {
          color: '#e0e3eb',
        },
      },
    },
  }

  return options
}
