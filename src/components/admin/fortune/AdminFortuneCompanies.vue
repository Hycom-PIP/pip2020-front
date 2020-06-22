<template>
    <div>
        <admin-navbar/>
        <div class="container mt-5">
            <h3 class="text-left title">

                <div v-if="showCompanies && companies.length > 0">
                    {{ $t('adminFortune.companies') }}
                    <button class="ml-4 btn btn-outline-secondary" v-on:click="addCompanyShowModal">{{
                        $t('adminFortune.buttonAddCompany') }}
                    </button>
                </div>
            </h3>
            <div v-if="error" class="alert alert-danger" role="alert">
                {{error}}
            </div>
            <div class="row">
                <div v-if="showCompanies" class="col-12">
                    <div v-if="companies.length === 0">
                        <div class="text-center mt-4">
                            <h4>{{ $t('adminFortune.noCompany') }}
                                <button class="btn btn-outline-secondary" v-on:click="addCompanyShowModal">
                                    {{ $t('adminFortune.buttonAddCompany') }}
                                </button>
                            </h4>
                        </div>
                    </div>
                    <div v-else>
                        <company-item v-for="(company, index) in companies" :key="index"
                                      :company="company" v-on:editCompany="editCompanyShowModal($event)"
                                      v-on:removeCompany="removeCompanyShowModal($event)"></company-item>
                    </div>
                </div>
                <div v-else-if="showLoading" class="col-12">
                    <h3 class="text-center">{{ $t('adminFortune.loadingTitle') }}</h3>
                </div>
            </div>
        </div>

        <b-modal id="edit-company-modal" :title="$t('adminFortune.modalEditCompanyTitle')" hide-footer>
            <ul v-if="editErrors.length" class="alert alert-danger" role="alert">
                <li v-for="(error) in editErrors" :key="error">{{error}}</li>
            </ul>
            <form @submit="editCompanySubmit" @submit.prevent>
                <div class="form-group">
                    <label for=".inputSymbol">{{ $t('adminFortune.modalEditSymbol') }}</label>
                    <input type="text" disabled class="form-control inputSymbol" v-model="edit.symbol">
                </div>
                <div class="form-group">
                    <label for=".inputName">{{ $t('adminFortune.modalEditName') }}</label>
                    <input type="text" class="form-control inputName" v-model="edit.newName">
                </div>
                <div class="text-right">
                    <button type="submit" class="btn btn-primary" :disabled="checkEditCompany">
                        {{ $t('adminFortune.buttonEditCompany') }}
                    </button>
                </div>
            </form>
        </b-modal>

        <b-modal id="remove-company-alert-modal" :title="$t('adminFortune.modalRemoveCompanyTitle')" hide-footer>
            <ul v-if="removeErrors.length" class="alert alert-danger" role="alert">
                <li v-for="(error) in removeErrors" :key="error">{{error}}</li>
            </ul>

            <div class="text-center">
                <p>{{ $t('adminFortune.modalRemoveCompanyTextAlert') }}</p>
                <button class="btn btn-danger btn-sm" v-on:click="removeCompanySubmit">
                    {{ $t('adminFortune.buttonDeleteCompany') }}
                </button>
            </div>
        </b-modal>

        <b-modal id="add-company-modal" :title="$t('adminFortune.modalAddCompanyTitle')" hide-footer>
            <ul v-if="createErrors.length" class="alert alert-danger" role="alert">
                <li v-for="(error) in createErrors" :key="error">{{error}}</li>
            </ul>

            <form @submit="addNewCompanySubmit" @submit.prevent>
                <div class="form-group">
                    <label for=".inputSymbol">{{ $t('adminFortune.modalNewSymbol') }}</label>
                    <input type="text" class="form-control inputSymbol" v-model="addCompany.symbol">
                </div>
                <div class="form-group">
                    <label for=".inputName">{{ $t('adminFortune.modalNewName') }}</label>
                    <input type="text" class="form-control inputName" v-model="addCompany.name">
                </div>
                <div class="text-right">
                    <button type="submit" :disabled="checkAddCompany" class="btn btn-primary">{{
                        $t('adminFortune.modalAddCompanySubmit') }}
                    </button>
                </div>
            </form>
        </b-modal>
    </div>
</template>

<script>
    import AdminNavbar from "../AdminNavbar";
    import CompanyItem from "./CompanyItem";
    import AdminFortuneRepository from "../../../core/repository/AdminFortuneRepository";
    import AdminFortuneService from "../../../core/service/AdminFortuneService";

    const adminFortuneService = new AdminFortuneService(AdminFortuneRepository);

    export default {
        name: "AdminFortuneCompanies",
        components: {CompanyItem, AdminNavbar},
        data() {
            return {
                showCompanies: false,
                showLoading: true,
                companies: [],
                error: '',
                edit: {
                    symbol: '',
                    oldName: '',
                    newName: ''
                },
                addCompany: {
                    symbol: '',
                    name: '',
                    isCurrency: false
                },
                removeCompany: '',
                removeErrors: [],
                createErrors: [],
                editErrors: []
            }
        },
        mounted() {
            adminFortuneService.getAllCompanies()
                .then(response => {
                    this.showLoading = false;
                    if (response.errors) {
                        this.error = this.$t('adminJokes.errorListOfCategories') + response.errors[0]
                    } else {
                        this.companies = response;
                        this.showCompanies = true;
                    }
                })
        },
        methods: {
            editCompanyShowModal(company) {
                this.edit.symbol = company.symbol;
                this.edit.oldName = company.name;
                this.edit.newName = company.name;
                this.$bvModal.show('edit-company-modal')
            },
            editCompanySubmit() {
                this.editErrors = [];

                let newSymbol = {symbol: this.edit.symbol, name: this.edit.newName, isCurrency: false};

                adminFortuneService.updateSymbol(newSymbol).then(response => {
                    if (response.errors)
                        this.editErrors.push(this.$t('adminForecasts.errorEditResponseCompany'));
                    else {
                        this.companies = this.companies.filter((val) => val.symbol !== this.edit.symbol);
                        this.companies.push(newSymbol);
                        this.$bvModal.hide('edit-company-modal');
                    }
                })

            },
            removeCompanyShowModal(companySymbol) {
                this.$bvModal.show('remove-company-alert-modal');
                this.removeCompany = companySymbol;
            },
            removeCompanySubmit() {
                this.removeErrors = [];
                adminFortuneService.removeSymbol(this.removeCompany).then(response => {
                    if (response.errors)
                        this.removeErrors.push(this.$t('adminFortune.errorRemoveResponseCompany'));
                    else {
                        this.companies = this.companies.filter((val) => val.symbol !== this.removeCompany);
                        this.$bvModal.hide('remove-company-alert-modal')
                    }
                })
            },
            addCompanyShowModal() {
                this.$bvModal.show('add-company-modal');
            },
            addNewCompanySubmit() {
                this.createErrors = [];


                adminFortuneService.createSymbol(this.addCompany).then(response => {
                    if (response.errors)
                        this.createErrors.push(this.$t('adminFortune.errorAddResponseCompany'));
                    else {
                        this.companies.push({name: this.addCompany.name, symbol: this.addCompany.symbol});
                        this.addCompany.symbol = '';
                        this.addCompany.name = '';
                        this.$bvModal.hide('add-company-modal')
                    }

                })
            }
        },
        computed: {
            checkEditCompany() {
                return this.edit.oldName === this.edit.newName || this.edit.newName.length === 0;
            },
            checkAddCompany() {
                return this.addCompany.symbol.length === 0 || this.addCompany.name.length === 0;
            }
        }
    }
</script>

<style scoped>

</style>
