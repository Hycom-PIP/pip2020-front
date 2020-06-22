<script>
    import { Line } from 'vue-chartjs'
    import moment from 'moment'
    import { themeService } from "../../../../App"

    export default {
        name: "chart",
        extends: Line,
        props: ['chartData'],

        data() {
            let fontColor = (themeService.getActiveTheme().themeName == 'dark') ? '#ffffff' : '#000000'

            return {
                themeService: themeService,
                fontColor: fontColor,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        labels: {
                            fontColor: fontColor
                        }
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                displayFormats: {
                                    'millisecond': 'DD MMM YYYY',
                                    'second': 'DD MMM YYYY',
                                    'minute': 'DD MMM YYYY',
                                    'hour': 'DD MMM YYYY',
                                    'day': 'DD MMM YYYY',
                                    'week': 'DD MMM YYYY',
                                    'month': 'MMM YYYY',
                                    'quarter': 'Q [kwartał] YYYY',
                                    'year': 'YYYY',
                                }
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 20,
                                fontColor: fontColor
                            }
                        }],

                        yAxes: [{
                            ticks: {
                                fontColor: fontColor
                            }
                        }]
                    }
                }
            }
        },

        created() {
            moment.locale('pl')

            setInterval(() => {
                this.fontColor = (this.themeService.getActiveTheme().themeName == 'dark') ? '#ffffff' : '#000000'
            }, 10)
        },

        mounted() {
            this.renderChart(this.chartData, this.options)
        },

        watch: {
            fontColor () {
                this.options.scales.xAxes[0].ticks.fontColor = this.fontColor
                this.options.scales.yAxes[0].ticks.fontColor = this.fontColor
                this.options.legend.labels.fontColor = this.fontColor

                this.renderChart(this.chartData, this.options)
            },
        }
    }
</script>