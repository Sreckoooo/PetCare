import express from 'express';
import Pregled from '../models/Pregled.js';
import protect from '../middleware/auth.js';

const router = express.Router();


router.post('/', protect, async (req, res) => {
  const { datum, veterinar, naziv, datoteka, pet } = req.body;
  if (!datum || !veterinar || !naziv || !pet)
    return res.status(400).json({ message: 'Vsa obvezna polja niso izpolnjena' });

  try {
    const user = req.user; 
    const pregled = await Pregled.create({ datum, veterinar, naziv, datoteka, pet, user });
    res.status(201).json(pregled);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/", protect, async (req, res) => {
  try {
    const pregledi = await Pregled.find({ user: req.user })
      .populate("pet", "ime pasma -_id");
    res.json(pregledi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/:id", protect, async (req, res) => {
  try {
    const pregled = await Pregled.findOne({ _id: req.params.id, user: req.user });
    if (!pregled) return res.status(404).json({ message: "Pregled ni najden" });

    const { datum, veterinar, naziv, datoteka, pet } = req.body;
    pregled.datum = datum || pregled.datum;
    pregled.veterinar = veterinar || pregled.veterinar;
    pregled.naziv = naziv || pregled.naziv;
    pregled.datoteka = datoteka || pregled.datoteka;
    pregled.pet = pet || pregled.pet;

    const updatedPregled = await pregled.save();
    res.json(updatedPregled);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const pregled = await Pregled.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!pregled) return res.status(404).json({ message: "Pregled ni najden" });
    res.json({ message: "Pregled uspešno izbrisan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;