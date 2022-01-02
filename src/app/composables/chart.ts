import {
  registerables,
  Chart,
  ChartConfiguration,
  ChartType,
  ChartData,
} from 'chart.js'
import { onMounted } from 'vue'
import { PaymentCategory } from '../../types'
import { colors } from '../utils/colors'

export interface ChartOptions {
  ctx: () => HTMLCanvasElement
  labels: () => PaymentCategory[]
  data: () => number[]
}

export interface ChartComposables {
  updateChart: () => void
}

export const useChart = (options: ChartOptions): ChartComposables => {
  Chart.register(...registerables)
  let chart!: Chart

  const data: ChartData<ChartType, number[], string> = {
    labels: options.labels(),
    datasets: [
      {
        label: 'Dataset 1',
        data: options.data(),
        hoverOffset: 8,
        backgroundColor: options.labels().map((l) => colors[l]),
      },
    ],
  }

  const config: ChartConfiguration<ChartType, number[], string> = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          // position: 'top',
          // onClick: (event, item, legend) => {
          //   legend.chart.update()
          // },
        },
        title: {
          display: false,
        },
      },
    },
  }

  onMounted(() => {
    chart = new Chart<ChartType, number[], string>(options.ctx(), config)
  })

  return {
    updateChart: () => {
      if (chart) {
        const data = chart.data
        data.labels = options.labels()
        data.datasets[0].data = options.data()
        data.datasets[0].backgroundColor = options
          .labels()
          .map((l) => colors[l])
        chart.update()
      }
    },
  }
}
