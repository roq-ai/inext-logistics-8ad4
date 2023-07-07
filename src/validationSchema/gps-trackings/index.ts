import * as yup from 'yup';

export const gpsTrackingValidationSchema = yup.object().shape({
  location: yup.string().required(),
  date: yup.date().required(),
  vehicle_id: yup.string().nullable(),
});
