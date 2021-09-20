import { MongoClient, MongoClientOptions } from 'mongodb'
import { Price } from './types'

const uri = process.env.MONGO_URI
let client: MongoClient

const getClient = () => {
  if (client) return client

  return new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 3,
  } as MongoClientOptions)
}

export const read = async (
  date: string | string[],
  callback: Function
) => {
  const client = getClient()
  client.connect(async (err) => {
    if (err) {
      throw err
    }
    let found
    if (Array.isArray(date)) {
      const filters = date.map((d) => {
        return { date: d }
      })
      found = await client
        .db('dragonflyer-hotel-prices')
        .collection('prices')
        .find({ $or: filters })
        .toArray()
    } else {
      found = await client
        .db('dragonflyer-hotel-prices')
        .collection('prices')
        .findOne({ date })
    }
    await client.close()

    callback(found)
  })
}

export const write = async (...prices: Price[]) => {
  const client = getClient()
  client.connect(async (err) => {
    if (err) {
      throw err
    }

    for (const price of prices) {
      const found = await client
        .db('dragonflyer-hotel-prices')
        .collection('prices')
        .findOne({ date: price.date })

      if (!found) {
        await client
          .db('dragonflyer-hotel-prices')
          .collection('prices')
          .insertOne(price)
      } else {
        await client
          .db('dragonflyer-hotel-prices')
          .collection('prices')
          .updateOne({ date: price.date }, { $set: price })
      }
    }

    await client.close()
  })
}
