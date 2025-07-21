import { Chart } from 'react-chartjs-2'

export default function MixedMain(props) {
  const { data, options, width, height } = props

  return (
    <div>
      <div>
        <Chart data={data} options={options} width={width} height={height} />
      </div>
    </div>
  )
}
