import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createFuelHistory } from 'apiSdk/fuel-histories';
import { Error } from 'components/error';
import { fuelHistoryValidationSchema } from 'validationSchema/fuel-histories';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { VehicleInterface } from 'interfaces/vehicle';
import { getVehicles } from 'apiSdk/vehicles';
import { FuelHistoryInterface } from 'interfaces/fuel-history';

function FuelHistoryCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: FuelHistoryInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createFuelHistory(values);
      resetForm();
      router.push('/fuel-histories');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<FuelHistoryInterface>({
    initialValues: {
      fuel_amount: 0,
      date: new Date(new Date().toDateString()),
      vehicle_id: (router.query.vehicle_id as string) ?? null,
    },
    validationSchema: fuelHistoryValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Fuel History
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="fuel_amount" mb="4" isInvalid={!!formik.errors?.fuel_amount}>
            <FormLabel>Fuel Amount</FormLabel>
            <NumberInput
              name="fuel_amount"
              value={formik.values?.fuel_amount}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('fuel_amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.fuel_amount && <FormErrorMessage>{formik.errors?.fuel_amount}</FormErrorMessage>}
          </FormControl>
          <FormControl id="date" mb="4">
            <FormLabel>Date</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.date ? new Date(formik.values?.date) : null}
                onChange={(value: Date) => formik.setFieldValue('date', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <AsyncSelect<VehicleInterface>
            formik={formik}
            name={'vehicle_id'}
            label={'Select Vehicle'}
            placeholder={'Select Vehicle'}
            fetcher={getVehicles}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.type}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'fuel_history',
    operation: AccessOperationEnum.CREATE,
  }),
)(FuelHistoryCreatePage);
