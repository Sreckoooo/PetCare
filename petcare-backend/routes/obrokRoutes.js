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
    const user = req.user; // ID uporabnika iz JWT
    const obrok = await Obrok.create({ ime, datum, ura, pet, user });
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

// Posodobi obrok po ID-ju
router.put("/:id", protect, async (req, res) => {
  try {
    const obrok = await Obrok.findOne({ _id: req.params.id, user: req.user });
    if (!obrok) return res.status(404).json({ message: "Obrok ni najden" });

    const { ime, datum, ura, pet } = req.body;
    obrok.ime = ime || obrok.ime;
    obrok.datum = datum || obrok.datum;
    obrok.ura = ura || obrok.ura;
    obrok.pet = pet || obrok.pet;

    const updatedObrok = await obrok.save();
    res.json(updatedObrok);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Izbriši obrok po ID-ju
router.delete("/:id", protect, async (req, res) => {
  try {
    const obrok = await Obrok.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!obrok) return res.status(404).json({ message: "Obrok ni najden" });
    res.json({ message: "Obrok uspešno izbrisan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;