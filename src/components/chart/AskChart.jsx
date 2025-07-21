import Pipe from '../chart/Pipe'

export default function AskChart(props) {
  const { type, data, width, height, uniqueChartName, timePropertyName } = props

  // console.log('ddd', data)

  return (
    <Pipe
      type={type}
      data={data}
      width={width}
      height={height}
      uniqueChartName={uniqueChartName}
      timePropertyName={timePropertyName}
    />
  )
}
