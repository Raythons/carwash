import api from "./index";

/**
 * @typedef {Object} AnimalType
 * @property {string} name - The unique name of the animal type (primary key)
 */

export const animalTypeApi = {
  /**
   * Get all animal types
   * @returns {Promise<AnimalType[]>} - Array of animal types
   */
  getAnimalTypes: async () => {
    const response = await api.get("/animal-types");
    return response.data;
  },

  /**
   * Create a new animal type
   * @param {Object} data - Animal type data
   * @param {string} data.name - Animal type name (must be unique)
   * @returns {Promise<AnimalType>} - Created animal type data
   */
  createAnimalType: async (data) => {
    // Ensure the name is trimmed before sending to the server
    const payload = {
      ...data,
      name: data.name.trim(),
    };

    const response = await api.post("/animal-types", payload);
    return response.data;
  },
};
