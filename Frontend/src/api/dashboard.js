import { api } from ".";

const routePrefix = "/dashboard";

export const getAdminDashboard = async () => {
  const response = await api.get(`${routePrefix}/admin-summary`);
  return response.data;
};

export const getSuperAdminDashboard = async () => {
  const response = await api.get(`${routePrefix}/superadmin-summary`);
  return response.data;
};
