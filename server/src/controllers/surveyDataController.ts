import { Request, Response } from 'express'
import { getLatestTimestamp, getSurveyData } from '../databases/mysql'

export const getSurveyResults = async (
  req: Request,
  res: Response
) => {
  let numberOfDays = 7
  if (req.query.days && !isNaN(parseInt(req.query.days as string))) {
    numberOfDays = parseInt(req.query.days as string)
  }

  let skip = 0
  if (req.query.skip && !isNaN(parseInt(req.query.skip as string))) {
    skip = parseInt(req.query.skip as string)
  }

  const results = await getSurveyData(numberOfDays, skip)

  res.send({ data: results })
}

export const getLatestSurveyTimestamp = async (
  _: Request,
  res: Response
) => {
  const timestamp = await getLatestTimestamp()
  res.send({ data: timestamp })
}
