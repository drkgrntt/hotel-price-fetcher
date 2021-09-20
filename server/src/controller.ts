import { Request, Response } from 'express'
import puppeteer from 'puppeteer'
import { read, write } from './database'
import { Price } from './types'

let timestamp: number
const maybeScrapeAveragePrices = async (numberOfDays: number = 1) => {
  const now = new Date().getTime()
  if (!timestamp || now - timestamp > 1000 * 60 * 60) {
    timestamp = now
    await scrapeAveragePrices(numberOfDays)
  }
}

const scrapeAveragePrices = async (
  numberOfDays: number = 1
): Promise<number[]> => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(
    'https://www.google.com/travel/hotels/Times Square',
    {
      waitUntil: 'networkidle2',
    }
  )

  // The default page is not necessarily today,
  // so click back until it is today
  // We don't expect to ever get to 20, we're just setting an arbitrary number
  // to prevent an infinite loop that "while (true) {" would provide
  for (let i = 0; i < 20; i++) {
    const prevDayButton = await page.$$(
      'button[aria-label="Set Check out one day earlier."]'
    )

    const isDisabled = await page.evaluate(
      (el) => el.disabled,
      prevDayButton[1]
    )
    if (isDisabled) {
      break
    }

    await prevDayButton[1].click()
    await page.waitForTimeout(5000)
  }

  const averagePrices: number[] = []

  for (let i = 0; i < numberOfDays; i++) {
    const prices: number[] = []

    const elements = await page.$$('.Aujq9d.sSHqwe')
    for (const element of elements) {
      const value = await page.evaluate(
        (el) => el.textContent,
        element
      )
      const price = parseInt(value.substring(1))
      prices.push(price)
    }

    const averagePrice =
      prices.reduce((a, b) => a + b) / prices.length
    averagePrices.push(averagePrice)

    // Click to the next day
    if (i < numberOfDays - 1) {
      const nextDayButton = await page.$$(
        'button[aria-label="Set Check in one day later."]'
      )
      await nextDayButton[1].click()
      await page.waitForTimeout(5000)
    }
  }

  const date = new Date()
  const prices: Price[] = []
  for (const price of averagePrices) {
    prices.push({ price, date: date.toDateString() })
    date.setDate(date.getDate() + 1)
  }
  await write(...prices)

  return averagePrices
}

export const getTodaysAverage = async (
  _: Request,
  res: Response
): Promise<void> => {
  await read(new Date().toDateString(), (price: Price) => {
    res.send({ price })
    maybeScrapeAveragePrices()
  })
}

export const getThisWeeksAverage = async (
  _: Request,
  res: Response
): Promise<void> => {
  const numberOfDays = 7

  const date = new Date()
  const dates: string[] = []

  for (let i = 0; i < numberOfDays; i++) {
    dates.push(date.toDateString())
    date.setDate(date.getDate() + 1)
  }

  await read(dates, (prices: Price[]) => {
    res.send({ prices })
    maybeScrapeAveragePrices(numberOfDays)
  })
}
