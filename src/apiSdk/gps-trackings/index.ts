import axios from 'axios';
import queryString from 'query-string';
import { GpsTrackingInterface, GpsTrackingGetQueryInterface } from 'interfaces/gps-tracking';
import { GetQueryInterface } from '../../interfaces';

export const getGpsTrackings = async (query?: GpsTrackingGetQueryInterface) => {
  const response = await axios.get(`/api/gps-trackings${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGpsTracking = async (gpsTracking: GpsTrackingInterface) => {
  const response = await axios.post('/api/gps-trackings', gpsTracking);
  return response.data;
};

export const updateGpsTrackingById = async (id: string, gpsTracking: GpsTrackingInterface) => {
  const response = await axios.put(`/api/gps-trackings/${id}`, gpsTracking);
  return response.data;
};

export const getGpsTrackingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/gps-trackings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGpsTrackingById = async (id: string) => {
  const response = await axios.delete(`/api/gps-trackings/${id}`);
  return response.data;
};
