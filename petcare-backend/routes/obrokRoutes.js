import express from 'express';
import Obrok from '../models/Obrok.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Dodaj obrok
router.post('/', protect, async (req, res) => {
  const { ime, datum, ura, pet } = req.body;
  if (!ime || !datum || !ura || !pet)
    return res.status(400).json({ message: 'Vsa obvezna polja niso izpolnjena' });

  try {
    const obrok = await Obrok.create({ ime, datum, ura, pet });
    res.status(201).json(obrok);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET vsi obroki (s JWT)
router.get("/", protect, async (req, res) => {
  try {
    const obroki = await Obrok.find({ user: req.user }).populate("pet", "ime pasma -_id");
    res.json(obroki);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;