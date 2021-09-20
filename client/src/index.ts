interface Price {
  price: number
  date: string
  updated: string
}
const BASE_API_URL = 'http://localhost:7777/api/v1'

const buildTimestamp = (date: Date) => {
  const timestamp = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`

  return timestamp
}

// @ts-ignore
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

// @ts-ignore
window.getWeeklyAverageHotelPrices = async (elementId: string) => {
  // Load Chart.js
  const script = document.createElement('script')
  script.src =
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js'
  script.integrity =
    'sha512-Wt1bJGtlnMtGP0dqNFH1xlkLBNpEodaiQ8ZN5JLA5wpc1sUlk/O5uuOMNgvzddzkpvZ9GLyYNa8w2s7rqiTk5Q=='
  script.crossOrigin = 'anonymous'
  script.referrerPolicy = 'no-referrer'

  script.onload = () => {
    fetch(`${BASE_API_URL}/week`)
      .then((res) => res.json())
      .then((res) => {
        const element = document.getElementById(elementId)
        if (!element) {
          return
        }

        const prices: Price[] = res.prices

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const timestamp = buildTimestamp(
          new Date(prices[prices.length - 1].updated)
        )

        // @ts-ignore - Chart is defined via chart.js
        const myChart = new window.Chart(ctx, {
          type: 'bar',
          data: {
            labels: prices.map((price) => price.date),
            datasets: [
              {
                label: `Average hotel prices near Times Square as of ${timestamp}`,
                data: prices.map((price) => price.price.toFixed(2)),
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
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        })

        // Show the chart
        element.appendChild(canvas)
      })
  }

  document.body.appendChild(script)
}