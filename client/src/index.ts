declare var Chart: any
declare var getTodaysAverageHotelPrice: Function
declare var getWeeklyAverageHotelPrices: Function
declare var showSurveyResults: Function

interface Price {
  price: number
  date: string
  updated: string
}
const BASE_API_URL = 'https://hpf.dragonflyer.live/api/v1'
// const BASE_API_URL = 'http://localhost:7777/api/v1'
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

const queueChartFunction = (func: Function) => {
  if (chartIsLoaded) {
    func()
  } else {
    chartFunctionQueue.push(func)
  }
}

const buildTimestamp = (date: Date) => {
  const timestamp = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`

  return timestamp
}

const createBarChart = (
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

  const chart = new window.Chart(ctx, {
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

const createDoughnutChart = (
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

  const chart = new window.Chart(ctx, {
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

const createPieChart = (
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

  const chart = new window.Chart(ctx, {
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

window.getTodaysAverageHotelPrice = async (elementId: string) => {
  fetch(`${BASE_API_URL}/day`)
    .then((res) => res.json())
    .then((res) => {
      const price: Price = res.price

      const timestamp = buildTimestamp(new Date(price.updated))
      const priceText = `$${(price.price as number).toFixed(
        2
      )} as of ${timestamp}`
      const element = document.getElementById(elementId)
      if (element) {
        element.innerText = priceText
      }
    })
}

window.getWeeklyAverageHotelPrices = async (
  elementId: string,
  isDarkTheme: boolean = false
) => {
  fetch(`${BASE_API_URL}/week`)
    .then((res) => res.json())
    .then((res) => {
      const timestamp = buildTimestamp(
        new Date(res.prices[res.prices.length - 1].updated)
      )
      const columnLabels = res.prices.map(
        (price: Price) => price.date
      )
      const dataLabel = `Average hotel prices near Times Square as of ${timestamp}`
      const data = res.prices.map((price: Price) =>
        price.price.toFixed(2)
      )
      const barLabelMutation = (label: number) => `$${label}`

      queueChartFunction(() =>
        createBarChart(
          elementId,
          columnLabels,
          dataLabel,
          data,
          barLabelMutation,
          isDarkTheme
        )
      )
    })
}

interface SurveyResult {
  age: string
  reside: string
  showsPerYear: string
  covidConcern: number
  shopTkts: string
  date: Date
}

const getSurveyResults = async (
  days: number = 7
): Promise<SurveyResult[]> => {
  const result = await (
    await fetch(`${BASE_API_URL}/survey-results?days=${days}`)
  ).json()
  return result.data
}

interface SurveyResultsElementIds {
  ageRanges?: string
  residences?: string
  showsPerYear?: string
  covidConcern?: string
  tktsDiscovery?: string
}
window.showSurveyResults = async (
  elementIds: SurveyResultsElementIds,
  trailingDays: number = 7,
  isDarkTheme: boolean = false
) => {
  const {
    ageRanges,
    residences,
    showsPerYear,
    covidConcern,
    tktsDiscovery,
  } = elementIds
  const data = await getSurveyResults(trailingDays)

  if (ageRanges) {
    showAgeRanges(ageRanges, data, isDarkTheme)
  }

  if (residences) {
    showResidences(residences, data, isDarkTheme)
  }

  if (showsPerYear) {
    showShowsPerYear(showsPerYear, data, isDarkTheme)
  }

  if (covidConcern) {
    showCovidConcern(covidConcern, data)
  }

  if (tktsDiscovery) {
    showTktsDiscovery(tktsDiscovery, data, isDarkTheme)
  }
}

const showAgeRanges = (
  elementId: string,
  data: SurveyResult[],
  isDarkTheme: boolean = false
) => {
  const formatted = data.reduce((map, result) => {
    if (!map[result.age]) {
      map[result.age] = 0
    }
    map[result.age]++

    return map
  }, {} as Record<string, number>)

  Object.keys(formatted).forEach((key: string) => {
    formatted[key] = parseInt(
      ((formatted[key] / data.length) * 100).toString()
    )
  })

  const ordered = Object.keys(formatted)
    .sort()
    .reduce((obj, key) => {
      obj[key] = formatted[key]
      return obj
    }, {} as Record<string, number>)

  const columnLabels = Object.keys(ordered)
  const dataLabel = 'Age ranges of TKTS patrons'
  const chartData = Object.values(ordered)

  queueChartFunction(() =>
    createBarChart(
      elementId,
      columnLabels,
      dataLabel,
      chartData,
      (label: string) => `${label}%`,
      isDarkTheme
    )
  )
}

const showResidences = (
  elementId: string,
  data: SurveyResult[],
  isDarkTheme: boolean = false
) => {
  const formatted = data.reduce((map, result) => {
    if (!map[result.reside]) {
      map[result.reside] = 0
    }
    map[result.reside]++

    return map
  }, {} as Record<string, number>)

  Object.keys(formatted).forEach((key: string) => {
    formatted[key] = parseInt(
      ((formatted[key] / data.length) * 100).toString()
    )
  })

  const segmentLabels = Object.keys(formatted)
  const dataLabel = 'Residences of TKTS patrons'
  const chartData = Object.values(formatted)

  queueChartFunction(() =>
    createDoughnutChart(
      elementId,
      segmentLabels,
      dataLabel,
      chartData,
      isDarkTheme
    )
  )
}

const showShowsPerYear = (
  elementId: string,
  data: SurveyResult[],
  isDarkTheme: boolean = false
) => {
  const formatted = data.reduce((map, result) => {
    if (!map[result.showsPerYear]) {
      map[result.showsPerYear] = 0
    }
    map[result.showsPerYear]++

    return map
  }, {} as Record<string, number>)

  Object.keys(formatted).forEach((key: string) => {
    formatted[key] = parseInt(
      ((formatted[key] / data.length) * 100).toString()
    )
  })

  const segmentLabels = Object.keys(formatted)
  const dataLabel = 'Shows seen per year by TKTS patrons'
  const chartData = Object.values(formatted)

  queueChartFunction(() =>
    createPieChart(
      elementId,
      segmentLabels,
      dataLabel,
      chartData,
      isDarkTheme
    )
  )
}

const showCovidConcern = (
  elementId: string,
  data: SurveyResult[]
) => {
  const element = document.getElementById(elementId)
  if (element) {
    const value =
      data.reduce((total, item) => total + item.covidConcern, 0) /
      data.length

    element.innerHTML = value.toFixed(1).toString()
  }
}

const showTktsDiscovery = (
  elementId: string,
  data: SurveyResult[],
  isDarkTheme: boolean = false
) => {
  const formatted = data.reduce((map, result) => {
    if (!map[result.shopTkts]) {
      map[result.shopTkts] = 0
    }
    map[result.shopTkts]++

    return map
  }, {} as Record<string, number>)

  Object.keys(formatted).forEach((key: string) => {
    formatted[key] = parseInt(
      ((formatted[key] / data.length) * 100).toString()
    )
  })

  const segmentLabels = Object.keys(formatted)
  const dataLabel = 'How TKTS patrons discovered TKTS'
  const chartData = Object.values(formatted)

  queueChartFunction(() =>
    createPieChart(
      elementId,
      segmentLabels,
      dataLabel,
      chartData,
      isDarkTheme
    )
  )
}
