import 'dotenv-safe/config'
import { json, urlencoded } from 'body-parser'
import express from 'express'
import cors from 'cors'
import {
  getPastPrices,
  getThisWeeksAverage,
  getTodaysAverage,
} from './controllers/hotelScraperController'
import {
  getSurveyResults,
  getLatestSurveyTimestamp,
} from './controllers/surveyDataController'

const main = () => {
  const app = express()
  app.use(cors())
  app.use(json())
  app.use(urlencoded({ extended: true }))

  // Deprecated
  app.get('/api/v1/day', getTodaysAverage)
  app.get('/api/v1/week', getThisWeeksAverage)

  app.get('/api/v1/survey-results', getSurveyResults)
  app.get('/api/v1/survey-timestamp', getLatestSurveyTimestamp)
  // End deprecated

  app.get('/api/v1/hotel-prices/day', getTodaysAverage)
  app.get('/api/v1/hotel-prices/week', getThisWeeksAverage)
  app.get('/api/v1/hotel-prices/past', getPastPrices)

  app.get('/api/v1/survey/results', getSurveyResults)
  app.get('/api/v1/survey/timestamp', getLatestSurveyTimestamp)

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`Server started on ${process.env.PORT}`)
  })
}

try {
  main()
} catch (err) {
  console.error(err)
}
