import { getStorage } from '../common/common'
import {
  initialBarThickness,
  initialMaxTicksLimit,
} from '../common/initialStyle'
import { colorArr } from '../style/styleElement'

export function setStackBarData(data, styleState, timePropertyName) {
  const labels = data[timePropertyName]

  const dataTitle = Object.keys(data)
  const notLabelTitleArr = dataTitle.filter(
    el => el.toString() !== timePropertyName
  )

  return {
    labels,
    datasets: notLabelTitleArr.map((line, index) => ({
      type: 'bar',
      label: line.toString(), //그래프 분류되는 항목
      data: data[line], //실제 그려지는 데이터(Y축 숫자)
      backgroundColor: styleState?.[index]?.backgroundColor, //마우스 호버시 나타나는 분류네모 표시 bg
      barThickness: styleState?.[index]?.barThickness,
    })),
  }
}

export function setInitialStackBarStyle(
  lineData,
  uniqueChartName,
  timePropertyName
) {
  const dataTitle = Object.keys(lineData)
  const notLabelTitleArr = dataTitle.filter(
    el => el.toString() !== timePropertyName
  )

  const styleArr = getStorage(uniqueChartName)

  const sizeLineData = Object.keys(notLabelTitleArr).length // time을 제외한 속성의 개수
  const styleStateObjArr = Array.from({ length: sizeLineData }, (_, index) => ({
    id: 'bar' + index,
    name: notLabelTitleArr[index],
    backgroundColor: styleArr?.[index]?.backgroundColor || colorArr[index]?.rgb, //마우스 호버시 나타나는 분류네모 표시 bg
    barThickness: styleArr?.[index]?.barThickness || initialBarThickness,
    type: 'bar',
  }))

  return styleStateObjArr
}

export function setInitialOptionStackBar(uniqueChartName) {
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
        text: 'Chart.js stackBar Chart',
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

export function setOptionStackBarData(chartOptionState) {
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
        text: 'Chart.js stackBar Chart',
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
