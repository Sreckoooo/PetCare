import express from 'express';
import Aktivnost from '../models/Aktivnost.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Dodaj aktivnost
router.post('/', protect, async (req, res) => {
  const { naziv, trajanje, datum, ura, pet } = req.body;
  if (!naziv || !trajanje || !datum || !ura || !pet)
    return res.status(400).json({ message: 'Vsa obvezna polja niso izpolnjena' });

  try {
    const aktivnost = await Aktivnost.create({ naziv, trajanje, datum, ura, pet });
    res.status(201).json(aktivnost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET vse aktivnosti (s JWT)
router.get("/", protect, async (req, res) => {
  try {
    const aktivnosti = await Aktivnost.find({ user: req.user }).populate("pet", "ime pasma -_id");
    res.json(aktivnosti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;