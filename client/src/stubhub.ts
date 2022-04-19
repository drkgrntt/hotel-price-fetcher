import { BASE_API_URL } from './index.js'

interface Show {
  shId: number
  name: string
  date: Date
  venueId: number
  venueName: string
  minListPrice: number
  maxListPrice: number
  totalTickets: number
  totalListings: number
  updated: Date
}

export const showStubhubData = async (
  elementId: string,
  days: number = 30
) => {
  const element = document.getElementById(elementId)
  if (!element) {
    return
  }

  fetch(`${BASE_API_URL}/stubhub/data?days=${days}`)
    .then((res) => res.json())
    .then((res) => {
      const date = new Date()

      const filterByDate = (show: Show) => {
        const showTime = new Date(show.date)
        return showTime < date
      }

      date.setDate(date.getDate() + 3)
      const threeDayResults = res.data.filter(filterByDate)

      date.setDate(date.getDate() + 4)
      const sevenDayResults = res.data.filter(filterByDate)

      date.setDate(date.getDate() + 23)
      const thirtyDayResults = res.data.filter(filterByDate)

      const data: Record<string, any> = {}
      const setData = (key: number, show: Show) => {
        if (!data[show.name]) {
          data[show.name] = {
            3: [],
            7: [],
            30: [],
            venueName: show.venueName,
          }
        }
        data[show.name][key].push(show)
      }
      thirtyDayResults.forEach((show: Show) => setData(30, show))
      sevenDayResults.forEach((show: Show) => setData(7, show))
      threeDayResults.forEach((show: Show) => setData(3, show))

      const getTotal = (shows: Show[]) => {
        return shows.reduce(
          (sum: number, show: Show) => sum + show.totalTickets,
          0
        )
      }
      const getMinListPrice = (shows: Show[]) => {
        return shows
          .filter((show) => show.minListPrice)
          .reduce((minPrice: number, show: Show) => {
            return show.minListPrice && show.minListPrice < minPrice
              ? show.minListPrice
              : minPrice
          }, shows[0]?.minListPrice ?? 1000)
      }
      const getMaxListPrice = (shows: Show[]) => {
        return shows
          .filter((show) => show.maxListPrice)
          .reduce((maxPrice: number, show: Show) => {
            return show.maxListPrice > maxPrice
              ? show.maxListPrice
              : maxPrice
          }, shows[0]?.maxListPrice ?? 0)
      }

      const formattedData = Object.keys(data)
        .map((name: string) => {
          return {
            name,
            venueName: data[name].venueName,
            threeDaysOut: {
              totalTickets: getTotal(data[name][3]),
              minPrice: getMinListPrice(data[name][3]),
              maxPrice: getMaxListPrice(data[name][3]),
            },
            sevenDaysOut: {
              totalTickets: getTotal(data[name][7]),
              minPrice: getMinListPrice(data[name][7]),
              maxPrice: getMaxListPrice(data[name][7]),
            },
            thirtyDaysOut: {
              totalTickets: getTotal(data[name][30]),
              minPrice: getMinListPrice(data[name][30]),
              maxPrice: getMaxListPrice(data[name][30]),
            },
          }
        })
        .filter((show) => {
          return (
            show.threeDaysOut.totalTickets ||
            show.sevenDaysOut.totalTickets ||
            show.thirtyDaysOut.totalTickets
          )
        })
        .sort((a, b) => (a.name < b.name ? -1 : 1))

      element.innerHTML = ''

      const table = document.createElement('table')
      addAveragesToTable(
        table,
        threeDayResults,
        sevenDayResults,
        thirtyDayResults
      )
      addShowsToTable(table, formattedData)

      element.appendChild(table)
    })
}

