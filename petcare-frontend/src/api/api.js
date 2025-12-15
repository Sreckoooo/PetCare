import axios from "axios";

/**
 * Osnovni URL za backend API
 */
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

/**
 * Generira Authorization header z JWT žetonom
 */
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/* =====================================================
   PETS (LJUBLJENČKI)
===================================================== */

/**
 * Pridobi vse ljubljenčke uporabnika
 */
export const getPets = async (token) => {
  const res = await axios.get(`${API_URL}/pets`, authHeader(token));
  return res.data;
};

/**
 * Ustvari novega ljubljenčka (multipart/form-data)
 */
export const createPet = async (formData, token) => {
  const res = await axios.post(`${API_URL}/pets`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/**
 * Posodobi obstoječega ljubljenčka
 */
export const updatePet = async (id, formData, token) => {
  const res = await axios.put(`${API_URL}/pets/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/**
 * Izbriše ljubljenčka
 */
export const deletePet = async (id, token) => {
  const res = await axios.delete(`${API_URL}/pets/${id}`, authHeader(token));
  return res.data;
};

/* =====================================================
   ZDRAVILA
===================================================== */

/**
 * Pridobi vsa zdravila uporabnika
 */
export const getZdravila = async (token) => {
  const res = await axios.get(`${API_URL}/zdravila`, authHeader(token));
  return res.data;
};

/**
 * Ustvari novo zdravilo
 */
export const createZdravilo = async (data, token) => {
  const res = await axios.post(`${API_URL}/zdravila`, data, authHeader(token));
  return res.data;
};

/**
 * Posodobi zdravilo
 */
export const updateZdravilo = async (id, data, token) => {
  const res = await axios.put(
    `${API_URL}/zdravila/${id}`,
    data,
    authHeader(token)
  );
  return res.data;
};

/**
 * Izbriše zdravilo
 */
export const deleteZdravilo = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/zdravila/${id}`,
    authHeader(token)
  );
  return res.data;
};

/* =====================================================
   ZDRAVLJENJA (PET–ZDRAVILA)
===================================================== */

/**
 * Pridobi vsa zdravljenja za določenega ljubljenčka
 */
export const getPetZdravilaByPet = async (petId, token) => {
  const res = await axios.get(
    `${API_URL}/pet-zdravila/pet/${petId}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Normalizira payload (petId/zdraviloId → pet/zdravilo)
 */
const normalizePetZdraviloPayload = (data) => {
  if (!data || typeof data !== "object") return data;

  const normalized = { ...data };

  if (normalized.petId && !normalized.pet) {
    normalized.pet = normalized.petId;
  }
  if (normalized.zdraviloId && !normalized.zdravilo) {
    normalized.zdravilo = normalized.zdraviloId;
  }

  delete normalized.petId;
  delete normalized.zdraviloId;

  return normalized;
};

/**
 * Ustvari novo zdravljenje
 */
export const createPetZdravilo = async (data, token) => {
  const payload = normalizePetZdraviloPayload(data);

  const res = await axios.post(
    `${API_URL}/pet-zdravila`,
    payload,
    authHeader(token)
  );
  return res.data;
};

/**
 * Posodobi zdravljenje
 */
export const updatePetZdravilo = async (id, data, token) => {
  const payload = normalizePetZdraviloPayload(data);

  const res = await axios.put(
    `${API_URL}/pet-zdravila/${id}`,
    payload,
    authHeader(token)
  );
  return res.data;
};

/**
 * Izbriše zdravljenje
 */
export const deletePetZdravilo = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/pet-zdravila/${id}`,
    authHeader(token)
  );
  return res.data;
};

/* =====================================================
   PREGLEDI (EXAMS)
===================================================== */

/**
 * Pridobi vse preglede za določenega ljubljenčka
 */
export const getPreglediByPet = async (petId, token) => {
  const res = await axios.get(
    `${API_URL}/pregledi/pet/${petId}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Posodobi pregled (multipart/form-data)
 */
export const updatePregled = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/pregledi/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/**
 * Ustvari nov pregled
 */
export const createPregled = async (data, token) => {
  const res = await axios.post(
    `${API_URL}/pregledi`,
    data,
    authHeader(token)
  );
  return res.data;
};

/**
 * Izbriše pregled
 */
export const deletePregled = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/pregledi/${id}`,
    authHeader(token)
  );
  return res.data;
};

/* =====================================================
   OBROKI (MEALS)
===================================================== */

/**
 * Pridobi vse obroke uporabnika
 */
export const getObroki = async (token) => {
  const res = await axios.get(`${API_URL}/obroki`, authHeader(token));
  return res.data;
};

/**
 * Pridobi obroke za določenega ljubljenčka
 */
export const getObrokiByPet = async (petId, token) => {
  const res = await axios.get(
    `${API_URL}/obroki/pet/${petId}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Ustvari nov obrok
 */
export const createObrok = async (data, token) => {
  const res = await axios.post(`${API_URL}/obroki`, data, authHeader(token));
  return res.data;
};

/**
 * Posodobi obrok
 */
export const updateObrok = async (id, data, token) => {
  const res = await axios.put(
    `${API_URL}/obroki/${id}`,
    data,
    authHeader(token)
  );
  return res.data;
};

/**
 * Izbriše obrok
 */
export const deleteObrok = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/obroki/${id}`,
    authHeader(token)
  );
  return res.data;
};

/* =====================================================
   AKTIVNOSTI
===================================================== */

/**
 * Pridobi vse aktivnosti uporabnika
 */
export const getAktivnosti = async (token) => {
  const res = await axios.get(`${API_URL}/aktivnosti`, authHeader(token));
  return res.data;
};

/**
 * Pridobi aktivnosti za določenega ljubljenčka
 */
export const getAktivnostiByPet = async (petId, token) => {
  const res = await axios.get(
    `${API_URL}/aktivnosti/pet/${petId}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Ustvari novo aktivnost
 */
export const createAktivnost = async (data, token) => {
  const res = await axios.post(
    `${API_URL}/aktivnosti`,
    data,
    authHeader(token)
  );
  return res.data;
};

/**
 * Posodobi aktivnost
 */
export const updateAktivnost = async (id, data, token) => {
  const res = await axios.put(
    `${API_URL}/aktivnosti/${id}`,
    data,
    authHeader(token)
  );
  return res.data;
};

/**
 * Izbriše aktivnost
 */
export const deleteAktivnost = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/aktivnosti/${id}`,
    authHeader(token)
  );
  return res.data;
};

/* =====================================================
   OPOMNIKI (REMINDERS)
===================================================== */

/**
 * Pridobi vse opomnike uporabnika
 */
export const getOpomniki = async (token) => {
  const res = await axios.get(`${API_URL}/opomniki`, authHeader(token));
  return res.data;
};

/**
 * Pridobi opomnike za določenega ljubljenčka
 */
export const getOpomnikiByPet = async (petId, token) => {
  const res = await axios.get(
    `${API_URL}/opomniki/pet/${petId}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Pridobi opomnike po tipu
 */
export const getOpomnikiByTip = async (tip, token) => {
  const res = await axios.get(
    `${API_URL}/opomniki?tip=${tip}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Ustvari nov opomnik
 */
export const createOpomnik = async (data, token) => {
  const res = await axios.post(
    `${API_URL}/opomniki`,
    data,
    authHeader(token)
  );
  return res.data;
};

/**
 * Posodobi opomnik
 */
export const updateOpomnik = async (id, data, token) => {
  const res = await axios.put(
    `${API_URL}/opomniki/${id}`,
    data,
    authHeader(token)
  );
  return res.data;
};

/**
 * Izbriše opomnik
 */
export const deleteOpomnik = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/opomniki/${id}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Posodobi status opomnika (pending / done)
 */
export const updateOpomnikStatus = async (id, status, token) => {
  const res = await axios.put(
    `${API_URL}/opomniki/${id}/status`,
    { status },
    authHeader(token)
  );
  return res.data;
};