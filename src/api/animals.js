// Animals API endpoints
import api from './index';

const animalsRoute = "/animals";

export const animalsApi = {
  // Get all animals with pagination and search
  getAnimals: async (params = {}) => {
    const response = await api.get(animalsRoute, { params });
    return response.data;
  },

  // Get animal by ID
  getAnimalById: async (id) => {
    const response = await api.get(`${animalsRoute}/${id}`);
    return response.data;
  },

  // Get animal's brief historical record by ID
  getBriefHistoricalRecord: async (animalId) => {
    const response = await api.get(`${animalsRoute}/${animalId}/brief-historical-record`);
    return response.data;
  },

  // Get examinations by animal ID
  getExaminationsByAnimalId: async (animalId, params = {}) => {
    const response = await api.get(`${animalsRoute}/${animalId}/examinations`, { params });
    return response.data;
  },

  // Get animal details with all related data
  getAnimalDetails: async (animalId) => {
    const response = await api.get(`${animalsRoute}/${animalId}/details`);
    return response.data;
  },

  // Create new animal
  createAnimal: async (data) => {
    const response = await api.post(animalsRoute, data);
    return response.data;
  },

  // Update animal
  updateAnimal: async (id, data) => {
    const response = await api.put(`${animalsRoute}/${id}`, data);
    return response.data;
  },

  // Delete animal
  deleteAnimal: async (id) => {
    const response = await api.delete(`${animalsRoute}/${id}`);
    return response.data;
  },

  // Delete previous condition
  deletePreviousCondition: async (id) => {
    const response = await api.delete(`${animalsRoute}/previous-conditions/${id}`);
    return response.data;
  },

  // Note: Use ownerApi.getOwnerAnimals(ownerId) instead for getting animals by owner
};

export default animalsApi;
