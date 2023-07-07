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
import { getVehicleById, updateVehicleById } from 'apiSdk/vehicles';
import { Error } from 'components/error';
import { vehicleValidationSchema } from 'validationSchema/vehicles';
import { VehicleInterface } from 'interfaces/vehicle';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function VehicleEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<VehicleInterface>(
    () => (id ? `/vehicles/${id}` : null),
    () => getVehicleById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: VehicleInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateVehicleById(id, values);
      mutate(updated);
      resetForm();
      router.push('/vehicles');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<VehicleInterface>({
    initialValues: data,
    validationSchema: vehicleValidationSchema,
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
            Edit Vehicle
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
            <FormControl id="type" mb="4" isInvalid={!!formik.errors?.type}>
              <FormLabel>Type</FormLabel>
              <Input type="text" name="type" value={formik.values?.type} onChange={formik.handleChange} />
              {formik.errors.type && <FormErrorMessage>{formik.errors?.type}</FormErrorMessage>}
            </FormControl>
            <FormControl id="fuel_type" mb="4" isInvalid={!!formik.errors?.fuel_type}>
              <FormLabel>Fuel Type</FormLabel>
              <Input type="text" name="fuel_type" value={formik.values?.fuel_type} onChange={formik.handleChange} />
              {formik.errors.fuel_type && <FormErrorMessage>{formik.errors?.fuel_type}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<CompanyInterface>
              formik={formik}
              name={'company_id'}
              label={'Select Company'}
              placeholder={'Select Company'}
              fetcher={getCompanies}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
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
    entity: 'vehicle',
    operation: AccessOperationEnum.UPDATE,
  }),
)(VehicleEditPage);
