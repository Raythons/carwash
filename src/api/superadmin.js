import api from './index';

export const superadminApi = {
  getOrganizations: () => api.get('/superadmin/organizations'),
  createOrganization: (data) => api.post('/superadmin/organizations', data),
  getPlans: () => api.get('/superadmin/plans'),
  getCurrencies: () => api.get('/superadmin/currencies'),
  updateOrganizationCurrency: (orgId, currencyId) => 
    api.patch(`/superadmin/organizations/${orgId}/currency?currencyId=${currencyId}`)
};

export default superadminApi;
