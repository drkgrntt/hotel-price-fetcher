import { MongoClient, MongoClientOptions } from 'mongodb'
import { Price } from '../types'

const uri = process.env.MONGO_URI
let client: MongoClient

const getDb = async () => {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 3,
    } as MongoClientOptions)
    await client.connect()
  }

  return await client.db()
}

export const read = async (date: string | string[]) => {
  const db = await getDb()
  let found

  if (Array.isArray(date)) {
    const filters = date.map((d) => {
      return { date: d }
    })
    found = await db
      .collection('prices')
      .find({ $or: filters })
      .toArray()
  } else {
    found = await db.collection('prices').findOne({ date })
  }

  return found
}

export const write = async (...prices: Price[]) => {
  const db = await getDb()
  for (const price of prices) {
    const found = await db
      .collection('prices')
      .findOne({ date: price.date })

    if (!found) {
      await db.collection('prices').insertOne(price)
    } else {
      await db
        .collection('prices')
        .updateOne({ date: price.date }, { $set: price })
    }
  }
}
