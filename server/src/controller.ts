import { Request, Response } from 'express'
import puppeteer from 'puppeteer'

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
  while (true) {
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

  return averagePrices
}

export const getAverageHotelPrice = async (
  req: Request,
  res: Response
): Promise<void> => {
  const prices = await scrapeAveragePrices(7)
  res.send({ prices })
}
