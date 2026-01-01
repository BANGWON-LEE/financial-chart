import {
  CandlestickController,
  CandlestickElement,
} from 'chartjs-chart-financial'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  registerables,
} from 'chart.js'

ChartJS.register(
  ...registerables,
  CandlestickController,
  CandlestickElement,
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
  setOptionCandleStickData,
} from './candle_stick/candleStickData'
import CandleStickMain from './candle_stick/CandleStickMain'
import { getChartInitialStyle, getChartInitialOption } from '../../util/chartConfig'

export default function Pipe(props) {
  const {
    type,
    data,
    width,
    height,
    uniqueChartName,
    timePropertyName,
    chartRef,
  } = props

  const [styleState, setStyleState] = useState(
    getChartInitialStyle(type, data, uniqueChartName, timePropertyName)
  )

  const [chartOptionState, setChartOptionState] = useState(
    getChartInitialOption(type, uniqueChartName)
  )

  const resultCandleStickData = setCandleStickData(
    data,
    styleState,
    timePropertyName
  )

  const resultCandleStickOptiopnData = setOptionCandleStickData(chartOptionState)

  const [openCustomFilterModalState, setOpenCustomFilterModalState] =
    useState(false)

  function handleOpenStyleFilterModal() {
    setOpenCustomFilterModalState(!openCustomFilterModalState)
  }

  const renderChart = () => {
    if (type === 'candlestick') {
      return (
        <CandleStickMain
          data={resultCandleStickData}
          options={resultCandleStickOptiopnData}
          width={width}
          height={height}
          chartRef={chartRef}
        />
      )
    }

    return <div>차트를 선택해주세요</div>
  }

  return (
    <>
      {renderChart()}
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
