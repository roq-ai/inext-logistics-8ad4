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
import { getGpsTrackingById, updateGpsTrackingById } from 'apiSdk/gps-trackings';
import { Error } from 'components/error';
import { gpsTrackingValidationSchema } from 'validationSchema/gps-trackings';
import { GpsTrackingInterface } from 'interfaces/gps-tracking';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { VehicleInterface } from 'interfaces/vehicle';
import { getVehicles } from 'apiSdk/vehicles';

function GpsTrackingEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<GpsTrackingInterface>(
    () => (id ? `/gps-trackings/${id}` : null),
    () => getGpsTrackingById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: GpsTrackingInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateGpsTrackingById(id, values);
      mutate(updated);
      resetForm();
      router.push('/gps-trackings');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<GpsTrackingInterface>({
    initialValues: data,
    validationSchema: gpsTrackingValidationSchema,
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
            Edit Gps Tracking
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
            <FormControl id="location" mb="4" isInvalid={!!formik.errors?.location}>
              <FormLabel>Location</FormLabel>
              <Input type="text" name="location" value={formik.values?.location} onChange={formik.handleChange} />
              {formik.errors.location && <FormErrorMessage>{formik.errors?.location}</FormErrorMessage>}
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
    entity: 'gps_tracking',
    operation: AccessOperationEnum.UPDATE,
  }),
)(GpsTrackingEditPage);
