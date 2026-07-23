import { api } from ".";

const routePrefix = "/users";

export const getCurrentUser = async () => {
  const response = await api.get(`${routePrefix}/me`);
  return response.data.data;
};

export const updateUser = async (id, updates) => {
  const response = await api.put(`${routePrefix}/${id}`, updates);
  return response.data.data;
};
