import { BASE_API_URL } from './index.js'
import {
  createBarChart,
  // createDoughnutChart,
  createPieChart,
  queueChartFunction,
} from './chartUtil.js'

interface SurveyResult {
  age: string
  reside: string
  showsPerYear: string
  covidConcern: number
  shopTkts: string
  date: Date
  noob: string
}

const getSurveyResults = async (
  days: number = 7
): Promise<SurveyResult[]> => {
  const result = await (
    await fetch(`${BASE_API_URL}/survey/results?days=${days}`)
  ).json()
  return result.data
}

interface SurveyResultsElementIds {
  ageRanges?: string
  residences?: string
  showsPerYear?: string
  covidConcern?: string
  tktsDiscovery?: string
  isFirstShow?: string
}
export const showSurveyResults = async (
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
    isFirstShow,
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

  if (isFirstShow) {
    showIsFirstShow(isFirstShow, data, isDarkTheme)
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

  // queueChartFunction(() =>
  //   createDoughnutChart(
  //     elementId,
  //     segmentLabels,
  //     dataLabel,
  //     chartData,
  //     isDarkTheme
  //   )
  // )
  queueChartFunction(() =>
    createBarChart(
      elementId,
      segmentLabels,
      dataLabel,
      chartData,
      (a: string) => `${a}%`,
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

const showIsFirstShow = (
  elementId: string,
  data: SurveyResult[],
  isDarkTheme: boolean = false
) => {
  const formatted = data.reduce((map, result) => {
    if (!map[result.noob]) {
      map[result.noob] = 0
    }
    map[result.noob]++

    return map
  }, {} as Record<string, number>)

  Object.keys(formatted).forEach((key: string) => {
    formatted[key] = parseInt(
      ((formatted[key] / data.length) * 100).toString()
    )
  })

  const segmentLabels = Object.keys(formatted)
  const dataLabel = "If this is a TKTS Patron's first show"
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
  // queueChartFunction(() =>
  //   createBarChart(
  //     elementId,
  //     segmentLabels,
  //     dataLabel,
  //     chartData,
  //     (a: string) => `${a}%`,
  //     isDarkTheme,
  //     true
  //   )
  // )
}
