import { api } from ".";

export const getAnnualReport = async (year) => {
  const response = await api.get(`/dashboard/annual-report`, { params: { year } });
  return response.data;
};
