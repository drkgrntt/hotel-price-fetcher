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
export const showStubhubData = (elementId, days = 30) => __awaiter(void 0, void 0, void 0, function* () {
    const element = document.getElementById(elementId);
    if (!element) {
        return;
    }
    fetch(`${BASE_API_URL}/stubhub/data?days=${days}`)
        .then((res) => res.json())
        .then((res) => {
        const date = new Date();
        const filterByDate = (show) => {
            const showTime = new Date(show.date);
            return showTime < date;
        };
        date.setDate(date.getDate() + 3);
        const threeDayResults = res.data.filter(filterByDate);
        date.setDate(date.getDate() + 4);
        const sevenDayResults = res.data.filter(filterByDate);
        date.setDate(date.getDate() + 23);
        const thirtyDayResults = res.data.filter(filterByDate);
        const data = {};
        const setData = (key, show) => {
            if (!data[show.name]) {
                data[show.name] = {
                    3: [],
                    7: [],
                    30: [],
                    venueName: show.venueName,
                };
            }
            data[show.name][key].push(show);
        };
        thirtyDayResults.forEach((show) => setData(30, show));
        sevenDayResults.forEach((show) => setData(7, show));
        threeDayResults.forEach((show) => setData(3, show));
        const getTotal = (shows) => {
            return shows.reduce((sum, show) => sum + show.totalTickets, 0);
        };
        const getMinListPrice = (shows) => {
            var _a, _b;
            return shows
                .filter((show) => show.minListPrice)
                .reduce((minPrice, show) => {
                return show.minListPrice && show.minListPrice < minPrice
                    ? show.minListPrice
                    : minPrice;
            }, (_b = (_a = shows[0]) === null || _a === void 0 ? void 0 : _a.minListPrice) !== null && _b !== void 0 ? _b : 1000);
        };
        const getMaxListPrice = (shows) => {
            var _a, _b;
            return shows
                .filter((show) => show.maxListPrice)
                .reduce((maxPrice, show) => {
                return show.maxListPrice > maxPrice
                    ? show.maxListPrice
                    : maxPrice;
            }, (_b = (_a = shows[0]) === null || _a === void 0 ? void 0 : _a.maxListPrice) !== null && _b !== void 0 ? _b : 0);
        };
        const formattedData = Object.keys(data)
            .map((name) => {
            return {
                name,
                venueName: data[name].venueName,
                threeDaysOut: {
                    totalTickets: getTotal(data[name][3]),
                    minPrice: getMinListPrice(data[name][3]),
                    maxPrice: getMaxListPrice(data[name][3]),
                },
                sevenDaysOut: {
                    totalTickets: getTotal(data[name][7]),
                    minPrice: getMinListPrice(data[name][7]),
                    maxPrice: getMaxListPrice(data[name][7]),
                },
                thirtyDaysOut: {
                    totalTickets: getTotal(data[name][30]),
                    minPrice: getMinListPrice(data[name][30]),
                    maxPrice: getMaxListPrice(data[name][30]),
                },
            };
        })
            .sort((a, b) => (a.name < b.name ? -1 : 1));
        element.innerHTML = '';
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.innerText = 'Show';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerText = '3 days out';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerText = '7 days out';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerText = '30 days out';
        tr.appendChild(th);
        thead.appendChild(tr);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        const getRange = (itemData) => {
            if (itemData.totalTickets) {
                return `$${itemData.minPrice.toFixed(2)} - $${itemData.maxPrice.toFixed(2)}`;
            }
            else {
                return 'N/A';
            }
        };
        formattedData.forEach((item) => {
            tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = `<span class="stubhub-table-show-name">${item.name}</span><br><span class="stubhub-table-venue-name">${item.venueName}</span>`;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = `${item.threeDaysOut.totalTickets} tickets<br />${getRange(item.threeDaysOut)}`;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = `${item.sevenDaysOut.totalTickets} tickets<br />${getRange(item.sevenDaysOut)}`;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = `${item.thirtyDaysOut.totalTickets} tickets<br />${getRange(item.thirtyDaysOut)}`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        });
        tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerHTML = `<span class="stubhub-table-show-name">Averages</span>`;
        tr.appendChild(td);
        const getAverage = (shows, field) => {
            return (shows.reduce((total, show) => total + show[field], 0) /
                shows.length);
        };
        td = document.createElement('td');
        td.innerHTML = `Min: $${getAverage(threeDayResults.filter((show) => show.minListPrice), 'minListPrice').toFixed(2)}<br>Max: $${getAverage(threeDayResults.filter((show) => show.maxListPrice), 'maxListPrice').toFixed(2)}`;
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = `Min: $${getAverage(sevenDayResults.filter((show) => show.minListPrice), 'minListPrice').toFixed(2)}<br>Max: $${getAverage(sevenDayResults.filter((show) => show.maxListPrice), 'maxListPrice').toFixed(2)}`;
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = `Min: $${getAverage(thirtyDayResults.filter((show) => show.minListPrice), 'minListPrice').toFixed(2)}<br>Max: $${getAverage(thirtyDayResults.filter((show) => show.maxListPrice), 'maxListPrice').toFixed(2)}`;
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);
        element.appendChild(table);
    });
});
//# sourceMappingURL=stubhub.js.map