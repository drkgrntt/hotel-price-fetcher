import { Request, Response } from 'express'
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { addDays, addMonths, format } from 'date-fns'
import { Show } from '../types'

let ACCESS_TOKEN = ''
let ACCESS_TOKEN_EXPIRY = 0
const getAccessToken = async () => {
  const now = new Date().getTime()
  if (ACCESS_TOKEN && now < ACCESS_TOKEN_EXPIRY) {
    return
  }

  const headers: AxiosRequestHeaders = {
    authorization: `Basic ${process.env.SH_API_KEY}`,
  }
  const config: AxiosRequestConfig = {
    headers,
  }
  const body = {
    username: process.env.SH_EMAIL,
    password: process.env.SH_PASSWORD,
  }
  const url =
    'https://api.stubhub.com/sellers/oauth/accesstoken?grant_type=client_credentials'

  const response = await axios.post(url, body, config)

  ACCESS_TOKEN = response.data.access_token
  ACCESS_TOKEN_EXPIRY = addMonths(new Date(), 5).getTime()
}

export const fetchStubhubData = async (_: Request, res: Response) => {
  await getAccessToken()

  const API_URL = 'https://api.stubhub.com/sellers/search/events/v3'
  const headers: AxiosRequestHeaders = {
    authorization: `Bearer ${ACCESS_TOKEN}`,
  }
  const config: AxiosRequestConfig = {
    headers,
  }

  const start = format(new Date(), 'yyyy-MM-dd')
  const end = format(addDays(new Date(), 30), 'yyyy-MM-dd')
  const venues = process.env.SH_POSSIBLE_VENUES.split(',').map(
    (venue) => venue.trim()
  )

  // Make API calls
  const promises = venues.map((venue) => {
    config.params = {
      dateLocal: `${start} TO ${end}`,
      city: 'New York',
      state: 'NY',
      country: 'US',
      rows: 500,
      venue,
    }
    return axios.get(API_URL, config)
  })

  // Combine responses
  const responses = await Promise.all(promises)
  const data = responses.reduce((events, response) => {
    return [
      ...events,
      ...response.data.events.map((show: any) => new Show(show)),
    ]
  }, [] as any[])

  res.send({ count: data.length, data })
}
