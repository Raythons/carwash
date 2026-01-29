import { toast } from 'react-toastify';
import api from './index';

export const ownerApi = {
  /**
   * Get all owners with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (1-based)
   * @param {number} params.pageSize - Items per page
   * @param {string} params.searchTerm - Search term
   * @param {string} params.searchBy - Field to search by
   * @param {string} params.sortBy - Field to order by
   * @param {string} params.sortOrder - Sort direction ('asc' or 'desc')
   * @returns {Promise<Object>} - Response data with owners and pagination info
   */
  getOwners: async ({ page = 1, pageSize = 20, searchTerm = '', searchBy = null, sortBy = null, sortOrder = 'asc' } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchTerm) {
        params.append('searchTerm', searchTerm);
        if (searchBy) {
            params.append('searchBy', searchBy);
        }
    }

    if (sortBy) {
        params.append('sortBy', sortBy);
        if (sortOrder) {
            params.append('sortOrder', sortOrder);
        }
    }

    const response = await api.get(`/owners?${params.toString()}`);
    if(response.data.isSuccess)
      return response.data.data;
    // toast.error(response.data.errors[0]);
  },

  /**
   * Get a single owner by ID
   * @param {number} id - Owner ID
   * @returns {Promise<Object>} - Owner data
   */
  getOwnerById: async (id) => {
    const response = await api.get(`/owners/${id}`);
    if(response.data.isSuccess)
      return response.data.data;
    // toast.error(response.data.errors[0]);
  },

  /**
   * Create a new owner
   * @param {Object} ownerData - Owner data
   * @returns {Promise<Object>} - Created owner data
   */
  createOwner: async (ownerData) => {
    const response = await api.post('/owners', ownerData);
    return response.data;
  },

  /**
   * Update an existing owner
   * @param {number} id - Owner ID
   * @param {Object} ownerData - Updated owner data
   * @returns {Promise<Object>} - Updated owner data
   */
  updateOwner: async (id, ownerData) => {
    const response = await api.put(`/owners/${id}`, { ...ownerData, id });
    return response.data;
  },

  /**
   * Delete an owner
   * @param {number} id - Owner ID to delete
   * @returns {Promise<void>}
   */
  deleteOwner: async (id) => {
    await api.delete(`/owners/${id}`);
  },

  /**
   * Get animals for a specific owner
   * @param {number} ownerId - Owner ID
   * @returns {Promise<Array>} - List of animals
   */
  getOwnerAnimals: async (ownerId) => {
    const response = await api.get(`/owners/${ownerId}/animals`);
    
    if(response.data.isSuccess)
      return response.data.data;
    toast.error(response.data.errors[0] || "asdas");
  },

  /**
   * Add an animal to an owner
   * @param {number} ownerId - Owner ID
   * @param {Object} animalData - Animal data
   * @returns {Promise<Object>} - Created animal data
   */
  addAnimalToOwner: async (ownerId, animalData) => {
    const response = await api.post(`/owners/${ownerId}/animals`, animalData);
    return response.data;
  },

  /**
   * Update an animal for an owner
   * @param {number} ownerId - Owner ID
   * @param {number} animalId - Animal ID
   * @param {Object} animalData - Updated animal data
   * @returns {Promise<Object>} - Updated animal data
   */
  updateOwnerAnimal: async (ownerId, animalId, animalData) => {
    const response = await api.put(`/owners/${ownerId}/animals/${animalId}`, animalData);
    return response.data;
  },

  /**
   * Remove an animal from an owner
   * @param {number} ownerId - Owner ID
   * @param {number} animalId - Animal ID to remove
   * @returns {Promise<void>}
   */
  removeAnimalFromOwner: async (ownerId, animalId) => {
    await api.delete(`/owners/${ownerId}/animals/${animalId}`);
  }
};

export default ownerApi;
