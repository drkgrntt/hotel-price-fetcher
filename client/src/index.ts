interface Price {
  price: number
  date: string
}
const BASE_API_URL = 'http://localhost:7777/api/v1'

const getTodaysAverageHotelPrice = async (elementId: string) => {
  fetch(`${BASE_API_URL}/day`)
    .then((res) => res.json())
    .then((res) => {
      const price = `$${(res.price.price as number).toFixed(2)}`
      const element = document.getElementById(elementId)
      if (element) {
        element.innerText = price
      }
    })
}

getTodaysAverageHotelPrice('average-hotel-prices')

const getWeeklyAverageHotelPrices = async (elementId: string) => {
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
        canvas.height = 400
        canvas.width = 400
        const ctx = canvas.getContext('2d')

        // @ts-ignore
        const myChart = new window.Chart(ctx, {
          type: 'bar',
          data: {
            labels: prices.map((price) => price.date),
            datasets: [
              {
                label: 'Average hotel prices near Times Square',
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

getWeeklyAverageHotelPrices('average-hotel-prices')
