import 'dotenv-safe/config'
import { json, urlencoded } from 'body-parser'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from './swagger.json'
import { getThisWeeksAverage, getTodaysAverage } from './controller'

const main = async () => {
  const app = express()
  app.use(cors())
  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.use(
    '/api/v1/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc)
  )

  app.get('/api/v1/day', getTodaysAverage)
  app.get('/api/v1/week', getThisWeeksAverage)

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`Server started on ${process.env.PORT}`)
  })
}

try {
  main()
} catch (err) {
  console.error(err)
}
