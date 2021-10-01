import { createConnection, RowDataPacket } from 'mysql2/promise'
import { SurveyResult } from '../types'

export const getSurveyData = async (trailingDays: number) => {
  const date = new Date()
  date.setDate(date.getDate() - trailingDays)
  const dateParam = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`

  const db = await createConnection(process.env.MYSQL_URI)
  await db.connect()
  const [result] = await db.execute(
    'SELECT * FROM demo_survey WHERE demo_date > ?;',
    [dateParam]
  )
  await db.end()

  return (result as RowDataPacket[]).map<SurveyResult>(
    (r: RowDataPacket) => new SurveyResult(r)
  )
}
