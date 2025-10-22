import express from 'express';
import Zdravilo from '../models/Zdravilo.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Dodaj zdravilo
router.post('/', protect, async (req, res) => {
  const { ime, odmerek, pogostost, datum_zacetka, datum_konca, pet } = req.body;
  if (!ime || !odmerek || !pogostost || !datum_zacetka || !pet)
    return res.status(400).json({ message: 'Vsa obvezna polja niso izpolnjena' });

  try {
    const user = req.user; // ID uporabnika iz JWT
    const zdravilo = await Zdravilo.create({ ime, odmerek, pogostost, datum_zacetka, datum_konca, pet, user });
    res.status(201).json(zdravilo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET vsa zdravila (s JWT)
router.get("/", protect, async (req, res) => {
  try {
    const zdravila = await Zdravilo.find({ user: req.user }).populate("pet", "ime pasma -_id");
    res.json(zdravila);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;