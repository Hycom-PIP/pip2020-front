export default class FortuneService {
    constructor(httpRequest) {
        this.httpRequest = httpRequest;
    }

    getAllCurrencies(){
        return this.httpRequest.get("currencies");
    }

    getAllCompanies(){
        return this.httpRequest.get("symbols/companies");
    }

    getHistoryDataForSymbol(symbol, data){
        return this.httpRequest.get(`stocks/${symbol}?dateParam=${data}`);
    }

    getHistoryDataForSymbolForPeriod(symbol, dataStart, dataEnd){
        return this.httpRequest.get(`stocks/period/${symbol}?startDateParam=${dataStart}&endDateParam=${dataEnd}`);
    }

    getActualDataForSymbol(symbol,data){
        return this.httpRequest.get(`stocks/${symbol}?dateParam=${data}`);
    }

    getFutureDataForSymbol(symbol){
        return this.httpRequest.get(`stocks/prediction/${symbol}`);
    }

    toChartData(stocks) {
        let axisX = []
        let axisY = []

        for (let stock of stocks) {
            if (stock.value) {
                let date = stock.date[0] + '-' + stock.date[1] + '-' + stock.date[2]

                if (!axisX.includes(date)) {
                    axisX.push(date)
                    axisY.push(Math.round(stock.value * 100) / 100)
                }
            }
        }

        return {
            labels: axisX,
            datasets: [{
                lineTension: 0,
                pointRadius: 1,
                label: stocks[0].symbol,
                fill: false,
                data: axisY
            }]
        }
    }
}
