<script>
    import { Line } from 'vue-chartjs'
    import moment from 'moment'
    import { themeService } from "../../../../App"

    export default {
        name: "chart",
        extends: Line,
        props: ['chartData', 'currency'],

        data() {
            return {
                fontColor: '',
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    legend: {
                        labels: {
                            fontColor: ''
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
                                fontColor: ''
                            }
                        }],

                        yAxes: [{
                            ticks: {
                                fontColor: '',
                                callback: (value) => {
                                    return `${value} ${this.currency}`
                                }
                            }
                        }]
                    },
                    tooltips: {
                        enabled: true,
                        callbacks: {
                            label: ((tooltipItem) => {
                                return `${tooltipItem.yLabel} ${this.currency}`
                            })
                        }
                    }
                }
            }
        },

        created() {
            moment.locale('pl')
            this.setColor()

            setInterval(() => {
                this.fontColor = this.getColor()
            }, 10)
        },

        mounted() {
            this.renderChart(this.chartData, this.options);
            this.$root.$emit("showEnding");
        },

        watch: {
            fontColor () {
                this.setColor()
                this.renderChart(this.chartData, this.options)
            },
        },

        methods: {
            getColor() {
                let theme

                if (themeService) {
                    theme = themeService.getActiveTheme().themeName
                }
                
                return (theme == 'light') ? '#000000' : '#ffffff'
            },

            setColor() {
                this.options.scales.xAxes[0].ticks.fontColor = this.getColor()
                this.options.scales.yAxes[0].ticks.fontColor = this.getColor()
                this.options.legend.labels.fontColor = this.getColor()

                this.chartData.datasets[0].borderColor = this.getColor()
                this.chartData.datasets[0].pointBackgroundColor = this.getColor()
            }
        }
    }
</script>