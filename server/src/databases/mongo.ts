import { MongoClient, MongoClientOptions } from 'mongodb'
import { Price } from '../types'

export const read = async (date: string | string[]) => {
  const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 3,
  } as MongoClientOptions)
  let found

  try {
    await client.connect()
    const db = await client.db()

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
  } finally {
    await client.close()
  }

  return found
}

export const write = async (...prices: Price[]) => {
  const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 3,
  } as MongoClientOptions)

  try {
    await client.connect()
    const db = await client.db()

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
  } finally {
    await client.close()
  }
}
