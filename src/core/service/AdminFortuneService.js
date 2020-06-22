export default class AdminFortuneService {
    constructor(fortuneRepository) {
        this.fortuneRepository = fortuneRepository;
    }

    removeCurrency(id) {
        return this.fortuneRepository.deleteCurrency(id);
    }

    removeSymbol(id) {
        return this.fortuneRepository.deleteSymbol(id);
    }

    getAllCurrencies() {
        return this.fortuneRepository.getAllCurrencies();
    }

    getAllCompanies() {
        return this.fortuneRepository.getAllCompanies();
    }

    createCurrency(currency) {
        return this.fortuneRepository.createCurrency(currency);
    }

    createSymbol(symbol) {
        return this.fortuneRepository.createSymbol(symbol);
    }

    updateSymbol(symbol) {
        return this.fortuneRepository.updateSymbol(symbol);
    }
}
