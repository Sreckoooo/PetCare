import express from "express";
import Pet from "../models/Pet.js";
import protect from "../middleware/auth.js";

const router = express.Router();


router.post("/", protect, async (req, res) => {
  const { ime, pasma, datum_rojstva, spol } = req.body;
  const owner = req.user;

  if (!ime || !pasma || !datum_rojstva || !spol)
    return res.status(400).json({ message: "Vsa polja so obvezna" });

  try {
    const pet = await Pet.create({ owner, ime, pasma, datum_rojstva, spol });
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/", protect, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user }).populate("owner", "ime priimek email -_id");
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/:id", protect, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user });
    if (!pet) return res.status(404).json({ message: "Žival ni najdena" });

    const { ime, pasma, datum_rojstva, spol } = req.body;
    pet.ime = ime || pet.ime;
    pet.pasma = pasma || pet.pasma;
    pet.datum_rojstva = datum_rojstva || pet.datum_rojstva;
    pet.spol = spol || pet.spol;

    const updatedPet = await pet.save();
    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.user });
    if (!pet) return res.status(404).json({ message: "Žival ni najdena" });
    res.json({ message: "Žival uspešno izbrisana" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;