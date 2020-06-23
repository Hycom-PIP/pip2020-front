<template>
    <div id="future-data-component"></div>
</template>

<script>
    import { fortuneService } from '../../../../App'
    import { sendMessage } from "../../../common/messages"

    export default {
        name: "FutureData",
        props: ['stocks', 'currency'],
        components: {},
        data() {
            return {
                stocksState: [],
                currencyState: ''
            }
        },
        created() {
            this.stocksState = this.stocks;
            this.currencyState = this.currency;
            console.log("montowanie", this.stocks);
            this.showChart();
        },
        methods:{
            showChart(){
                console.log("State", this.stocksState)
                if (this.stocksState) {
                    let chartData = fortuneService.toChartData(this.stocksState)
                    chartData.passedCurrency = this.currency
                    sendMessage(this.$parent, 'bot', chartData, 'futureChart')
                } else {
                    sendMessage(this.$parent, 'bot', this.$t('fortune.bot.noData'))
                }
            }
        }
    }
</script>
