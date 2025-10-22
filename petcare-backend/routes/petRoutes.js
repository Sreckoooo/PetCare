import express from "express";
import Pet from "../models/Pet.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Dodaj novo žival
router.post("/", protect, async (req, res) => {
  const { ime, pasma, datum_rojstva, spol } = req.body;
  const owner = req.user.id;

  if (!ime || !pasma || !datum_rojstva || !spol)
    return res.status(400).json({ message: "Vsa polja so obvezna" });

  try {
    const pet = await Pet.create({ owner, ime, pasma, datum_rojstva, spol });
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pridobi vse živali
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().populate("owner", "ime priimek email -_id");
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;