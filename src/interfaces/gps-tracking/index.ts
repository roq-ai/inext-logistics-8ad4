import { VehicleInterface } from 'interfaces/vehicle';
import { GetQueryInterface } from 'interfaces';

export interface GpsTrackingInterface {
  id?: string;
  vehicle_id?: string;
  location: string;
  date?: any;
  created_at?: any;
  updated_at?: any;

  vehicle?: VehicleInterface;
  _count?: {};
}

export interface GpsTrackingGetQueryInterface extends GetQueryInterface {
  id?: string;
  vehicle_id?: string;
  location?: string;
}
