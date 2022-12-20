declare var Chart: any

// const chartColors = [
//   // '#3A4778',
//   // '#336677',
//   // '#786228',
//   // '#2E7862',
//   // '#784C40',
// ]
const chartColors = [
  'rgba(255, 99, 132)',
  // 'rgba(54, 162, 235)',
  'rgba(0, 84, 219)',
  'rgba(255, 206, 86)',
  'rgba(75, 192, 192)',
  'rgba(153, 102, 255)',
  'rgba(255, 159, 64)',
]
const borderColors = [
  'rgba(255, 99, 132, 1)',
  // 'rgba(54, 162, 235, 1)',
  'rgba(0, 84, 219)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
]

let chartIsLoaded = false
let chartIsLoading = false
const chartFunctionQueue: Function[] = []
const loadChart = () => {
  if (chartIsLoading) {
    return
  } else {
    chartIsLoading = true
  }
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

export const queueChartFunction = (func: Function) => {
  loadChart()
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
  isDarkTheme: boolean = false,
  horizontal: boolean = false
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
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    },
  })

  const showNumbers = () => {
    if (!horizontal) {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
    } else {
      ctx.textBaseline = 'middle'
    }
    ctx.fillStyle = isDarkTheme ? '#f0f0f0' : '#333'

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
    indexAxis: horizontal ? 'y' : 'x',
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

export const createLineChart = (
  elementId: string,
  columnLabels: string[],
  dataLabel: string,
  chartData: number[],
  barLabelMutation: Function = (label: number) => label.toString(),
  isDarkTheme: boolean = false,
  horizontal: boolean = false
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
    type: 'line',
    data: {
      labels: columnLabels,
      datasets: [
        {
          label: dataLabel,
          data: chartData,
          backgroundColor: chartColors,
          // borderColor: borderColors,
          borderColor: isDarkTheme ? ['#ccc'] : undefined,
          borderWidth: 1,
        },
      ],
    },
  })

  const showNumbers = () => {
    if (!horizontal) {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
    } else {
      ctx.textBaseline = 'middle'
    }
    ctx.fillStyle = isDarkTheme ? '#f0f0f0' : '#333'

    // Loop through each data in the datasets
    chart.data.datasets.forEach((dataset: any, i: number) => {
      var meta = chart.getDatasetMeta(i)
      meta.data.forEach(function (bar: any, index: number) {
        var data = barLabelMutation(dataset.data[index])
        ctx.fillText(data, bar.x, bar.y - 5)
      })
    })
  }

  chart.options = {
    responsive: true,
    indexAxis: horizontal ? 'y' : 'x',
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
        max: chartData.reduce((max, item) => {
          const rounded = Math.ceil(item / 50) * 50 + 50
          if (rounded > max) {
            return rounded
          }
          return max
        }, 0),
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
          borderColor: borderColors,
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
  isDarkTheme: boolean = false,
  legendPosition: string = 'top'
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
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    },
  })

  chart.options = {
    responsive: true,
    plugins: {
      legend: {
        position: legendPosition,
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
