import { BASE_API_URL } from './index.js'
import {
  buildTimestamp,
  createBarChart,
  queueChartFunction,
} from './chartUtil.js'

interface Price {
  price: number
  date: string
  updated: string
}

export const getTodaysAverageHotelPrice = async (
  elementId: string
) => {
  fetch(`${BASE_API_URL}/hotel-prices/day`)
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

export const getWeeklyAverageHotelPrices = async (
  elementId: string,
  isDarkTheme: boolean = false
) => {
  fetch(`${BASE_API_URL}/hotel-prices/week`)
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
