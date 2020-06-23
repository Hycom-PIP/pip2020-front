<template>
    <div class="admin-fortune">
        <admin-navbar/>
        <b-container>

            <b-row class="title">
                <b-col>
                    <h1>{{ $t('adminHome.categories.fortune')}}</h1>
                </b-col>
            </b-row>
            <b-row class="categories">
                <b-col>
                    <b-card
                            :title="$t('adminFortune.currencies')"
                            class="mb-2"
                    >
                        <router-link :to="{ name: 'admin-fortune-currencies'}">
                            <b-button class="card-button">{{ $t('adminHome.categories.button')}}</b-button>
                        </router-link>
                    </b-card>
                </b-col>
                <b-col>
                    <b-card
                            :title="$t('adminFortune.companies')"
                            class="mb-2"
                    >
                        <router-link :to="{ name: 'admin-fortune-companies'}">
                            <b-button class="card-button">{{ $t('adminHome.categories.button')}}</b-button>
                        </router-link>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import AdminNavbar from "../AdminNavbar";

    export default {
        name: "AdminFortune",
        components: {AdminNavbar},
    }
</script>

<style scoped>
    button {
        background: var(--main-bg-color);
        color: var(--main-txt-color);
    }

    h1 {
        margin: var(--main-min-padding-margin);
        color: var(--main-txt-color);
    }

    .title, .categories {
        background: var(--main-bg-color);
        padding: var(--main-min-padding-margin);
    }
</style>
