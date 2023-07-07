import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { fuelHistoryValidationSchema } from 'validationSchema/fuel-histories';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.fuel_history
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFuelHistoryById();
    case 'PUT':
      return updateFuelHistoryById();
    case 'DELETE':
      return deleteFuelHistoryById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFuelHistoryById() {
    const data = await prisma.fuel_history.findFirst(convertQueryToPrismaUtil(req.query, 'fuel_history'));
    return res.status(200).json(data);
  }

  async function updateFuelHistoryById() {
    await fuelHistoryValidationSchema.validate(req.body);
    const data = await prisma.fuel_history.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteFuelHistoryById() {
    const data = await prisma.fuel_history.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
