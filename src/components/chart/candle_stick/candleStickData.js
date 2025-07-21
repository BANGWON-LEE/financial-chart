// import { formatTimestamp } from '../../../util/date'
import { getStorage } from '../common/common'
// import { initialMaxTicksLimit } from '../common/initialStyle'
import { colorArr } from '../style/styleElement'

/**
 * 데이터 세팅: candlestick 전용
 */
export function setCandleStickData(data) {
  //   console.log(
  //     'candleD',
  //     data.map(d => formatTimestamp(d.x))
  //   )

  //   const labels = data.map(d => d.x)

  console.log('labelsCC', data)
  return {
    // labels: data.map(d => d.x),
    // labels,
    // labesl: 'www',
    datasets: [
      {
        type: 'candlestick',
        label: 'BTC/USD',
        // upColor: '#00FF00', // 상승 초록
        // downColor: '#FF0000', // 하락 빨강
        // unchangedColor: '#999999', // 변동 없음 회색
        // borderColor: 'black', // 캔들 외곽선
        // borderWidth: 1,
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

  const styleArr = getStorage(uniqueChartName)

  const styleStateObjArr = notLabelTitleArr.map((label, index) => ({
    id: 'candleStick' + index,
    name: label,
    borderColor: styleArr?.[index]?.borderColor || colorArr[index]?.rgb,
    backgroundColor: styleArr?.[index]?.backgroundColor || colorArr[index]?.rgb,
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
    },
    zoom: {
      wheel: { enabled: true },
      pinch: { enabled: true },
      mode: 'x',
    },
  }

  const options = {
    parsing: false,
    responsive: true,
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
          autoSkip: true,
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
    elements: {
      candlestick: {
        upColor: '#00FF00',
        downColor: '#FF0000',
        unchangedColor: '#999999',
        borderColor: 'black',
        // borderWidth: 1,
      },
    },
  }

  return options
}

/**
 * 캔들스틱 옵션 재설정 (심플)
 */
export function setOptionCandleStickData() {
  const zoomOptions = {
    pan: { enabled: true, mode: 'x' },
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
          unit: 'second', // 초 단위까지
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
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
