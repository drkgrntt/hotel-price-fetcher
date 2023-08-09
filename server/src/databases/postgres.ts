import { Client } from 'pg'
import { Price } from '../types'

export const upsertPrices = async (prices: Price[]) => {
  const client = new Client({
    connectionString: process.env.POSTGRES_URI,
  })
  try {
    await client.connect()

    const query = `
      INSERT INTO hotel_prices
        ("price", "date", "created_at", "updated_at")
      VALUES
        ${prices
          .map(
            (price) =>
              `(${price.price}, '${new Date(
                price.date
              ).toLocaleDateString()}', NOW(), NOW())`
          )
          .join(',\n')}
      ON CONFLICT ("date") DO
        UPDATE SET price=EXCLUDED.price, updated_at=EXCLUDED.updated_at;
    `

    await client.query(query)
  } finally {
    await client.end()
  }
}
