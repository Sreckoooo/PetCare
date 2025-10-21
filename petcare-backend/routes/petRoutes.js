import express from "express";
import Pet from "../models/Pet.js";

const router = express.Router();

// Dodaj novega ljubljenčka
router.post("/", async (req, res) => {
  const { owner, name, species, age } = req.body;
  if (!owner || !name || !species || !age)
    return res.status(400).json({ message: "Vsa polja so obvezna" });

  try {
    const pet = await Pet.create({ owner, name, species, age });
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pridobi vse ljubljenčke
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().populate("owner", "name email -_id");
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;