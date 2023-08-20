import { Request, Response } from 'express'
import puppeteer from 'puppeteer'
import { Price, priceFromPg } from '../types'
import {
  getPricesBetween,
  getToday,
  upsertPrices,
} from '../databases/postgres'

let timestamp: number
const maybeScrapeAveragePrices = async (
  numberOfDays: number = 10
) => {
  const now = new Date().getTime()
  console.log(now - timestamp, 1000 * 60 * 10)
  // one scrape per ten minutes
  if (!timestamp || now - timestamp > 1000 * 60 * 10) {
    timestamp = now
    await scrapeAveragePrices(numberOfDays)
  }
}

const scrapeAveragePrices = async (
  numberOfDays: number = 10
): Promise<number[]> => {
  console.log('====== starting scrape ======')
  const averagePrices: number[] = []
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
    ],
    headless: true,
  })

  try {
    const page = await browser.newPage()
    await page.goto(
      'https://www.google.com/travel/hotels/Times Square',
      {
        waitUntil: 'networkidle2',
      }
    )
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()))
    await page.setViewport({ width: 1600, height: 900 })

    // The default page is not necessarily today,
    // so click back until it is today
    // We don't expect to ever get to 100, we're just setting an arbitrary number
    // to prevent an infinite loop that "while (true) {" would provide
    for (let i = 0; i < 100; i++) {
      const prevDayButton = await page.$$('button[jsname="a1ZUMe"]')

      const isDisabled = await page.evaluate(
        (el) => el.disabled,
        prevDayButton[2]
      )
      if (isDisabled) {
        break
      }

      await prevDayButton[2].click()
      console.log('previous click')
      await page.waitForTimeout(100)
    }

    await page.waitForTimeout(15000)
    // await page.screenshot({ path: 'ss.jpg' })
    // const map = await page.$$('[aria-roledescription=map]')
    // console.log({ map: map[0] })

    for (let i = 0; i < numberOfDays; i++) {
      const prices: number[] = []

      const elements = await page.$$('.Kz2OTe.znMx9d')
      for (const element of elements) {
        const value = await page.evaluate(
          (el) => el.textContent,
          element
        )
        const price = parseInt(value.substring(1))
        prices.push(price)
      }

      const averagePrice =
        prices.reduce((a, b) => a + b, 0) / prices.length
      averagePrices.push(averagePrice)
      console.log('price: ', averagePrice)
      // Click to the next day
      if (i < numberOfDays - 1) {
        const nextDayButton = await page.$$('button[jsname="a1ZUMe"]')
        await nextDayButton[1].click()
        console.log('next click')
        await page.waitForTimeout(15000)
      }
    }
  } finally {
    await browser.close()
    console.log('====== finishing scrape =======')
  }

  // If there are duplicates, set the timestamp to run in 5 minutes and do not save
  if ([...new Set(averagePrices)].length < averagePrices.length) {
    const now = new Date().getTime()
    timestamp = now - 1000 * 60 * 55

    return []
  }

  const date = new Date()
  const prices: Price[] = []
  for (const price of averagePrices) {
    prices.push({
      price,
      date: date.toDateString(),
      updated: new Date().toISOString(),
    })
    date.setDate(date.getDate() + 1)
  }

  await upsertPrices(prices)

  return averagePrices
}

export const getTodaysAverage = async (
  _: Request,
  res: Response
): Promise<void> => {
  const [price] = await getToday()
  res.send({ price: priceFromPg(price) })
  maybeScrapeAveragePrices()
}

export const getThisWeeksAverage = async (
  _: Request,
  res: Response
): Promise<void> => {
  const numberOfDays = 7

  const date = new Date()

  const latest = new Date()
  latest.setDate(date.getDate() + numberOfDays)

  const prices = await getPricesBetween(date, latest)
  res.send({ prices: prices.map(priceFromPg) })
  maybeScrapeAveragePrices()
}

export const getPastPrices = async (req: Request, res: Response) => {
  let numberOfDays = 7
  if (req.query.days && !isNaN(parseInt(req.query.days as string))) {
    numberOfDays = parseInt(req.query.days as string)
  }
  let skip = 0
  if (req.query.skip && !isNaN(parseInt(req.query.skip as string))) {
    skip = parseInt(req.query.skip as string)
  }

  const date = new Date()

  const earliest = new Date()
  earliest.setDate(date.getDate() - numberOfDays)

  const latest = new Date()
  latest.setDate(date.getDate() - skip)

  const prices = await getPricesBetween(earliest, latest)
  res.send({ prices: prices.map(priceFromPg) })
}
