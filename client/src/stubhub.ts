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
          data[show.name] = { 3: [], 7: [], 30: [] }
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
        return (
          shows.reduce((minPrice: number, show: Show) => {
            return show.minListPrice < minPrice
              ? show.minListPrice
              : minPrice
          }, shows[0]?.minListPrice) ?? 0
        )
      }
      const getMaxListPrice = (shows: Show[]) => {
        return (
          shows.reduce((maxPrice: number, show: Show) => {
            return show.maxListPrice < maxPrice
              ? show.maxListPrice
              : maxPrice
          }, shows[0]?.maxListPrice) ?? 0
        )
      }

      const formattedData = Object.keys(data)
        .map((name: string) => {
          return {
            name,
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
        .sort((a, b) => (a.name < b.name ? -1 : 1))

      element.innerHTML = ''

      const table = document.createElement('table')
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

      formattedData.forEach((item) => {
        tr = document.createElement('tr')
        let td = document.createElement('td')
        td.innerText = item.name
        tr.appendChild(td)

        td = document.createElement('td')
        td.innerHTML = `${
          item.threeDaysOut.totalTickets
        } tickets<br />$${item.threeDaysOut.minPrice.toFixed(
          2
        )} - $${item.threeDaysOut.maxPrice.toFixed(2)}`
        tr.appendChild(td)

        td = document.createElement('td')
        td.innerHTML = `${
          item.sevenDaysOut.totalTickets
        } tickets<br />$${item.sevenDaysOut.minPrice.toFixed(
          2
        )} - $${item.sevenDaysOut.maxPrice.toFixed(2)}`
        tr.appendChild(td)

        td = document.createElement('td')
        td.innerHTML = `${
          item.thirtyDaysOut.totalTickets
        } tickets<br />$${item.thirtyDaysOut.minPrice.toFixed(
          2
        )} - $${item.thirtyDaysOut.maxPrice.toFixed(2)}`
        tr.appendChild(td)

        tbody.appendChild(tr)
      })

      table.appendChild(tbody)
      element.appendChild(table)
    })
}
