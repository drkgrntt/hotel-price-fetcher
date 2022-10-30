import { createConnection, RowDataPacket } from 'mysql2/promise'
import { SurveyResult } from '../types'

export const getSurveyData = async (
  trailingDays: number,
  skip: number
) => {
  let date = new Date()
  date.setDate(date.getDate() - trailingDays)
  const dateParam = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`

  date = new Date()
  date.setDate(date.getDate() - skip)
  const skipParam = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`

  const db = await createConnection(process.env.MYSQL_URI)
  await db.connect()
  const [result] = await db.execute(
    'SELECT * FROM demo_survey WHERE demo_date > ? AND demo_date <= ?;',
    [dateParam, skipParam]
  )
  await db.end()

  return (result as RowDataPacket[]).map<SurveyResult>(
    (r: RowDataPacket) => new SurveyResult(r)
  )
}

export const getLatestTimestamp = async () => {
  const db = await createConnection(process.env.MYSQL_URI)
  await db.connect()
  const [result] = await db.execute(
    'SELECT primaryId FROM demo_survey ORDER BY primaryId DESC LIMIT 1;'
  )
  await db.end()
  const [record] = result as RowDataPacket[]

  return record.primaryId
}
