declare var Chart: any

const chartColors = [
  '#3A4778',
  '#336677',
  '#786228',
  '#2E7862',
  '#784C40',
]

let chartIsLoaded = false
const chartFunctionQueue: Function[] = []
const loadChart = () => {
  const script = document.createElement('script')
  script.src =
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js'
  script.integrity =
    'sha512-Wt1bJGtlnMtGP0dqNFH1xlkLBNpEodaiQ8ZN5JLA5wpc1sUlk/O5uuOMNgvzddzkpvZ9GLyYNa8w2s7rqiTk5Q=='
  script.crossOrigin = 'anonymous'
  script.referrerPolicy = 'no-referrer'
  script.onload = () => {
    chartIsLoaded = true
    chartFunctionQueue.forEach((func) => func())
    chartFunctionQueue.length = 0
  }
  document.body.appendChild(script)
}
window.addEventListener('load', () => loadChart())

export const queueChartFunction = (func: Function) => {
  if (chartIsLoaded) {
    func()
  } else {
    chartFunctionQueue.push(func)
  }
}

export const buildTimestamp = (date: Date) => {
  const timestamp = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`

  return timestamp
}

export const createBarChart = (
  elementId: string,
  columnLabels: string[],
  dataLabel: string,
  chartData: number[],
  barLabelMutation: Function = (label: number) => label.toString(),
  isDarkTheme: boolean = false
) => {
  const element = document.getElementById(elementId)
  if (!element) {
    return
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas not supported')
  }

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: columnLabels,
      datasets: [
        {
          label: dataLabel,
          data: chartData,
          backgroundColor: chartColors,
          borderWidth: 1,
        },
      ],
    },
  })

  const showNumbers = () => {
    ctx.textAlign = 'center'
    ctx.fillStyle = isDarkTheme ? '#f0f0f0' : '#333'
    ctx.textBaseline = 'bottom'

    // Loop through each data in the datasets
    chart.data.datasets.forEach((dataset: any, i: number) => {
      var meta = chart.getDatasetMeta(i)
      meta.data.forEach(function (bar: any, index: number) {
        var data = barLabelMutation(dataset.data[index])
        ctx.fillText(data, bar.x, bar.y)
      })
    })
  }

  chart.options = {
    responsive: true,
    events: [],
    tooltips: {
      mode: 'point',
    },
    animation: {
      onProgress: showNumbers,
      onComplete: showNumbers,
    },
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkTheme ? '#f0f0f0' : '#333',
        },
      },
      x: {
        ticks: {
          color: isDarkTheme ? '#f0f0f0' : '#333',
        },
      },
    },
  }

  // Show the chart
  element.innerHTML = ''
  element.appendChild(canvas)
}

export const createDoughnutChart = (
  elementId: string,
  segmentLabels: string[],
  dataLabel: string,
  chartData: number[],
  isDarkTheme: boolean = false
) => {
  const element = document.getElementById(elementId)
  if (!element) {
    return
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas not supported')
  }

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: segmentLabels,
      datasets: [
        {
          label: dataLabel,
          data: chartData,
          backgroundColor: chartColors,
          borderWidth: 1,
        },
      ],
    },
  })

  chart.options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkTheme ? '#f0f0f0' : '#333',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.formattedValue}%`
          },
        },
      },
    },
  }

  // Show the chart
  element.innerHTML = ''
  element.appendChild(canvas)
}

export const createPieChart = (
  elementId: string,
  segmentLabels: string[],
  dataLabel: string,
  chartData: number[],
  isDarkTheme: boolean = false
) => {
  const element = document.getElementById(elementId)
  if (!element) {
    return
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas not supported')
  }

  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: segmentLabels,
      datasets: [
        {
          label: dataLabel,
          data: chartData,
          backgroundColor: chartColors,
          borderWidth: 1,
        },
      ],
    },
  })

  chart.options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkTheme ? '#f0f0f0' : '#333',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.formattedValue}%`
          },
        },
      },
    },
  }

  // Show the chart
  element.innerHTML = ''
  element.appendChild(canvas)
}