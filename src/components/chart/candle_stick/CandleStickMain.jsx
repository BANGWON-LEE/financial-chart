import { Chart } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'

export default function CandleStickMain(props) {
  const { data, options, width, height } = props

  return (
    <div style={{ height: height || 400 }}>
      {/* 부모 div 높이 지정 */}
      <Chart
        key={Date.now()}
        type="candlestick"
        data={data}
        // options={{
        //   ...options,
        //   maintainAspectRatio: false,
        // }}
        options={options}
        width={width}
        height={height}
      />
    </div>
  )
}
