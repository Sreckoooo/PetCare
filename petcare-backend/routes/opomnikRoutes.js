import express from 'express';
import Opomnik from '../models/Opomnik.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Dodaj opomnik
router.post('/', protect, async (req, res) => {
  const { datum, ura, naziv, status, pet } = req.body;
  if (!datum || !ura || !naziv || !status || !pet)
    return res.status(400).json({ message: 'Vsa obvezna polja niso izpolnjena' });

  try {
    const opomnik = await Opomnik.create({ datum, ura, naziv, status, pet });
    res.status(201).json(opomnik);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET vsi opomniki (s JWT)
router.get("/", protect, async (req, res) => {
  try {
    const opomniki = await Opomnik.find({ user: req.user }).populate("pet", "ime pasma -_id");
    res.json(opomniki);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;