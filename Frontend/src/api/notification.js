import { api } from ".";

export const getMyNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data; // { data, unreadCount }
};

export const markNotificationRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};
