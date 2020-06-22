<template>
    <div>
        <admin-navbar/>
        <div class="container mt-5">
            <h3 class="text-left title">

                <div v-if="showCurrencies && currencies.length > 0">
                    {{ $t('adminFortune.currencies') }}
                    <button class="ml-4 btn btn-outline-secondary" v-on:click="addCurrencyShowModal">
                        {{ $t('adminFortune.buttonAddCurrency') }}
                    </button>
                </div>
            </h3>
            <div v-if="error" class="alert alert-danger" role="alert">
                {{error}}
            </div>
            <div class="row">
                <div v-if="showCurrencies" class="col-12">
                    <div v-if="currencies.length === 0">
                        <div class="text-center mt-4">
                            <h4>{{ $t('adminFortune.noCurrency') }}
                                <button class="btn btn-outline-secondary" v-on:click="addCurrencyShowModal">
                                    {{ $t('adminFortune.buttonAddCurrency') }}
                                </button>
                            </h4>
                        </div>
                    </div>
                    <div v-else>
                        <currency-item v-for="(currency, index) in currencies" :key="index"
                                       :currency="currency"
                                       v-on:removeCurrency="removeCurrencyShowModal($event)"></currency-item>
                    </div>
                </div>
                <div v-else-if="showLoading" class="col-12">
                    <h3 class="text-center">{{ $t('adminFortune.loadingTitle') }}</h3>
                </div>
            </div>
        </div>

        <b-modal id="remove-currency-alert-modal" :title="$t('adminFortune.modalRemoveCurrencyTitle')" hide-footer>
            <ul v-if="removeErrors.length" class="alert alert-danger" role="alert">
                <li v-for="(error) in removeErrors" :key="error">{{error}}</li>
            </ul>

            <div class="text-center">
                <p>{{ $t('adminFortune.modalRemoveCurrencyTextAlert') }}</p>
                <button class="btn btn-danger btn-sm" v-on:click="removeCurrencySubmit">{{
                    $t('adminFortune.modalRemoveCurrencyButton') }}
                </button>
            </div>
        </b-modal>

        <b-modal id="add-currency-modal" :title="$t('adminFortune.modalAddCurrencyTitle')" hide-footer>
            <ul v-if="createErrors.length" class="alert alert-danger" role="alert">
                <li v-for="(error) in createErrors" :key="error">{{error}}</li>
            </ul>

            <form @submit="addNewCurrencySubmit" @submit.prevent>
                <div class="form-group">
                    <label for=".inputCurrency">{{ $t('adminFortune.modalNewCurrency') }}</label>
                    <input type="text" class="form-control inputCurrency" v-model="addCurrency">
                </div>
                <div class="text-right">
                    <button type="submit" :disabled="checkAddCurrency" class="btn btn-primary">{{
                        $t('adminFortune.modalAddCurrencySubmit') }}
                    </button>
                </div>
            </form>
        </b-modal>
    </div>
</template>

<script>

    import AdminNavbar from "../AdminNavbar";
    import CurrencyItem from "./CurrencyItem";
    import AdminFortuneRepository from "../../../core/repository/AdminFortuneRepository";
    import AdminFortuneService from "../../../core/service/AdminFortuneService";

    const adminFortuneService = new AdminFortuneService(AdminFortuneRepository);

    export default {
        name: "AdminFortuneCurrencies",
        components: {CurrencyItem, AdminNavbar},
        data() {
            return {
                showCurrencies: false,
                showLoading: true,
                currencies: [],
                error: '',
                removeCurrency: '',
                addCurrency: '',
                removeErrors: [],
                createErrors: []
            }
        },
        mounted() {
            adminFortuneService.getAllCurrencies()
                .then(response => {
                    this.showLoading = false;
                    if (response.errors) {
                        this.error = this.$t('adminFortune.errorLoadingResponseCurrency') + response.errors[0]
                    } else {
                        this.currencies = response;
                        this.showCurrencies = true;
                    }
                })
        },
        methods: {
            removeCurrencyShowModal(currency) {
                this.$bvModal.show('remove-currency-alert-modal');
                this.removeCurrency = currency;
            },
            removeCurrencySubmit() {
                this.removeErrors = [];
                adminFortuneService.removeCurrency(this.removeCurrency).then(response => {
                    if (response.errors)
                        this.removeErrors.push(this.$t('adminFortune.errorRemoveResponseCurrency'));
                    else {
                        this.currencies = this.currencies.filter((val) => val !== this.removeCurrency);
                        this.$bvModal.hide('remove-currency-alert-modal')
                    }
                })
            },
            addCurrencyShowModal() {
                this.$bvModal.show('add-currency-modal');
            },
            addNewCurrencySubmit() {
                this.createErrors = [];


                adminFortuneService.createCurrency({"name": this.addCurrency}).then(response => {
                    if (response.errors)
                        this.createErrors.push(this.$t('adminFortune.errorAddResponseCurrency'));
                    else {
                        this.currencies.push(this.addCurrency);
                        this.addCurrency = '';
                        this.$bvModal.hide('add-currency-modal')
                    }

                })
            }
        },
        computed: {
            checkAddCurrency() {
                return this.addCurrency.length === 0;
            }
        }
    }
</script>

<style scoped>

</style>
