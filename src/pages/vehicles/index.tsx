import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getVehicles, deleteVehicleById } from 'apiSdk/vehicles';
import { VehicleInterface } from 'interfaces/vehicle';
import { Error } from 'components/error';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  useAuthorizationApi,
  requireNextAuth,
  withAuthorization,
} from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';
import { compose } from 'lib/compose';

function VehicleListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<VehicleInterface[]>(
    () => '/vehicles',
    () =>
      getVehicles({
        relations: ['company', 'fuel_history.count', 'gps_tracking.count'],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteVehicleById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('vehicle', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/vehicles/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Vehicle
          </Text>
          {hasAccess('vehicle', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/vehicles/create`} passHref legacyBehavior>
              <Button onClick={(e) => e.stopPropagation()} colorScheme="blue" mr="4" as="a">
                Create
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {deleteError && (
          <Box mb={4}>
            <Error error={deleteError} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>type</Th>
                  <Th>fuel_type</Th>
                  {hasAccess('company', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>company</Th>}
                  {hasAccess('fuel_history', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>fuel_history</Th>
                  )}
                  {hasAccess('gps_tracking', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>gps_tracking</Th>
                  )}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.type}</Td>
                    <Td>{record.fuel_type}</Td>
                    {hasAccess('company', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/companies/view/${record.company?.id}`}>
                          {record.company?.name}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('fuel_history', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.fuel_history}</Td>
                    )}
                    {hasAccess('gps_tracking', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.gps_tracking}</Td>
                    )}
                    <Td>
                      {hasAccess('vehicle', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <NextLink href={`/vehicles/edit/${record.id}`} passHref legacyBehavior>
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            mr={2}
                            as="a"
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FiEdit2 />}
                          >
                            Edit
                          </Button>
                        </NextLink>
                      )}
                      {hasAccess('vehicle', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          colorScheme="red"
                          variant="outline"
                          aria-label="edit"
                          icon={<FiTrash />}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
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
    operation: AccessOperationEnum.READ,
  }),
)(VehicleListPage);
