import * as hotelData from './hotelData.js'
import * as surveyData from './surveyData.js'
import * as stubhub from './stubhub.js'

declare global {
  interface Window {
    getTodaysAverageHotelPrice: Function
    getWeeklyAverageHotelPrices: Function
    showSurveyResults: Function
    showStubhubData: Function
  }
}

export const BASE_API_URL = 'https://hpf.dragonflyer.live/api/v1'
// export const BASE_API_URL = 'http://localhost:7777/api/v1'

window.getTodaysAverageHotelPrice =
  hotelData.getTodaysAverageHotelPrice
window.getWeeklyAverageHotelPrices =
  hotelData.getWeeklyAverageHotelPrices
window.showSurveyResults = surveyData.showSurveyResults
window.showStubhubData = stubhub.showStubhubData
