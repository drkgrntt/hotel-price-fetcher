import {
  createConnection,
  Connection,
  RowDataPacket,
} from 'mysql2/promise'
import { SurveyResult } from '../types'

let client: Connection
const getDb = async () => {
  if (!client) {
    client = await createConnection(process.env.MYSQL_URI)
    client.connect()
  }
  return client
}

export const getSurveyData = async (trailingDays: number) => {
  const date = new Date()
  date.setDate(date.getDate() - trailingDays)
  const dateParam = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`
  console.log(dateParam)
  const db = await getDb()
  const [result] = await db.execute(
    'SELECT * FROM demo_survey WHERE demo_date > ?;',
    [dateParam]
  )

  return (result as RowDataPacket[]).map<SurveyResult>(
    (r: RowDataPacket) => new SurveyResult(r)
  )
}
