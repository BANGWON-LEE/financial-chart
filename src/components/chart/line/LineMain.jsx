import { Chart } from 'react-chartjs-2'
// import zoomPlugin from 'chartjs-plugin-zoom'
// import { initialMaxTicksLimit } from '../common/initialStyle'

export default function LineMain(props) {
  const { data, options, width, height } = props

  console.log('lineD', data)

  // const zoomOptions = {
  //   pan: {
  //     enabled: true,
  //     mode: 'x',
  //   },
  //   zoom: {
  //     wheel: {
  //       enabled: true,
  //     },
  //     pinch: {
  //       enabled: true,
  //     },
  //     mode: 'x',
  //   },
  // }

  // const options = {
  //   responsive: false,
  //   plugins: {
  //     zoom: zoomOptions,
  //     legend: {
  //       position: 'bottom',
  //     },
  //     title: {
  //       display: true,
  //       position: 'top',
  //       text: 'Chart.js Line Chart',
  //     },
  //   },
  //   scales: {
  //     x: {
  //       border: {
  //         dash: [7, 9],
  //       },
  //       ticks: {
  //         maxTicksLimit: initialMaxTicksLimit,
  //       },
  //     },
  //     y: {
  //       grid: {
  //         display: false,
  //       },
  //     },
  //   },
  // }

  return (
    <div>
      <div>
        <Chart data={data} options={options} width={width} height={height} />
      </div>
    </div>
  )
}
