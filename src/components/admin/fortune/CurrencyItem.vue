<template>
    <div class="currency-item">
        <div class="media">
            <div class="media-body">
                <h5 class="mt-0"><b>{{ $t('adminFortune.currency') }}: </b>{{currency}}</h5>
                <div class="float-right">
                    <button type="button" class="btn btn-danger btn-small mr-1" v-on:click="removeCurrency">{{ $t('adminFortune.buttonDeleteCurrency') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CurrencyItem",
        props: {
            currency: String
        },
        methods: {
            removeCurrency(){
                this.$emit('removeCurrency', this.currency);
            }
        }

    }
</script>

<style scoped>
    .currency-item {
        background-color: var(--admin-forecasts-item-bg-color);
        color: var(--admin-forecasts-item-color);
        box-shadow: var(--admin-forecasts-item-box-shadow);
        padding: var(--admin-forecasts-item-padding);
        margin-top: var(--admin-forecasts-margin-top);
    }
</style>
