import AdminLogin from './components/admin/Login';
import Home from './components/Home'
import AdminHome from './components/admin/AdminHome';
import AdminJokesList from './components/admin/jokes/AdminJokesList.vue'
import AdminForecasts from './components/admin/forecasts/AdminForecasts.vue'
import AdminForecastsCityList from './components/admin/forecasts/AdminForecastsCityList.vue'
import AdminFortune from "./components/admin/fortune/AdminFortune";
import AdminFortuneCurrencies from "./components/admin/fortune/AdminFortuneCurrencies";
import AdminFortuneCompanies from "./components/admin/fortune/AdminFortuneCompanies";

export const routesNames = {
    home: '/home',
    adminLogin: '/login-admin',
    adminHome: '/admin/home',
    adminJokesList: '/admin/jokes',
    AdminForecasts: '/admin/forecasts',
    AdminForecastsCityList: '/admin/forecasts/country/:countryId',
    AdminFortune: '/admin/fortune',
    AdminFortuneCurrencies: '/admin/fortune/currencies',
    AdminFortuneCompanies: '/admin/fortune/companies'
};

export const routes = [
    {path: '/', component: Home},
    {path: routesNames.adminLogin, component: AdminLogin},
    {path: routesNames.adminHome, component: AdminHome},
    { name:'admin-jokes', path: routesNames.adminJokesList, component: AdminJokesList},
    {name:'admin-forecasts', path: routesNames.AdminForecasts, component: AdminForecasts},
    {name:'admin-forecasts-city-list', path: routesNames.AdminForecastsCityList, component: AdminForecastsCityList},
    {name:'admin-fortune', path: routesNames.AdminFortune, component: AdminFortune},
    {name:'admin-fortune-currencies', path: routesNames.AdminFortuneCurrencies, component: AdminFortuneCurrencies},
    {name:'admin-fortune-companies', path: routesNames.AdminFortuneCompanies, component: AdminFortuneCompanies},

];



