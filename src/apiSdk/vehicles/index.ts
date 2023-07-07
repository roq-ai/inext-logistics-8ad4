import axios from 'axios';
import queryString from 'query-string';
import { VehicleInterface, VehicleGetQueryInterface } from 'interfaces/vehicle';
import { GetQueryInterface } from '../../interfaces';

export const getVehicles = async (query?: VehicleGetQueryInterface) => {
  const response = await axios.get(`/api/vehicles${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createVehicle = async (vehicle: VehicleInterface) => {
  const response = await axios.post('/api/vehicles', vehicle);
  return response.data;
};

export const updateVehicleById = async (id: string, vehicle: VehicleInterface) => {
  const response = await axios.put(`/api/vehicles/${id}`, vehicle);
  return response.data;
};

export const getVehicleById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/vehicles/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteVehicleById = async (id: string) => {
  const response = await axios.delete(`/api/vehicles/${id}`);
  return response.data;
};
