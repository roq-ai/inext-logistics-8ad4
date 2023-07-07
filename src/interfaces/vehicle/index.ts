import { FuelHistoryInterface } from 'interfaces/fuel-history';
import { GpsTrackingInterface } from 'interfaces/gps-tracking';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface VehicleInterface {
  id?: string;
  type: string;
  fuel_type: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;
  fuel_history?: FuelHistoryInterface[];
  gps_tracking?: GpsTrackingInterface[];
  company?: CompanyInterface;
  _count?: {
    fuel_history?: number;
    gps_tracking?: number;
  };
}

export interface VehicleGetQueryInterface extends GetQueryInterface {
  id?: string;
  type?: string;
  fuel_type?: string;
  company_id?: string;
}
