var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BASE_API_URL } from './index.js';
import { buildTimestamp, createLineChart, queueChartFunction, } from './chartUtil.js';
export const getTodaysAverageHotelPrice = (elementId) => __awaiter(void 0, void 0, void 0, function* () {
    fetch(`${BASE_API_URL}/hotel-prices/day`)
        .then((res) => res.json())
        .then((res) => {
        const price = res.price;
        const timestamp = buildTimestamp(new Date(price.updated));
        const priceText = `$${price.price.toFixed(2)} as of ${timestamp}`;
        const element = document.getElementById(elementId);
        if (element) {
            element.innerText = priceText;
        }
    });
});
export const getWeeklyAverageHotelPrices = (elementId, isDarkTheme = false) => __awaiter(void 0, void 0, void 0, function* () {
    fetch(`${BASE_API_URL}/hotel-prices/week`)
        .then((res) => res.json())
        .then((res) => {
        const timestamp = buildTimestamp(new Date(res.prices[res.prices.length - 1].updated));
        const columnLabels = res.prices.map((price) => price.date);
        const dataLabel = `Average hotel prices near Times Square as of ${timestamp}`;
        const data = res.prices.map((price) => price.price.toFixed(2));
        const barLabelMutation = (label) => `$${label}`;
        queueChartFunction(() => createLineChart(elementId, columnLabels, dataLabel, data, barLabelMutation, isDarkTheme));
    });
});
//# sourceMappingURL=hotelData.js.map