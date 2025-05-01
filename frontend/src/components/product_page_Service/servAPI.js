import axios from 'axios';

export const addService = (data) => axios.post('http://localhost:4000/api/services', data);

export const getServices = async (businessId) => {
  const response = await axios.get(`http://localhost:4000/api/services/business/${businessId}`);
  return response.data;
};

export const deleteService = (productId) => axios.delete(`http://localhost:4000/api/services/${productId}`);
