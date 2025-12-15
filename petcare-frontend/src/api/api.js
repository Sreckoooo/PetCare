import axios from "axios";

// ================== BASE URL ==================
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// ================== AUTH HEADER ==================
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// ================== PETS ==================
export const getPets = async (token) => {
  const res = await axios.get(`${API_URL}/pets`, authHeader(token));
  return res.data;
};

export const createPet = async (formData, token) => {
  const res = await axios.post(`${API_URL}/pets`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updatePet = async (id, formData, token) => {
  const res = await axios.put(`${API_URL}/pets/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deletePet = async (id, token) => {
  const res = await axios.delete(`${API_URL}/pets/${id}`, authHeader(token));
  return res.data;
};

// ================== ZDRAVILA ==================
export const getZdravila = async (token) => {
  const res = await axios.get(`${API_URL}/zdravila`, authHeader(token));
  return res.data;
};

export const createZdravilo = async (data, token) => {
  // data: { ime, vrsta_odmereka }
  const res = await axios.post(`${API_URL}/zdravila`, data, authHeader(token));
  return res.data;
};

export const updateZdravilo = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/zdravila/${id}`, data, authHeader(token));
  return res.data;
};

export const deleteZdravilo = async (id, token) => {
  const res = await axios.delete(`${API_URL}/zdravila/${id}`, authHeader(token));
  return res.data;
};

// ================== PET-ZDRAVILA (ZDRAVLJENJA) ==================

/**
 * Vsa zdravljenja za določenega ljubljenčka
 * GET /api/pet-zdravila/pet/:petId
 */
export const getPetZdravilaByPet = async (petId, token) => {
  const res = await axios.get(
    `${API_URL}/pet-zdravila/pet/${petId}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Normalizacija payload-a
 * frontend lahko pošlje:
 *  - petId / zdraviloId
 *  - ali pet / zdravilo
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
 * Dodaj zdravljenje
 * POST /api/pet-zdravila
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
 * Uredi zdravljenje
 * PUT /api/pet-zdravila/:id
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
 * Izbriši zdravljenje
 * DELETE /api/pet-zdravila/:id
 */
export const deletePetZdravilo = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/pet-zdravila/${id}`,
    authHeader(token)
  );
  return res.data;
};
// ================== PREGLEDI (EXAMS) ==================

/**
 * Pregledi za določenega ljubljenčka
 * GET /api/pregledi/pet/:petId
 */
export const getPreglediByPet = async (petId, token) => {
  const res = await axios.get(
    `${API_URL}/pregledi/pet/${petId}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Uredi pregled
 * PUT /api/pregledi/:id
 * data: FormData (lahko tudi brez nove datoteke)
 */
export const updatePregled = async (id, data, token) => {
  const res = await axios.put(
    `${API_URL}/pregledi/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

/**
 * Dodaj pregled
 * POST /api/pregledi
 * data: { pet, datum, veterinar, naziv }
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
 * Izbriši pregled
 * DELETE /api/pregledi/:id
 */
export const deletePregled = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/pregledi/${id}`,
    authHeader(token)
  );
  return res.data;
};
// ================== OBROKI (MEALS) ==================

/**
 * Pridobi vse obroke uporabnika
 * GET /api/obroki
 */
export const getObroki = async (token) => {
  const res = await axios.get(`${API_URL}/obroki`, authHeader(token));
  return res.data;
};

/**
 * Vsi obroki za določenega ljubljenčka
 * GET /api/obroki/pet/:petId
 */
export const getObrokiByPet = async (petId, token) => {
  const res = await axios.get(
    `${API_URL}/obroki/pet/${petId}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Dodaj nov obrok
 * POST /api/obroki
 * data: { ime, datum, ura, pet }
 */
export const createObrok = async (data, token) => {
  const res = await axios.post(`${API_URL}/obroki`, data, authHeader(token));
  return res.data;
};

/**
 * Posodobi obrok
 * PUT /api/obroki/:id
 */
export const updateObrok = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/obroki/${id}`, data, authHeader(token));
  return res.data;
};

/**
 * Izbriši obrok
 * DELETE /api/obroki/:id
 */
export const deleteObrok = async (id, token) => {
  const res = await axios.delete(`${API_URL}/obroki/${id}`, authHeader(token));
  return res.data;
};
// ================== AKTIVNOSTI (ACTIVITIES) ==================

/**
 * Pridobi vse aktivnosti uporabnika
 * GET /api/aktivnosti
 */
export const getAktivnosti = async (token) => {
  const res = await axios.get(`${API_URL}/aktivnosti`, authHeader(token));
  return res.data;
};

/**
 * Aktivnosti za določenega ljubljenčka
 * GET /api/aktivnosti/pet/:petId
 */
export const getAktivnostiByPet = async (petId, token) => {
  const res = await axios.get(
    `${API_URL}/aktivnosti/pet/${petId}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Dodaj aktivnost
 * POST /api/aktivnosti
 * data: { ime, datum, ura, pet }
 */
export const createAktivnost = async (data, token) => {
  const res = await axios.post(`${API_URL}/aktivnosti`, data, authHeader(token));
  return res.data;
};

/**
 * Posodobi aktivnost
 * PUT /api/aktivnosti/:id
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
 * Izbriši aktivnost
 * DELETE /api/aktivnosti/:id
 */
export const deleteAktivnost = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/aktivnosti/${id}`,
    authHeader(token)
  );
  return res.data;
};

// ================== OPOMNIKI (REMINDERS) ==================

/**
 * Pridobi vse opomnike uporabnika
 * GET /api/opomniki
 */
export const getOpomniki = async (token) => {
  const res = await axios.get(`${API_URL}/opomniki`, authHeader(token));
  return res.data;
};

/**
 * Opomniki za določenega ljubljenčka
 * GET /api/opomniki/pet/:petId
 */
export const getOpomnikiByPet = async (petId, token) => {
  const res = await axios.get(
    `${API_URL}/opomniki/pet/${petId}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Opomniki po tipu
 * GET /api/opomniki?tip=zdravilo|obrok|aktivnost
 */
export const getOpomnikiByTip = async (tip, token) => {
  const res = await axios.get(
    `${API_URL}/opomniki?tip=${tip}`,
    authHeader(token)
  );
  return res.data;
};

/**
 * Dodaj opomnik
 * POST /api/opomniki
 * data: {
 *   naziv,
 *   datum,
 *   ura,
 *   tip,
 *   pet,
 *   zdravilo?, aktivnost?, obrok?
 * }
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
 * PUT /api/opomniki/:id
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
 * Izbriši opomnik
 * DELETE /api/opomniki/:id
 */
export const deleteOpomnik = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/opomniki/${id}`,
    authHeader(token)
  );
  return res.data;
};


// ================== OPOMNIKI – STATUS ==================
export const updateOpomnikStatus = async (id, status, token) => {
  const res = await axios.put(
    `${API_URL}/opomniki/${id}/status`,
    { status }, // ⬅️ pošiljamo SAMO status
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};