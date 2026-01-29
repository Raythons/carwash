// Examination API endpoints
import api from "./index";

const examinationsRoute = "/animals/examinations";
export const examinationApi = {
  // Get all examinations
  getExaminations: async (params = {}) => {
    const response = await api.get(examinationsRoute, { params });
    return response.data;
  },

  // Get examination by ID
  getExaminationById: async (id) => {
    const response = await api.get(`${examinationsRoute}/${id}`);
    return response.data;
  },

  // Create new examination
  createExamination: async (data) => {
    const response = await api.post(examinationsRoute, data);
    // Return the raw integer ID for easier redirects
    return response.data?.data ?? response.data;
  },

  // Update examination
  updateExamination: async (id, data) => {
    const response = await api.put(`${examinationsRoute}/${id}`, data);
    return response.data;
  },

  // Delete examination
  deleteExamination: async (id) => {
    const response = await api.delete(`${examinationsRoute}/${id}`);
    return response.data;
  },

  // Get examinations by animal ID
  getExaminationsByAnimalId: async (animalId) => {
    const response = await api.get(`/examinations/animal/${animalId}`);
    return response.data;
  },

  // Mark examination payment as fully paid
  markFullyPaid: async (examinationId) => {
    const response = await api.post(
      `${examinationsRoute}/${examinationId}/mark-fully-paid`
    );
    return response.data;
  },
};

export default examinationApi;
