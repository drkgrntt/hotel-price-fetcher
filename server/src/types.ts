export interface Price {
  price: number
  date: string
  updated: string
}

export class SurveyResult {
  age: string
  reside: string
  showsPerYear: string
  covidConcern: number
  shopTkts: string
  date: Date
  noob: string

  constructor(dbRow: any) {
    this.age = dbRow.demo_age
    this.reside = SurveyResult.formatResidence(dbRow.demo_reside)
    this.showsPerYear = dbRow.demo_shows_per_year
    this.covidConcern = parseInt(dbRow.demo_covid_concern)
    this.shopTkts = dbRow.demo_shop_tkts
    this.date = dbRow.demo_date
    this.noob = dbRow.noob
  }

  static formatResidence(residence: string) {
    switch (residence) {
      case 'NYC':
        return 'NYC Resident'
      case 'Suburban NYC':
        return 'Suburban NYC Resident'
      case 'Outside the United States':
        return 'International Tourist'
      case 'USA (Outside NYC)':
        return 'Domestic Tourist'
      default:
        return residence
    }
  }
}
