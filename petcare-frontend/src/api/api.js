import axios from "axios";

// Če imamo REACT_APP_API_URL v .env → uporabi ga
// Če ni, fallback na localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// Helper function to convert ArrayBuffer to Base64 string
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// ================== PETS ==================
export const getPets = async (token) => {
  const res = await axios.get(`${API_URL}/pets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Pretvori image Buffer v Base64 string za vsakega psa
  const petsWithBase64Images = res.data.map(pet => {
    if (pet.image && pet.image.data) {
      const base64String = arrayBufferToBase64(pet.image.data);
      return { ...pet, image: `data:image/jpeg;base64,${base64String}` };
    }
    return pet;
  });
  return petsWithBase64Images;
};

export const createPet = async (data, token) => {
  const formData = new FormData();
  for (const key in data) {
    if (key === 'image' && data[key]) {
      formData.append(key, data[key]);
    } else {
      formData.append(key, data[key]);
    }
  }
  const res = await axios.post(`${API_URL}/pets`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  });
  return res.data;
};

export const updatePet = async (id, data, token) => {
  const formData = new FormData();
  for (const key in data) {
    if (key === 'image' && data[key]) {
      formData.append(key, data[key]);
    } else {
      formData.append(key, data[key]);
    }
  }
  const res = await axios.put(`${API_URL}/pets/${id}`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  });
  return res.data;
};

export const deletePet = async (id, token) => {
  const res = await axios.delete(`${API_URL}/pets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ================== ZDRAVILA ==================
export const getZdravila = async (token) => {
  const res = await axios.get(`${API_URL}/zdravila`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createZdravilo = async (data, token) => {
  const res = await axios.post(`${API_URL}/zdravila`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateZdravilo = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/zdravila/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteZdravilo = async (id, token) => {
  const res = await axios.delete(`${API_URL}/zdravila/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ================== OBROKI ==================
export const getObroki = async (token) => {
  const res = await axios.get(`${API_URL}/obroki`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createObrok = async (data, token) => {
  const res = await axios.post(`${API_URL}/obroki`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateObrok = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/obroki/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteObrok = async (id, token) => {
  const res = await axios.delete(`${API_URL}/obroki/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ================== AKTIVNOSTI ==================
export const getAktivnosti = async (token) => {
  const res = await axios.get(`${API_URL}/aktivnosti`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createAktivnost = async (data, token) => {
  const res = await axios.post(`${API_URL}/aktivnosti`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateAktivnost = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/aktivnosti/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteAktivnost = async (id, token) => {
  const res = await axios.delete(`${API_URL}/aktivnosti/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ================== PREGLEDI ==================
export const getPregledi = async (token) => {
  const res = await axios.get(`${API_URL}/pregledi`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createPregled = async (data, token) => {
  const res = await axios.post(`${API_URL}/pregledi`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updatePregled = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/pregledi/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deletePregled = async (id, token) => {
  const res = await axios.delete(`${API_URL}/pregledi/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ================== OPOMNIKI ==================
export const getOpomniki = async (token) => {
  const res = await axios.get(`${API_URL}/opomniki`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createOpomnik = async (data, token) => {
  const res = await axios.post(`${API_URL}/opomniki`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateOpomnik = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/opomniki/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteOpomnik = async (id, token) => {
  const res = await axios.delete(`${API_URL}/opomniki/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};