import { Request, Response } from 'express'
import { getLatestTimestamp, getSurveyData } from '../databases/mysql'

export const getSurveyResults = async (
  req: Request,
  res: Response
) => {
  const days = (req.query.days as string) ?? '7'
  if (isNaN(parseInt(days))) {
    res
      .status(400)
      .send({ message: 'Please send a valid number of days' })
    return
  }

  const results = await getSurveyData(parseInt(days))

  res.send({ data: results })
}

export const getLatestSurveyTimestamp = async (
  _: Request,
  res: Response
) => {
  const timestamp = await getLatestTimestamp()
  res.send({ data: timestamp })
}
