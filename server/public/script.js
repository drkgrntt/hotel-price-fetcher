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
const buildTimestamp = (date) => {
    const timestamp = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return timestamp;
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
    const createChart = () => {
        fetch(`${BASE_API_URL}/week`)
            .then((res) => res.json())
            .then((res) => {
            const element = document.getElementById(elementId);
            if (!element) {
                return;
            }
            const prices = res.prices;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Canvas not supported');
            }
            const timestamp = buildTimestamp(new Date(prices[prices.length - 1].updated));
            const chart = new window.Chart(ctx, {
                type: 'bar',
                data: {
                    labels: prices.map((price) => price.date),
                    datasets: [
                        {
                            label: `Average hotel prices near Times Square as of ${timestamp}`,
                            data: prices.map((price) => price.price.toFixed(2)),
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
                                var data = `$${dataset.data[index]}`;
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
        });
    };
    const script = document.createElement('script');
    script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js';
    script.integrity =
        'sha512-Wt1bJGtlnMtGP0dqNFH1xlkLBNpEodaiQ8ZN5JLA5wpc1sUlk/O5uuOMNgvzddzkpvZ9GLyYNa8w2s7rqiTk5Q==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    script.onload = () => {
        createChart();
    };
    document.body.appendChild(script);
});
const getSurveyResults = (days = 7) => __awaiter(this, void 0, void 0, function* () {
    const result = yield (yield fetch(`${BASE_API_URL}/survey-results?days=${days}`)).json();
    return result.data;
});
window.showSurveyResults = (elementIds, trailingDays = 7) => __awaiter(this, void 0, void 0, function* () {
    const { covidConcern } = elementIds;
    const data = yield getSurveyResults(trailingDays);
    if (covidConcern) {
        const element = document.getElementById(covidConcern);
        if (element) {
            const value = data.reduce((total, item) => total + item.covidConcern, 0) /
                data.length;
            element.innerHTML = value.toFixed(1).toString();
        }
    }
});
//# sourceMappingURL=index.js.map