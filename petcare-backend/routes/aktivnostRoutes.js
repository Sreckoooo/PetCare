import express from 'express';
import Aktivnost from '../models/Aktivnost.js';
import protect from '../middleware/auth.js';

const router = express.Router();


router.post('/', protect, async (req, res) => {
  const { naziv, trajanje, datum, ura, pet } = req.body;
  if (!naziv || !trajanje || !datum || !ura || !pet)
    return res.status(400).json({ message: 'Vsa obvezna polja niso izpolnjena' });

  try {
    const user = req.user; 
    const aktivnost = await Aktivnost.create({ naziv, trajanje, datum, ura, pet, user });
    res.status(201).json(aktivnost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/", protect, async (req, res) => {
  try {
    const aktivnosti = await Aktivnost.find({ user: req.user }).populate("pet", "ime pasma -_id");
    res.json(aktivnosti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/:id", protect, async (req, res) => {
  try {
    const aktivnost = await Aktivnost.findOne({ _id: req.params.id, user: req.user });
    if (!aktivnost) return res.status(404).json({ message: "Aktivnost ni najdena" });

    const { naziv, trajanje, datum, ura, pet } = req.body;
    aktivnost.naziv = naziv || aktivnost.naziv;
    aktivnost.trajanje = trajanje || aktivnost.trajanje;
    aktivnost.datum = datum || aktivnost.datum;
    aktivnost.ura = ura || aktivnost.ura;
    aktivnost.pet = pet || aktivnost.pet;

    const updatedAktivnost = await aktivnost.save();
    res.json(updatedAktivnost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const aktivnost = await Aktivnost.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!aktivnost) return res.status(404).json({ message: "Aktivnost ni najdena" });
    res.json({ message: "Aktivnost uspešno izbrisana" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;