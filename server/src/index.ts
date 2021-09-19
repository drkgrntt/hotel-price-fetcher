import 'dotenv-safe/config'
import { json, urlencoded } from 'body-parser'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from './swagger.json'
import { getAverageHotelPrice } from './controller'

const app = express()
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get('/api/v1/hotel-prices', getAverageHotelPrice)

app.listen(parseInt(process.env.PORT), () => {
  console.log(`Server started on ${process.env.PORT}`)
})
