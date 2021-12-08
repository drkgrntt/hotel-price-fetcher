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
import { createBarChart, createDoughnutChart, createPieChart, queueChartFunction, } from './chartUtil.js';
const getSurveyResults = (days = 7) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (yield fetch(`${BASE_API_URL}/survey/results?days=${days}`)).json();
    return result.data;
});
export const showSurveyResults = (elementIds, trailingDays = 7, isDarkTheme = false) => __awaiter(void 0, void 0, void 0, function* () {
    const { ageRanges, residences, showsPerYear, covidConcern, tktsDiscovery, isFirstShow, } = elementIds;
    const data = yield getSurveyResults(trailingDays);
    if (ageRanges) {
        showAgeRanges(ageRanges, data, isDarkTheme);
    }
    if (residences) {
        showResidences(residences, data, isDarkTheme);
    }
    if (showsPerYear) {
        showShowsPerYear(showsPerYear, data, isDarkTheme);
    }
    if (covidConcern) {
        showCovidConcern(covidConcern, data);
    }
    if (tktsDiscovery) {
        showTktsDiscovery(tktsDiscovery, data, isDarkTheme);
    }
    if (isFirstShow) {
        showIsFirstShow(isFirstShow, data, isDarkTheme);
    }
});
const showAgeRanges = (elementId, data, isDarkTheme = false) => {
    const formatted = data.reduce((map, result) => {
        if (!map[result.age]) {
            map[result.age] = 0;
        }
        map[result.age]++;
        return map;
    }, {});
    Object.keys(formatted).forEach((key) => {
        formatted[key] = parseInt(((formatted[key] / data.length) * 100).toString());
    });
    const ordered = Object.keys(formatted)
        .sort()
        .reduce((obj, key) => {
        obj[key] = formatted[key];
        return obj;
    }, {});
    const columnLabels = Object.keys(ordered);
    const dataLabel = 'Age ranges of TKTS patrons';
    const chartData = Object.values(ordered);
    queueChartFunction(() => createBarChart(elementId, columnLabels, dataLabel, chartData, (label) => `${label}%`, isDarkTheme));
};
const showResidences = (elementId, data, isDarkTheme = false) => {
    const formatted = data.reduce((map, result) => {
        if (!map[result.reside]) {
            map[result.reside] = 0;
        }
        map[result.reside]++;
        return map;
    }, {});
    Object.keys(formatted).forEach((key) => {
        formatted[key] = parseInt(((formatted[key] / data.length) * 100).toString());
    });
    const segmentLabels = Object.keys(formatted);
    const dataLabel = 'Residences of TKTS patrons';
    const chartData = Object.values(formatted);
    queueChartFunction(() => createDoughnutChart(elementId, segmentLabels, dataLabel, chartData, isDarkTheme));
};
const showShowsPerYear = (elementId, data, isDarkTheme = false) => {
    const formatted = data.reduce((map, result) => {
        if (!map[result.showsPerYear]) {
            map[result.showsPerYear] = 0;
        }
        map[result.showsPerYear]++;
        return map;
    }, {});
    Object.keys(formatted).forEach((key) => {
        formatted[key] = parseInt(((formatted[key] / data.length) * 100).toString());
    });
    const segmentLabels = Object.keys(formatted);
    const dataLabel = 'Shows seen per year by TKTS patrons';
    const chartData = Object.values(formatted);
    queueChartFunction(() => createPieChart(elementId, segmentLabels, dataLabel, chartData, isDarkTheme));
};
const showCovidConcern = (elementId, data) => {
    const element = document.getElementById(elementId);
    if (element) {
        const value = data.reduce((total, item) => total + item.covidConcern, 0) /
            data.length;
        element.innerHTML = value.toFixed(1).toString();
    }
};
const showTktsDiscovery = (elementId, data, isDarkTheme = false) => {
    const formatted = data.reduce((map, result) => {
        if (!map[result.shopTkts]) {
            map[result.shopTkts] = 0;
        }
        map[result.shopTkts]++;
        return map;
    }, {});
    Object.keys(formatted).forEach((key) => {
        formatted[key] = parseInt(((formatted[key] / data.length) * 100).toString());
    });
    const segmentLabels = Object.keys(formatted);
    const dataLabel = 'How TKTS patrons discovered TKTS';
    const chartData = Object.values(formatted);
    queueChartFunction(() => createPieChart(elementId, segmentLabels, dataLabel, chartData, isDarkTheme));
};
const showIsFirstShow = (elementId, data, isDarkTheme = false) => {
    const formatted = data.reduce((map, result) => {
        if (!map[result.noob]) {
            map[result.noob] = 0;
        }
        map[result.noob]++;
        return map;
    }, {});
    Object.keys(formatted).forEach((key) => {
        formatted[key] = parseInt(((formatted[key] / data.length) * 100).toString());
    });
    const segmentLabels = Object.keys(formatted);
    const dataLabel = "If this is a TKTS Patron's first show";
    const chartData = Object.values(formatted);
    queueChartFunction(() => createPieChart(elementId, segmentLabels, dataLabel, chartData, isDarkTheme));
};
//# sourceMappingURL=surveyData.js.map