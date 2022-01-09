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
  status: string
  lastUpdatedDate: Date
  updated: Date

  constructor(data: any) {
    this.shId = data.shId
    this.name = data.name
    this.date = new Date(data.date)
    this.venueId = data.venueId
    this.venueName = data.venueName
    this.minListPrice = data.minListPrice
    this.maxListPrice = data.maxListPrice
    this.totalTickets = data.totalTickets
    this.totalListings = data.totalListings
    this.status = data.status
    this.lastUpdatedDate = new Date(data.lastUpdatedDate)
    this.updated = new Date(data.updated)
  }

  static fromStubhub(apiItem: any) {
    return new Show({
      shId: apiItem.id,
      name: apiItem.name,
      date: new Date(apiItem.eventDateLocal),
      venueId: apiItem.venue.id,
      venueName: apiItem.venue.name,
      minListPrice: apiItem.ticketInfo.minListPrice,
      maxListPrice: apiItem.ticketInfo.maxListPrice,
      totalTickets: apiItem.ticketInfo.totalTickets,
      totalListings: apiItem.ticketInfo.totalListings,
      status: apiItem.status,
      lastUpdatedDate: apiItem.lastUpdatedDate,
      updated: new Date(),
    })
  }
}
