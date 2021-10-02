var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_API_URL = 'https://hpf.dragonflyer.live/api/v1';
let chartIsLoaded = false;
const chartFunctionQueue = [];
const loadChart = () => {
    const script = document.createElement('script');
    script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js';
    script.integrity =
        'sha512-Wt1bJGtlnMtGP0dqNFH1xlkLBNpEodaiQ8ZN5JLA5wpc1sUlk/O5uuOMNgvzddzkpvZ9GLyYNa8w2s7rqiTk5Q==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    script.onload = () => {
        chartIsLoaded = true;
        chartFunctionQueue.forEach((func) => func());
        chartFunctionQueue.length = 0;
    };
    document.body.appendChild(script);
};
window.addEventListener('load', () => loadChart());
const queueChartFunction = (func) => {
    if (chartIsLoaded) {
        func();
    }
    else {
        chartFunctionQueue.push(func);
    }
};
const buildTimestamp = (date) => {
    const timestamp = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return timestamp;
};
const createBarChart = (elementId, columnLabels, dataLabel, chartData, barLabelMutation = (label) => label.toString()) => {
    const element = document.getElementById(elementId);
    if (!element) {
        return;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas not supported');
    }
    const chart = new window.Chart(ctx, {
        type: 'bar',
        data: {
            labels: columnLabels,
            datasets: [
                {
                    label: dataLabel,
                    data: chartData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        },
    });
    chart.options = {
        events: [],
        animation: {
            duration: 1,
            onComplete: () => {
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(0, 0, 0, 1)';
                ctx.textBaseline = 'bottom';
                chart.data.datasets.forEach((dataset, i) => {
                    var meta = chart.getDatasetMeta(i);
                    meta.data.forEach(function (bar, index) {
                        var data = barLabelMutation(dataset.data[index]);
                        ctx.fillText(data, bar.x, bar.y);
                    });
                });
            },
        },
        plugins: {
            legend: false,
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    element.innerHTML = '';
    element.appendChild(canvas);
};
const createDoughnutChart = (elementId, segmentLabels, dataLabel, chartData) => {
    const element = document.getElementById(elementId);
    if (!element) {
        return;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas not supported');
    }
    const chart = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: segmentLabels,
            datasets: [
                {
                    label: dataLabel,
                    data: chartData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        },
    });
    chart.options = {
        responsive: true,
        plugins: {
            legend: 'top',
        },
    };
    element.innerHTML = '';
    element.appendChild(canvas);
};
const createPieChart = (elementId, segmentLabels, dataLabel, chartData) => {
    const element = document.getElementById(elementId);
    if (!element) {
        return;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas not supported');
    }
    const chart = new window.Chart(ctx, {
        type: 'pie',
        data: {
            labels: segmentLabels,
            datasets: [
                {
                    label: dataLabel,
                    data: chartData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        },
    });
    chart.options = {
        responsive: true,
        plugins: {
            legend: 'top',
        },
    };
    element.innerHTML = '';
    element.appendChild(canvas);
};
window.getTodaysAverageHotelPrice = (elementId) => __awaiter(this, void 0, void 0, function* () {
    fetch(`${BASE_API_URL}/day`)
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
window.getWeeklyAverageHotelPrices = (elementId) => __awaiter(this, void 0, void 0, function* () {
    fetch(`${BASE_API_URL}/week`)
        .then((res) => res.json())
        .then((res) => {
        const timestamp = buildTimestamp(new Date(res.prices[res.prices.length - 1].updated));
        const columnLabels = res.prices.map((price) => price.date);
        const dataLabel = `Average hotel prices near Times Square as of ${timestamp}`;
        const data = res.prices.map((price) => price.price.toFixed(2));
        const barLabelMutation = (label) => `$${label}`;
        queueChartFunction(() => createBarChart(elementId, columnLabels, dataLabel, data, barLabelMutation));
    });
});
const getSurveyResults = (days = 7) => __awaiter(this, void 0, void 0, function* () {
    const result = yield (yield fetch(`${BASE_API_URL}/survey-results?days=${days}`)).json();
    return result.data;
});
window.showSurveyResults = (elementIds, trailingDays = 7) => __awaiter(this, void 0, void 0, function* () {
    const { ageRanges, residences, showsPerYear, covidConcern, tktsDiscovery, } = elementIds;
    const data = yield getSurveyResults(trailingDays);
    if (ageRanges) {
        showAgeRanges(ageRanges, data);
    }
    if (residences) {
        showResidences(residences, data);
    }
    if (showsPerYear) {
        showShowsPerYear(showsPerYear, data);
    }
    if (covidConcern) {
        showCovidConcern(covidConcern, data);
    }
    if (tktsDiscovery) {
        showTktsDiscovery(tktsDiscovery, data);
    }
});
const showAgeRanges = (elementId, data) => {
    const formatted = data.reduce((map, result) => {
        if (!map[result.age]) {
            map[result.age] = 0;
        }
        map[result.age]++;
        return map;
    }, {});
    const columnLabels = Object.keys(formatted);
    const dataLabel = 'Age ranges of TKTS patrons';
    const chartData = Object.values(formatted);
    queueChartFunction(() => createBarChart(elementId, columnLabels, dataLabel, chartData));
};
const showResidences = (elementId, data) => {
    const formatted = data.reduce((map, result) => {
        if (!map[result.reside]) {
            map[result.reside] = 0;
        }
        map[result.reside]++;
        return map;
    }, {});
    const segmentLabels = Object.keys(formatted);
    const dataLabel = 'Residences of TKTS patrons';
    const chartData = Object.values(formatted);
    queueChartFunction(() => createDoughnutChart(elementId, segmentLabels, dataLabel, chartData));
};
const showShowsPerYear = (elementId, data) => {
    const formatted = data.reduce((map, result) => {
        if (!map[result.showsPerYear]) {
            map[result.showsPerYear] = 0;
        }
        map[result.showsPerYear]++;
        return map;
    }, {});
    const segmentLabels = Object.keys(formatted);
    const dataLabel = 'Shows seen per year by TKTS patrons';
    const chartData = Object.values(formatted);
    queueChartFunction(() => createPieChart(elementId, segmentLabels, dataLabel, chartData));
};
const showCovidConcern = (elementId, data) => {
    const element = document.getElementById(elementId);
    if (element) {
        const value = data.reduce((total, item) => total + item.covidConcern, 0) /
            data.length;
        element.innerHTML = value.toFixed(1).toString();
    }
};
const showTktsDiscovery = (elementId, data) => {
    const formatted = data.reduce((map, result) => {
        if (!map[result.shopTkts]) {
            map[result.shopTkts] = 0;
        }
        map[result.shopTkts]++;
        return map;
    }, {});
    const segmentLabels = Object.keys(formatted);
    const dataLabel = 'How TKTS patrons discovered TKTS';
    const chartData = Object.values(formatted);
    queueChartFunction(() => createPieChart(elementId, segmentLabels, dataLabel, chartData));
};
//# sourceMappingURL=index.js.map