<template>
    <div class="period-data-component">
        <date-picker v-model="timePeriod" range :disabled-date="disabledDays" valueType="format"></date-picker>
        <div class="button">
            <b-button
                    size="sm"
                    class="m-2"
                    @click="setPeriod"
                    v-bind:class="themeService.getActiveTheme().themeName">
                {{$t('fortune.buttons.choicePeriod')}}
            </b-button>
        </div>
    </div>
</template>

<script>

    import DatePicker from 'vue2-datepicker';
    import 'vue2-datepicker/index.css';
    import {themeService} from "../../../../App";
    import moment from "moment";

    export default {
        name: "PeriodChooseComponent",
        components: {DatePicker},
        data: function () {



            return {
                timePeriod: null,
                themeService,
            }
        },
        mounted() {
        },
        methods: {
            disabledDays(value) {

                const date = new Date(value);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                if (moment(today).isSameOrBefore(date)) {
                    return date !== 1
                }

            },
            setPeriod() {
                this.$root.$emit('showPeriodHistory', this.timePeriod);
            },
        }
    }
</script>

<style scoped>
    .period-data-component, .button {
        text-align: right;
    }
</style>
