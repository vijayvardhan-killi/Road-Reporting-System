import { api } from ".";

export const getLeaderboard = async () => {
  const response = await api.get("/users/leaderboard");
  return response.data.data;
};
