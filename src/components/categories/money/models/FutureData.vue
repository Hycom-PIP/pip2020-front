<template>
    <div class="future-data-component" id="chart" v-if="stocks && stocks.length">
        <chart class="chart" :chartData=chartData></chart>
    </div>
</template>

<script>
    import Chart from './Chart'
    import { fortuneService } from '../../../../App'
    import { sendMessage } from "../../../common/messages"

    export default {
        name: "FutureData",
        props: ['stocks'],
        components: {
            Chart
        },
        data() {
            return {
                chartData: {}
            }
        },
        created: function() {
            if (this.stocks && this.stocks.length) {
                this.chartData = fortuneService.toChartData(this.stocks)
                sendMessage(this.$parent, 'bot', document.getElementById("chart"), 'weatherMessage') //to nie działa
            }
            
            else {
                sendMessage(this.$parent, 'bot', this.$t('fortune.bot.noData'))
            }
        }
    }
</script>

<style scoped>
    .future-data-component {
        width: 70%;
        overflow-x: scroll;
    }

    .chart {
        height: 40vh;
        width: 2000px;
    }
</style>
