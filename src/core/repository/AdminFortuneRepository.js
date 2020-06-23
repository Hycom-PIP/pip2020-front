import {httpRequest} from '../../App'

export default {
    getAllCurrencies() {
        return httpRequest.get("admin/fortune/currencies");
    },

    getAllCompanies() {
        return httpRequest.get("admin/fortune/companies");
    },

    deleteCurrency(id) {
        return httpRequest.delete(`admin/fortune/currencies/${id}`);
    },

    deleteSymbol(id) {
        return httpRequest.delete(`admin/fortune/symbols/${id}`);
    },

    createSymbol(data) {
        return httpRequest.post('admin/fortune/symbols', data);
    },

    createCurrency(data) {
        return httpRequest.post('admin/fortune/currencies', data);
    },

    updateSymbol(data) {
        return httpRequest.put('admin/fortune/symbols', data);
    }
}
