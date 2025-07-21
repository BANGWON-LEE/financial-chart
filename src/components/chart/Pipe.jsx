import {
  CandlestickController,
  CandlestickElement,
} from 'chartjs-chart-financial'
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  BarController,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  registerables,
} from 'chart.js'

ChartJS.register(
  ...registerables,
  CandlestickController,
  CandlestickElement,
  LineController,
  LineElement,
  BarController,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
)
import zoomPlugin from 'chartjs-plugin-zoom'

import LineMain from './line/LineMain'
import { useState } from 'react'
import {
  setInitialLineStyle,
  setInitialOptionLine,
  setLineData,
  setOptionLineData,
} from './line/lineData'
import StyleCustomFilter from './StyleCustomFilter'
import {
  setInitialMixedStyle,
  setInitialOptionMixed,
  setMixedData,
  setOptionMixedData,
} from './mixied/mixedData'
import MixedMain from './mixied/mixedMain'
import BarMain from './bar/BarMain'
import {
  setBarData,
  setInitialBarStyle,
  setInitialOptionBar,
  setOptionBarData,
} from './bar/barData'
import StackBarMain from './stack_bar/StackBarMain'
import {
  setInitialOptionStackBar,
  setInitialStackBarStyle,
  setOptionStackBarData,
  setStackBarData,
} from './stack_bar/stackBarData'
import {
  setInitialMixedStackBarStyle,
  setInitialOptionMixedStackBar,
  setMixedStackBarData,
  setOptionMixedStackBarData,
} from './mixed_stack_bar/mixedStackBarData'
import MixedStackBarMain from './mixed_stack_bar/mixedStackBarMain'
import {
  setCandleStickData,
  setInitialCandleStickStyle,
  setInitialOptionCandleStick,
  setOptionCandleStickData,
} from './candle_stick/candleStickData'
import CandleStickMain from './candle_stick/CandleStickMain'

export default function Pipe(props) {
  const { type, data, width, height, uniqueChartName, timePropertyName } = props

  // console.log('pipe D', data)

  const styleDataArr = function () {
    // 타입에 결정되며, 초기 환경을 설정해주는 함수의 리턴값을 가져옴
    switch (type) {
      case 'line':
        return setInitialLineStyle(data, uniqueChartName, timePropertyName)
      case 'mixed':
        return setInitialMixedStyle(data, uniqueChartName, timePropertyName)
      case 'bar':
        return setInitialBarStyle(data, uniqueChartName, timePropertyName)
      case 'stackBar':
        return setInitialStackBarStyle(data, uniqueChartName, timePropertyName)
      case 'mixedStackBar':
        return setInitialMixedStackBarStyle(
          data,
          uniqueChartName,
          timePropertyName
        )
      case 'candlestick':
        return setInitialCandleStickStyle(
          data,
          uniqueChartName,
          timePropertyName
        )
    }
  }

  const optionDataArr = function () {
    // 타입에 결정되며, 초기 환경을 설정해주는 함수의 리턴값을 가져옴
    switch (type) {
      case 'line':
        return setInitialOptionLine(uniqueChartName)
      case 'mixed':
        return setInitialOptionMixed(uniqueChartName)
      case 'bar':
        return setInitialOptionBar(uniqueChartName)
      case 'stackBar':
        return setInitialOptionStackBar(uniqueChartName)
      case 'mixedStackBar':
        return setInitialOptionMixedStackBar(uniqueChartName)
      case 'candlestick':
        return setInitialOptionCandleStick(uniqueChartName)
    }
  }

  const [styleState, setStyleState] = useState(styleDataArr()) // 위에서 할당한 함수 리턴값을 초기값으로 잡아준다.

  // const initialOptionData = setInitialOption(uniqueChartName)

  // StyleCustomFilter 컴포넌트에서 수정 및 변경한 값([styleState, setStyleState]) 및 차트에 들어 갈 값을 아래 코드, 변수들에 할당한다.
  // 그리고 chartUi의 각 컴포넌트에 데이터로 넘겨준다.
  const [chartOptionState, setChartOptionState] = useState(optionDataArr())
  const resultLineData = setLineData(data, styleState, timePropertyName)
  const resultLineOptionData = setOptionLineData(chartOptionState)
  const resultMixedData = setMixedData(data, styleState, timePropertyName)
  const resultMixedOptionData = setOptionMixedData(chartOptionState)
  const resultBarData = setBarData(data, styleState, timePropertyName)
  const resultBarOptionData = setOptionBarData(chartOptionState)
  const resultStackBarData = setStackBarData(data, styleState, timePropertyName)
  const resultStackBarOptionData = setOptionStackBarData(chartOptionState)
  const resultMixedStackBarData = setMixedStackBarData(
    data,
    styleState,
    timePropertyName
  )
  const resultMixedStackBarOptionData =
    setOptionMixedStackBarData(chartOptionState)

  const resultCandleStickData = setCandleStickData(
    data,
    styleState,
    timePropertyName
  )

  console.log('resultCandleStickData', resultCandleStickData)
  // console.log('resultCandleStickData', resultCandleStickData)

  const resultCandleStickOptiopnData =
    setOptionCandleStickData(chartOptionState)

  // 차트의 옵션에 관한 설정을 담은 state

  const [openCustomFilterModalState, setOpenCustomFilterModalState] =
    useState(false)

  function handleOpenStyleFilterModal() {
    setOpenCustomFilterModalState(!openCustomFilterModalState)
  }

  const chartUi = function () {
    // 조건에 따라 차트 컴포넌트를 return 해주는 함수 표현식
    switch (type) {
      case 'line':
        return (
          <LineMain
            data={resultLineData}
            options={resultLineOptionData}
            width={width}
            height={height}
          />
        )

      case 'mixed':
        return (
          <MixedMain
            data={resultMixedData}
            options={resultMixedOptionData}
            width={width}
            height={height}
          />
        )
      case 'bar':
        return (
          <BarMain
            data={resultBarData}
            options={resultBarOptionData}
            width={width}
            height={height}
          />
        )
      case 'stackBar':
        return (
          <StackBarMain
            data={resultStackBarData}
            options={resultStackBarOptionData}
            width={width}
            height={height}
          />
        )
      case 'mixedStackBar':
        return (
          <MixedStackBarMain
            data={resultMixedStackBarData}
            options={resultMixedStackBarOptionData}
            width={width}
            height={height}
          />
        )
      case 'candlestick':
        return (
          <>
            {/* <CandleStickMain
              data={resultCandleStickData}
              options={resultCandleStickOptiopnData}
              width={width}
              height={height}
            /> */}
            <div>23</div>
            {/* {resultCandleStickData.datasets[0]?.data?.length > 0 && ( */}
            <CandleStickMain
              data={resultCandleStickData}
              options={resultCandleStickOptiopnData}
              width={width}
              height={height}
            />
            {/* )} */}
          </>
        )

      default:
        return <div>차트를 선택해주세요</div>
    }
  }

  return (
    <>
      <button onClick={() => handleOpenStyleFilterModal()}>open</button>
      {chartUi()}
      {openCustomFilterModalState && (
        <StyleCustomFilter
          closeModalBtn={handleOpenStyleFilterModal}
          styleState={styleState}
          chartOptionState={chartOptionState}
          setStyleState={setStyleState}
          setChartOptionState={setChartOptionState}
          type={type}
          uniqueChartName={uniqueChartName}
        />
      )}
    </>
  )
}
