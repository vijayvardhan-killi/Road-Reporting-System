import { api } from ".";

// uploads a single image file and returns its public URL
export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await api.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.url;
};
