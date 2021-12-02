import { Request, Response } from 'express'
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { addDays, addMonths, format } from 'date-fns'
import { Show } from '../types'
import { write, read } from '../databases/mongo'

// https://www.newyorktheatreguide.com/theatres/broadway
const VENUES = [
  'Al Hirschfeld',
  'Ambassador',
  'American Airlines',
  'August Wilson',
  'Barrymore',
  'Belasco',
  'Bernard B. Jacobs',
  'Booth',
  'Broadhurst',
  'Broadway',
  'Brooks Atkinson',
  'Circle in the Square',
  'Cort',
  'Eugene O’Neill',
  'Gerald Schoenfeld',
  'Gershwin',
  'Golden',
  'Hayes',
  'Hudson',
  'Imperial',
  'Longacre',
  'Lyric',
  'Majestic',
  'Marquis',
  'Minskoff',
  'Music Box',
  'Nederlander',
  'Neil Simon',
  'New Amsterdam',
  'Palace',
  'Radio City Music Hall',
  'Richard Rodgers',
  'Samuel J. Friedman',
  'Shubert',
  'St. James',
  'Stephen Sondheim',
  'Studio 54',
  'Vivian Beaumont',
  'Walter Kerr',
  'Winter Garden',
]

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

let timestamp: number
export const fetchStubhubData = async (
  req: Request,
  res: Response
) => {
  const now = new Date().getTime()
  console.log(now - timestamp, 1000 * 60 * 60)

  // one fetch per hour
  if (timestamp && now - timestamp < 1000 * 60 * 60) {
    return getStubhubData(req, res)
  }
  timestamp = now

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

  // Make API calls
  const promises = VENUES.map((venue) => {
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
      ...response.data.events.map((show: any) =>
        Show.fromStubhub(show)
      ),
    ]
  }, [] as any[])

  res.send({ count: data.length, data })

  // Save to the database
  write('shShows', data, ['shId', 'date'])
}

export const getStubhubData = async (req: Request, res: Response) => {
  const numberOfDays: number =
    req.query.days &&
    !isNaN(parseInt(req.query.days as string)) &&
    parseInt(req.query.days as string) <= 30
      ? parseInt(req.query.days as string)
      : 30

  const filters = [
    {
      date: {
        $gte: new Date(),
        $lte: addDays(new Date(), numberOfDays),
      },
    },
  ]
  const data = await read('shShows', filters)
  const shows = data
    .map((item) => new Show(item))
    .sort((a, b) => (a.date < b.date ? -1 : 1))

  res.send({ count: shows.length, data: shows })
}
