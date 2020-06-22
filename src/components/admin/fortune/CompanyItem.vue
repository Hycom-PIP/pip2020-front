<template>
    <div class="company-item">
        <div class="media">
            <div class="media-body">
                <h5 class="mt-0"><b>{{ $t('adminFortune.symbol') }}: </b>{{company.symbol}}</h5>
                <h5 class="mt-0"><b>{{ $t('adminFortune.companyName') }}: </b>{{company.name}}</h5>
                <div class="float-right">
                    <button type="button" class="btn btn-primary btn-small mr-1" v-on:click="editCompany">{{ $t('adminFortune.buttonEditCompany') }}</button>
                    <button type="button" class="btn btn-danger btn-small mr-1" v-on:click="removeCompany">{{ $t('adminFortune.buttonDeleteCompany') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CompanyItem",
        props: {
            company: Object
        },
        methods: {
            removeCompany(){
                this.$emit('removeCompany', this.company.symbol);
            },
            editCompany() {
                this.$emit('editCompany', this.company);
            }
        }
    }
</script>

<style scoped>
    .company-item {
        background-color: var(--admin-forecasts-item-bg-color);
        color: var(--admin-forecasts-item-color);
        box-shadow: var(--admin-forecasts-item-box-shadow);
        padding: var(--admin-forecasts-item-padding);
        margin-top: var(--admin-forecasts-margin-top);
    }
</style>
