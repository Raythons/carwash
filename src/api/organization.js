import api from './index';

export const organizationApi = {
  getCurrencies: () => api.get('/organization/currencies'),
  updateCurrency: (currencyId) => 
    api.patch(`/organization/currency?currencyId=${currencyId}`)
};

export default organizationApi;