const addAveragesToTable = (
  table: HTMLTableElement,
  threeDayResults: any,
  sevenDayResults: any,
  thirtyDayResults: any
) => {
  // Create table for averages
  const avgThead = document.createElement('thead')
  let tr = document.createElement('tr')

  let th = document.createElement('th')
  th.innerText = 'Broadway Ticket Price Range'
  tr.appendChild(th)

  th = document.createElement('th')
  th.innerText = '3 days out'
  tr.appendChild(th)

  th = document.createElement('th')
  th.innerText = '7 days out'
  tr.appendChild(th)

  th = document.createElement('th')
  th.innerText = '30 days out'
  tr.appendChild(th)

  avgThead.appendChild(tr)
  table.appendChild(avgThead)

  const avgTbody = document.createElement('tbody')

  tr = document.createElement('tr')
  let td = document.createElement('td')
  td.innerHTML = `<span class="stubhub-table-show-name">Average<br />Minimum Price / Maximum Price</span>`
  tr.appendChild(td)

  const getAverage = (
    shows: Show[],
    field: 'minListPrice' | 'maxListPrice'
  ) => {
    return (
      shows.reduce((total, show) => total + show[field], 0) /
      shows.length
    )
  }

  td = document.createElement('td')
  td.innerHTML = `Min: $${getAverage(
    threeDayResults.filter((show: Show) => show.minListPrice),
    'minListPrice'
  ).toFixed(2)}<br>Max: $${getAverage(
    threeDayResults.filter((show: Show) => show.maxListPrice),
    'maxListPrice'
  ).toFixed(2)}`
  tr.appendChild(td)

  td = document.createElement('td')
  td.innerHTML = `Min: $${getAverage(
    sevenDayResults.filter((show: Show) => show.minListPrice),
    'minListPrice'
  ).toFixed(2)}<br>Max: $${getAverage(
    sevenDayResults.filter((show: Show) => show.maxListPrice),
    'maxListPrice'
  ).toFixed(2)}`
  tr.appendChild(td)

  td = document.createElement('td')
  td.innerHTML = `Min: $${getAverage(
    thirtyDayResults.filter((show: Show) => show.minListPrice),
    'minListPrice'
  ).toFixed(2)}<br>Max: $${getAverage(
    thirtyDayResults.filter((show: Show) => show.maxListPrice),
    'maxListPrice'
  ).toFixed(2)}`
  tr.appendChild(td)

  avgTbody.appendChild(tr)
  table.appendChild(avgTbody)
}

const addShowsToTable = (
  table: HTMLTableElement,
  formattedData: any
) => {
  const thead = document.createElement('thead')
  let tr = document.createElement('tr')

  let th = document.createElement('th')
  th.innerText = 'Show'
  tr.appendChild(th)

  th = document.createElement('th')
  th.innerText = '3 days out'
  tr.appendChild(th)

  th = document.createElement('th')
  th.innerText = '7 days out'
  tr.appendChild(th)

  th = document.createElement('th')
  th.innerText = '30 days out'
  tr.appendChild(th)

  thead.appendChild(tr)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')

  const getRange = (itemData: {
    totalTickets: number
    minPrice: number
    maxPrice: number
  }) => {
    if (itemData.totalTickets) {
      return `$${itemData.minPrice.toFixed(
        2
      )} - $${itemData.maxPrice.toFixed(2)}`
    } else {
      return 'N/A'
    }
  }

  formattedData.forEach((item: any) => {
    tr = document.createElement('tr')
    let td = document.createElement('td')
    td.innerHTML = `<span class="stubhub-table-show-name">${item.name}</span><br><span class="stubhub-table-venue-name">${item.venueName}</span>`
    tr.appendChild(td)

    td = document.createElement('td')
    td.innerHTML = `${
      item.threeDaysOut.totalTickets
    } tickets<br />${getRange(item.threeDaysOut)}`
    tr.appendChild(td)

    td = document.createElement('td')
    td.innerHTML = `${
      item.sevenDaysOut.totalTickets
    } tickets<br />${getRange(item.sevenDaysOut)}`
    tr.appendChild(td)

    td = document.createElement('td')
    td.innerHTML = `${
      item.thirtyDaysOut.totalTickets
    } tickets<br />${getRange(item.thirtyDaysOut)}`
    tr.appendChild(td)

    tbody.appendChild(tr)
  })

  tbody.appendChild(tr)
  table.appendChild(tbody)
}
