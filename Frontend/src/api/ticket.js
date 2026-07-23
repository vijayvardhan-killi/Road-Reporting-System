import { api } from ".";
import { uploadPhoto } from "./upload";

const routePrefix = "/tickets";

//Arrow function to call api for creating ticket to raise issue.
export const createTicket = async (ticket) => {
  try {
    // upload the first photo (if any) and use its URL; photos are optional
    let photoUrl = null;
    if (ticket.photos && ticket.photos.length > 0) {
      photoUrl = await uploadPhoto(ticket.photos[0]);
    }

    const payload = {
      title: ticket.title,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(ticket.coordinates.lng.toFixed(6)),
          parseFloat(ticket.coordinates.lat.toFixed(6)),
        ],
      },
      description: ticket.description,
      riskRating: ticket.riskRating,
      photoUrl,
    };

    if (ticket.isAnonymous) {
      const response = await api.post(`${routePrefix}/anonymous`, {
        ...payload,
        reporterPhone: ticket.reporterPhone,
      });
      return response.data;
    }

    const response = await api.post(`${routePrefix}/`, payload);
    return response.data;
  } catch (error) {
    console.log("Ticket Creation Error : ", error.response?.data || error.message);
    throw error;
  }
};

// tickets belonging to a specific user (civilian's own tickets)
export const getTicketsByUser = async (userId) => {
  const response = await api.get(`${routePrefix}/user/${userId}`);
  return response.data.tickets;
};

// tickets assigned to a specific area (admin view)
export const getTicketsByArea = async (areaId) => {
  const response = await api.get(`${routePrefix}/area/${areaId}`);
  return response.data.tickets;
};

// all tickets (superadmin view)
export const getAllTickets = async () => {
  const response = await api.get(`${routePrefix}/`);
  return response.data.tickets;
};

export const getTicketById = async (id) => {
  const response = await api.get(`${routePrefix}/${id}`);
  return response.data.ticket;
};

export const updateTicket = async (id, updates) => {
  const response = await api.put(`${routePrefix}/${id}`, updates);
  return response.data.ticket;
};

export const deleteTicket = async (id) => {
  const response = await api.delete(`${routePrefix}/${id}`);
  return response.data;
};
