export interface Price {
  price: number
  date: string
  updated: string
}

export class SurveyResult {
  age: string
  reside: string
  showsPerYear: string
  covidConcern: string
  shopTkts: string
  date: Date

  constructor(dbRow: any) {
    this.age = dbRow.demo_age
    this.reside = dbRow.demo_reside
    this.showsPerYear = dbRow.demo_shows_per_year
    this.covidConcern = dbRow.demo_covid_concern
    this.shopTkts = dbRow.shopTkts
    this.date = dbRow.demo_date
  }
}
