import express from 'express';
import Opomnik from '../models/Opomnik.js';
import protect from '../middleware/auth.js';

const router = express.Router();


router.post('/', protect, async (req, res) => {
  const { datum, ura, naziv, status, pet } = req.body;
  if (!datum || !ura || !naziv || !status || !pet)
    return res.status(400).json({ message: 'Vsa obvezna polja niso izpolnjena' });

  try {
    const user = req.user; 
    const opomnik = await Opomnik.create({ datum, ura, naziv, status, pet, user });
    res.status(201).json(opomnik);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/", protect, async (req, res) => {
  try {
    const opomniki = await Opomnik.find({ user: req.user }).populate("pet", "ime pasma -_id");
    res.json(opomniki);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/:id", protect, async (req, res) => {
  try {
    const opomnik = await Opomnik.findOne({ _id: req.params.id, user: req.user });
    if (!opomnik) return res.status(404).json({ message: "Opomnik ni najden" });

    const { datum, ura, naziv, status, pet } = req.body;
    opomnik.datum = datum || opomnik.datum;
    opomnik.ura = ura || opomnik.ura;
    opomnik.naziv = naziv || opomnik.naziv;
    opomnik.status = status || opomnik.status;
    opomnik.pet = pet || opomnik.pet;

    const updatedOpomnik = await opomnik.save();
    res.json(updatedOpomnik);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const opomnik = await Opomnik.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!opomnik) return res.status(404).json({ message: "Opomnik ni najden" });
    res.json({ message: "Opomnik uspešno izbrisan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;