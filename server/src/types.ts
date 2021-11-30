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

export class Show {
  shId: number
  name: string
  date: Date
  venueId: number
  venueName: string
  minListPrice: number
  maxListPrice: number
  totalTickets: number
  totalListings: number
  updated: Date

  constructor(apiItem: any) {
    this.shId = apiItem.id
    this.name = apiItem.name
    this.date = new Date(apiItem.eventDateLocal)
    this.venueId = apiItem.venue.id
    this.venueName = apiItem.venue.name
    this.minListPrice = apiItem.ticketInfo.minListPrice
    this.maxListPrice = apiItem.ticketInfo.maxListPrice
    this.totalTickets = apiItem.ticketInfo.totalTickets
    this.totalListings = apiItem.ticketInfo.totalListings
    this.updated = new Date()
  }
}
