import * as yup from 'yup';

export const vehicleValidationSchema = yup.object().shape({
  type: yup.string().required(),
  fuel_type: yup.string().required(),
  company_id: yup.string().nullable(),
});
