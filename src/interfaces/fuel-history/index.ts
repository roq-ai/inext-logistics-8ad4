import { VehicleInterface } from 'interfaces/vehicle';
import { GetQueryInterface } from 'interfaces';

export interface FuelHistoryInterface {
  id?: string;
  vehicle_id?: string;
  fuel_amount: number;
  date?: any;
  created_at?: any;
  updated_at?: any;

  vehicle?: VehicleInterface;
  _count?: {};
}

export interface FuelHistoryGetQueryInterface extends GetQueryInterface {
  id?: string;
  vehicle_id?: string;
}
