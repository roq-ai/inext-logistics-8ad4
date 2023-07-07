import * as yup from 'yup';

export const fuelHistoryValidationSchema = yup.object().shape({
  fuel_amount: yup.number().integer().required(),
  date: yup.date().required(),
  vehicle_id: yup.string().nullable(),
});
