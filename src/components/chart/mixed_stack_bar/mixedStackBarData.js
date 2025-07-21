import { getStorage } from '../common/common'
import {
  initialBarThickness,
  initialMaxTicksLimit,
} from '../common/initialStyle'
import { colorArr } from '../style/styleElement'

export function setMixedStackBarData(data, styleState, timePropertyName) {
  const labels = data[timePropertyName]

  const dataTitle = Object.keys(data)
  const notLabelTitleArr = dataTitle.filter(
    el => el.toString() !== timePropertyName
  )

  return {
    labels,
    datasets: notLabelTitleArr.map((line, index) => ({
      type: styleState?.[index]?.type,
      label: line.toString(), //그래프 분류되는 항목
      data: data[line], //실제 그려지는 데이터(Y축 숫자)
      borderColor: styleState?.[index]?.borderColor, //그래프 선 color
      backgroundColor: styleState?.[index]?.backgroundColor, //마우스 호버시 나타나는 분류네모 표시 bg
      borderWidth: styleState?.[index]?.borderWidth,
      borderRadius: styleState?.[index]?.borderRadius,
      barThickness: styleState?.[index]?.barThickness,
    })),
  }
}

export function setInitialMixedStackBarStyle(
  lineData,
  uniqueChartName,
  timePropertyName
) {
  const dataTitle = Object.keys(lineData)
  const notLabelTitleArr = dataTitle.filter(
    el => el.toString() !== timePropertyName
  )

  const sizeLineData = Object.keys(notLabelTitleArr).length // time을 제외한 속성의 개수

  const mixedTypeArr = Array.from(
    { length: sizeLineData - 1 },
    (_, index) => 'bar'
  )
  const mixedType = ['line', ...mixedTypeArr]

  const styleArr = getStorage(uniqueChartName)

  const styleStateObjArr = Array.from({ length: sizeLineData }, (_, index) => ({
    id: 'mixedStackBar' + index,
    name: notLabelTitleArr[index],
    borderColor: styleArr?.[index]?.borderColor || colorArr[index]?.rgb, //그래프 선 color
    backgroundColor: styleArr?.[index]?.backgroundColor || colorArr[index]?.rgb, //마우스 호버시 나타나는 분류네모 표시 bg
    borderWidth: styleArr?.[index]?.borderWidth || 5,
    barThickness: styleArr?.[index]?.barThickness || initialBarThickness,
    borderRadius: 10,
    type: styleArr?.[index]?.type || mixedType[index],
  }))

  return styleStateObjArr
}

export function setInitialOptionMixedStackBar(uniqueChartName) {
  const optionUniqueChartName = uniqueChartName + 'Option'
  const styleArr = getStorage(optionUniqueChartName)

  const optionMaxTicksLimit = styleArr?.scales.x.ticks.maxTicksLimit
  const zoomOptions = {
    pan: {
      enabled: true,
      mode: 'x',
    },
    zoom: {
      wheel: {
        enabled: true,
      },
      pinch: {
        enabled: true,
      },
      mode: 'x',
    },
  }

  const options = {
    responsive: false,
    plugins: {
      zoom: zoomOptions,
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        position: 'top',
        text: 'Chart.js mixedStackBar Chart',
      },
    },
    scales: {
      x: {
        stacked: true,
        border: {
          dash: [7, 9],
        },
        ticks: {
          maxTicksLimit: optionMaxTicksLimit || initialMaxTicksLimit,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
  }

  return options
}

export function setOptionMixedStackBarData(chartOptionState) {
  const optionMaxTicksLimit = chartOptionState?.scales.x.ticks.maxTicksLimit

  const zoomOptions = {
    pan: {
      enabled: true,
      mode: 'x',
    },
    zoom: {
      wheel: {
        enabled: true,
      },
      pinch: {
        enabled: true,
      },
      mode: 'x',
    },
  }

  const options = {
    responsive: false,
    plugins: {
      zoom: zoomOptions,
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        position: 'top',
        text: 'Chart.js mixedStackBar Chart',
      },
    },
    scales: {
      x: {
        stacked: true,
        border: {
          dash: [7, 9],
        },
        ticks: {
          maxTicksLimit: optionMaxTicksLimit || initialMaxTicksLimit,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
  }

  return options
}
