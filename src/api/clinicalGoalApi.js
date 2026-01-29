import api from './index';

export const clinicalGoalApi = {
  // Get all goals
  getAllGoals: async () => {
    const response = await api.get('/clinical-goals');
    if (response.data?.isSuccess) return response.data.data;
    throw new Error(response.data?.errors?.[0] || 'Failed to load goals');
  },

  // Get goals by year
  getGoalsByYear: async (year) => {
    const response = await api.get(`/clinical-goals?year=${year}`);
    if (response.data?.isSuccess) return response.data.data;
    throw new Error(response.data?.errors?.[0] || 'Failed to load goals');
  },

  // Get goal by ID
  getGoalById: async (id) => {
    const response = await api.get(`/clinical-goals/${id}`);
    if (response.data?.isSuccess) return response.data.data;
    throw new Error(response.data?.errors?.[0] || 'Failed to load goal');
  },

  // Create new goal
  createGoal: async (goalData) => {
    const response = await api.post('/clinical-goals', goalData);
    if (response.data?.isSuccess) return response.data.data;
    throw new Error(response.data?.errors?.[0] || 'Failed to create goal');
  },

  // Update goal
  updateGoal: async (id, goalData) => {
    const response = await api.put(`/clinical-goals/${id}`, goalData);
    if (response.data?.isSuccess) return response.data.data;
    throw new Error(response.data?.errors?.[0] || 'Failed to update goal');
  },

  // Delete goal
  deleteGoal: async (id) => {
    const response = await api.delete(`/clinical-goals/${id}`);
    if (response.data?.isSuccess) return true;
    throw new Error(response.data?.errors?.[0] || 'Failed to delete goal');
  },

  // Get goals by month and year
  getGoalByMonthYear: async (month, year) => {
    const response = await api.get(`/clinical-goals/month/${month}/year/${year}`);
    if (response.data?.isSuccess) return response.data.data;
    throw new Error(response.data?.errors?.[0] || 'Failed to load goal');
  }
};
