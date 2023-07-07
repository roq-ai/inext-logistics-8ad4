const mapping: Record<string, string> = {
  companies: 'company',
  'fuel-histories': 'fuel_history',
  'gps-trackings': 'gps_tracking',
  users: 'user',
  vehicles: 'vehicle',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
