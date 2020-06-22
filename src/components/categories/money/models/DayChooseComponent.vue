<template>
    <div id="calendar">
        <b-calendar class="calendar" @context="onContext" :max="max" value-as-date locale="pl-PL"
                    v-bind="labels">
            <div class="d-flex" dir="ltr">
                <b-button
                        size="sm"
                        class="m-2"
                        @click="setDay">
                    {{$t('common.dayPicker')}}
                </b-button>
            </div>
        </b-calendar>
    </div>
</template>

<script>

    export default {
        name: "DayChooseComponent",
        data: function () {

            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() - 1);

            return {
                context: null,
                labels: {
                    labelNoDateSelected: this.$t('errors.wrongDate'),
                },
                max: maxDate,
            }
        },
        mounted() {
        },
        methods: {
            setDay() {
                this.$root.$emit('showDayHistory', [this.context.selectedFormatted, this.context.activeYMD]);
            },
            onContext(ctx) {
                this.context = ctx;
                this.labels.labelNoDateSelected = this.context.activeFormatted
            }
        }
    }
</script>

<style scoped>
    #calendar {
        text-align: right;
    }
</style>
