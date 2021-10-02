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
  barLabelMutation: Function = (label: number) => label.toString()
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
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
  })

  chart.options = {
    events: [],
    animation: {
      duration: 1,
      onComplete: () => {
        ctx.textAlign = 'center'
        ctx.fillStyle = 'rgba(0, 0, 0, 1)'
        ctx.textBaseline = 'bottom'

        // Loop through each data in the datasets
        chart.data.datasets.forEach((dataset: any, i: number) => {
          var meta = chart.getDatasetMeta(i)
          meta.data.forEach(function (bar: any, index: number) {
            var data = barLabelMutation(dataset.data[index])
            ctx.fillText(data, bar.x, bar.y)
          })
        })
      },
    },
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        beginAtZero: true,
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
  chartData: number[]
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
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
  })

  chart.options = {
    responsive: true,
    plugins: {
      legend: 'top',
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
  chartData: number[]
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
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
  })

  chart.options = {
    responsive: true,
    plugins: {
      legend: 'top',
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

window.getWeeklyAverageHotelPrices = async (elementId: string) => {
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
          barLabelMutation
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
  trailingDays: number = 7
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
    showAgeRanges(ageRanges, data)
  }

  if (residences) {
    showResidences(residences, data)
  }

  if (showsPerYear) {
    showShowsPerYear(showsPerYear, data)
  }

  if (covidConcern) {
    showCovidConcern(covidConcern, data)
  }

  if (tktsDiscovery) {
    showTktsDiscovery(tktsDiscovery, data)
  }
}

const showAgeRanges = (elementId: string, data: SurveyResult[]) => {
  const formatted = data.reduce((map, result) => {
    if (!map[result.age]) {
      map[result.age] = 0
    }
    map[result.age]++

    return map
  }, {} as Record<string, number>)

  const columnLabels = Object.keys(formatted)
  const dataLabel = 'Age ranges of TKTS patrons'
  const chartData = Object.values(formatted)

  queueChartFunction(() =>
    createBarChart(elementId, columnLabels, dataLabel, chartData)
  )
}

const showResidences = (elementId: string, data: SurveyResult[]) => {
  const formatted = data.reduce((map, result) => {
    if (!map[result.reside]) {
      map[result.reside] = 0
    }
    map[result.reside]++

    return map
  }, {} as Record<string, number>)

  const segmentLabels = Object.keys(formatted)
  const dataLabel = 'Residences of TKTS patrons'
  const chartData = Object.values(formatted)

  queueChartFunction(() =>
    createDoughnutChart(
      elementId,
      segmentLabels,
      dataLabel,
      chartData
    )
  )
}

const showShowsPerYear = (
  elementId: string,
  data: SurveyResult[]
) => {
  const formatted = data.reduce((map, result) => {
    if (!map[result.showsPerYear]) {
      map[result.showsPerYear] = 0
    }
    map[result.showsPerYear]++

    return map
  }, {} as Record<string, number>)

  const segmentLabels = Object.keys(formatted)
  const dataLabel = 'Shows seen per year by TKTS patrons'
  const chartData = Object.values(formatted)

  queueChartFunction(() =>
    createPieChart(elementId, segmentLabels, dataLabel, chartData)
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
    // element.style.color = `rgb(${255 - (value / 10) * 255}, ${
    //   (value / 10) * 255
    // }, 0)`
  }
}

const showTktsDiscovery = (
  elementId: string,
  data: SurveyResult[]
) => {
  const formatted = data.reduce((map, result) => {
    if (!map[result.shopTkts]) {
      map[result.shopTkts] = 0
    }
    map[result.shopTkts]++

    return map
  }, {} as Record<string, number>)

  const segmentLabels = Object.keys(formatted)
  const dataLabel = 'How TKTS patrons discovered TKTS'
  const chartData = Object.values(formatted)

  queueChartFunction(() =>
    createPieChart(elementId, segmentLabels, dataLabel, chartData)
  )
}
