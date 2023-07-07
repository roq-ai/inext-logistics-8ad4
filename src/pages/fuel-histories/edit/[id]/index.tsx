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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getFuelHistoryById, updateFuelHistoryById } from 'apiSdk/fuel-histories';
import { Error } from 'components/error';
import { fuelHistoryValidationSchema } from 'validationSchema/fuel-histories';
import { FuelHistoryInterface } from 'interfaces/fuel-history';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { VehicleInterface } from 'interfaces/vehicle';
import { getVehicles } from 'apiSdk/vehicles';

function FuelHistoryEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<FuelHistoryInterface>(
    () => (id ? `/fuel-histories/${id}` : null),
    () => getFuelHistoryById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: FuelHistoryInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateFuelHistoryById(id, values);
      mutate(updated);
      resetForm();
      router.push('/fuel-histories');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<FuelHistoryInterface>({
    initialValues: data,
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
            Edit Fuel History
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(FuelHistoryEditPage);
