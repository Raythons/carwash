import api from "./index";

export const statisticsApi = {
  // Single dashboard call - much better performance!
  getDashboardData: (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.year) queryParams.append("year", params.year);
    if (params.month) queryParams.append("month", params.month);
    if (params.isPaid !== null && params.isPaid !== undefined)
      queryParams.append("isPaid", params.isPaid);
    if (params.paymentType)
      queryParams.append("paymentType", params.paymentType);

    return api.get(`/statistics/dashboard?${queryParams.toString()}`);
  },

  getPaymentStatistics: (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.year) queryParams.append("year", params.year);
    if (params.month) queryParams.append("month", params.month);
    if (params.isPaid !== null && params.isPaid !== undefined)
      queryParams.append("isPaid", params.isPaid);
    if (params.paymentType)
      queryParams.append("paymentType", params.paymentType);
    if (params.clinicId) queryParams.append("clinicId", params.clinicId);

    return api.get(`/statistics/payments?${queryParams.toString()}`);
  },

  // Get monthly revenue for a specific year
  getMonthlyRevenue: (year, clinicId = null) => {
    const url = `/statistics/monthly-revenue/${year}${
      clinicId ? `?clinicId=${clinicId}` : ""
    }`;
    return api.get(url);
  },

  // Get payment type breakdown
  getPaymentTypeBreakdown: (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.year) queryParams.append("year", params.year);
    if (params.month) queryParams.append("month", params.month);
    if (params.isPaid !== undefined)
      queryParams.append("isPaid", params.isPaid);
    if (params.paymentType)
      queryParams.append("paymentType", params.paymentType);
    if (params.clinicId) queryParams.append("clinicId", params.clinicId);

    return api.get(`/statistics/payment-types?${queryParams.toString()}`);
  },

  // Get goal comparison for a specific year
  getGoalComparison: (year, clinicId = null) => {
    const url = `/statistics/goals-comparison/${year}${
      clinicId ? `?clinicId=${clinicId}` : ""
    }`;
    return api.get(url);
  },

  // Get animal type distribution (counts grouped by animal type)
  getAnimalTypeDistribution: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.clinicId) queryParams.append("clinicId", params.clinicId);

    return api.get(
      `/statistics/animal-types${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`
    );
  },

  // Get monthly counts for examinations
  getExaminationsMonthly: (year, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.clinicId) queryParams.append("clinicId", params.clinicId);
    return api.get(
      `/statistics/examinations-monthly/${year}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`
    );
  },

  // Get monthly counts for surgeries
  getSurgeriesMonthly: (year, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.clinicId) queryParams.append("clinicId", params.clinicId);
    return api.get(
      `/statistics/surgeries-monthly/${year}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`
    );
  },
};
