import * as hotelData from './hotelData.js';
import * as surveyData from './surveyData.js';
import * as stubhub from './stubhub.js';
export const BASE_API_URL = 'https://hpf.dragonflyer.live/api/v1';
window.getTodaysAverageHotelPrice =
    hotelData.getTodaysAverageHotelPrice;
window.getWeeklyAverageHotelPrices =
    hotelData.getWeeklyAverageHotelPrices;
window.showSurveyResults = surveyData.showSurveyResults;
window.showStubhubData = stubhub.showStubhubData;
//# sourceMappingURL=index.js.map