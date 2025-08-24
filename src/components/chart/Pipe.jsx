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

import { useState } from 'react'
import StyleCustomFilter from './StyleCustomFilter'
import {
  setCandleStickData,
  setInitialCandleStickStyle,
  setInitialOptionCandleStick,
  setOptionCandleStickData,
} from './candle_stick/candleStickData'
import CandleStickMain from './candle_stick/CandleStickMain'
// import { moveWheelChartArea } from './common/common'

export default function Pipe(props) {
  const { type, data, width, height, uniqueChartName, timePropertyName } = props

  // console.log('pipe D', data)

  const styleDataArr = function () {
    // 타입에 결정되며, 초기 환경을 설정해주는 함수의 리턴값을 가져옴
    switch (type) {
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
      case 'candlestick':
        return setInitialOptionCandleStick(uniqueChartName)
    }
  }

  const [styleState, setStyleState] = useState(styleDataArr()) // 위에서 할당한 함수 리턴값을 초기값으로 잡아준다.

  // const initialOptionData = setInitialOption(uniqueChartName)

  // StyleCustomFilter 컴포넌트에서 수정 및 변경한 값([styleState, setStyleState]) 및 차트에 들어 갈 값을 아래 코드, 변수들에 할당한다.
  // 그리고 chartUi의 각 컴포넌트에 데이터로 넘겨준다.
  const [chartOptionState, setChartOptionState] = useState(optionDataArr())

  const resultCandleStickData = setCandleStickData(
    data,
    styleState,
    timePropertyName
  )

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
      case 'candlestick':
        return (
          <>
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
