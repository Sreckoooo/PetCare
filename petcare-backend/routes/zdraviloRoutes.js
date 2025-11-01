import express from 'express';
import Zdravilo from '../models/Zdravilo.js';
import protect from '../middleware/auth.js';

const router = express.Router();


router.post('/', protect, async (req, res) => {
  const { ime, odmerek, pogostost, datum_zacetka, datum_konca, pet } = req.body;
  if (!ime || !odmerek || !pogostost || !datum_zacetka || !pet)
    return res.status(400).json({ message: 'Vsa obvezna polja niso izpolnjena' });

  try {
    const user = req.user; 
    const zdravilo = await Zdravilo.create({ ime, odmerek, pogostost, datum_zacetka, datum_konca, pet, user });
    res.status(201).json(zdravilo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/", protect, async (req, res) => {
  try {
    const zdravila = await Zdravilo.find({ user: req.user }).populate("pet", "ime pasma -_id");
    res.json(zdravila);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/:id", protect, async (req, res) => {
  try {
    const zdravilo = await Zdravilo.findOne({ _id: req.params.id, user: req.user });
    if (!zdravilo) return res.status(404).json({ message: "Zdravilo ni najdeno" });

    const { ime, odmerek, pogostost, datum_zacetka, datum_konca, pet } = req.body;
    zdravilo.ime = ime || zdravilo.ime;
    zdravilo.odmerek = odmerek || zdravilo.odmerek;
    zdravilo.pogostost = pogostost || zdravilo.pogostost;
    zdravilo.datum_zacetka = datum_zacetka || zdravilo.datum_zacetka;
    zdravilo.datum_konca = datum_konca || zdravilo.datum_konca;
    zdravilo.pet = pet || zdravilo.pet;

    const updatedZdravilo = await zdravilo.save();
    res.json(updatedZdravilo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const zdravilo = await Zdravilo.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!zdravilo) return res.status(404).json({ message: "Zdravilo ni najdeno" });
    res.json({ message: "Zdravilo uspešno izbrisano" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;