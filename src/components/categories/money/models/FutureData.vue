<script>
    import { fortuneService } from '../../../../App'
    import { sendMessage } from "../../../common/messages"

    export default {
        name: "FutureData",
        props: ['stocks'],

        created: function() {
            if (this.stocks && this.stocks.length) {
                let chartData = fortuneService.toChartData(this.stocks)
                sendMessage(this.$parent, 'bot', chartData, 'futureChart')
            }
            
            else {
                sendMessage(this.$parent, 'bot', this.$t('fortune.bot.noData'))
            }
        }
    }
</script>