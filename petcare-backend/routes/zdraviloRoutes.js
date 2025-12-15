import express from "express";
import Zdravilo from "../models/Zdravilo.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// ✔ PRIDOBI VSA UPORABNIKOVA ZDRAVILA
router.get("/", protect, async (req, res) => {
  try {
    const list = await Zdravilo.find({ owner: req.user._id });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✔ DODAJ NOVO ZDRAVILO
router.post("/", protect, async (req, res) => {
  try {
    const { ime, vrsta_odmerka } = req.body;

    if (!ime || !vrsta_odmerka) {
      return res.status(400).json({ message: "Vnesi ime in vrsto odmerka." });
    }

    const newZdravilo = await Zdravilo.create({
      ime,
      vrsta_odmerka,
      owner: req.user._id,    // ⭐ Zelo pomembno!
    });

    res.status(201).json(newZdravilo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✔ POSODOBI UPORABNIKOVO ZDRAVILO
router.put("/:id", protect, async (req, res) => {
  try {
    const { ime, vrsta_odmerka } = req.body;

    // Najdi zdravilo, ki pripada uporabniku
    const zdravilo = await Zdravilo.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!zdravilo)
      return res.status(404).json({ message: "Zdravilo ni najdeno" });

    zdravilo.ime = ime || zdravilo.ime;
    zdravilo.vrsta_odmerka = vrsta_odmerka || zdravilo.vrsta_odmerka;

    const updated = await zdravilo.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✔ IZBRIŠI UPORABNIKOVO ZDRAVILO
router.delete("/:id", protect, async (req, res) => {
  try {
    const zdravilo = await Zdravilo.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!zdravilo)
      return res.status(404).json({ message: "Zdravilo ni najdeno" });

    res.json({ message: "Zdravilo uspešno izbrisano" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;