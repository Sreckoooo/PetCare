import express from 'express';
import Pregled from '../models/Pregled.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Dodaj pregled
router.post('/', protect, async (req, res) => {
  const { datum, veterinar, naziv, datoteka, pet } = req.body;
  if (!datum || !veterinar || !naziv || !pet)
    return res.status(400).json({ message: 'Vsa obvezna polja niso izpolnjena' });

  try {
    const user = req.user; // ID uporabnika iz JWT
    const pregled = await Pregled.create({ datum, veterinar, naziv, datoteka, pet, user });
    res.status(201).json(pregled);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET vsi pregledi (s JWT)
router.get("/", protect, async (req, res) => {
  try {
    const pregledi = await Pregled.find({ user: req.user })
      .populate("pet", "ime pasma -_id");
    res.json(pregledi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;