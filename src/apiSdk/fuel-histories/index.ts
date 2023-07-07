import axios from 'axios';
import queryString from 'query-string';
import { FuelHistoryInterface, FuelHistoryGetQueryInterface } from 'interfaces/fuel-history';
import { GetQueryInterface } from '../../interfaces';

export const getFuelHistories = async (query?: FuelHistoryGetQueryInterface) => {
  const response = await axios.get(`/api/fuel-histories${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFuelHistory = async (fuelHistory: FuelHistoryInterface) => {
  const response = await axios.post('/api/fuel-histories', fuelHistory);
  return response.data;
};

export const updateFuelHistoryById = async (id: string, fuelHistory: FuelHistoryInterface) => {
  const response = await axios.put(`/api/fuel-histories/${id}`, fuelHistory);
  return response.data;
};

export const getFuelHistoryById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/fuel-histories/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFuelHistoryById = async (id: string) => {
  const response = await axios.delete(`/api/fuel-histories/${id}`);
  return response.data;
};
