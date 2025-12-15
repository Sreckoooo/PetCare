import express from "express";
import multer from "multer";
import Pregled from "../models/Pregled.js";
import Pet from "../models/Pet.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// ✅ multer za Buffer (datoteka v DB)
const upload = multer({
  storage: multer.memoryStorage(),
});

// ✔ GET – vsi pregledi za določenega ljubljenčka
router.get("/pet/:petId", protect, async (req, res) => {
  try {
    const pet = await Pet.findOne({
      _id: req.params.petId,
      owner: req.user._id,
    });

    if (!pet) {
      return res.status(404).json({ message: "Ljubljenček ni najden." });
    }

    const pregledi = await Pregled.find({
      pet: pet._id,
      user: req.user._id,
    }).sort({ datum: -1 });

    res.json(pregledi);
  } catch (error) {
    res.status(500).json({ message: "Napaka pri pridobivanju pregledov." });
  }
});

// ✔ POST – dodaj pregled (z datoteko)
router.post("/", protect, upload.single("datoteka"), async (req, res) => {
  try {
    const { datum, veterinar, naziv, pet } = req.body;

    if (!datum || !veterinar || !naziv || !pet) {
      return res.status(400).json({ message: "Manjkajo obvezna polja." });
    }

    // preveri lastništvo ljubljenčka
    const petCheck = await Pet.findOne({
      _id: pet,
      owner: req.user._id,
    });

    if (!petCheck) {
      return res.status(403).json({ message: "Nimaš dostopa do tega ljubljenčka." });
    }

    const pregled = await Pregled.create({
      datum,
      veterinar,
      naziv,
      pet,
      user: req.user._id,           // ⭐ KLJUČNO
      datoteka: req.file ? req.file.buffer : null,
    });

    res.status(201).json(pregled);
  } catch (error) {
    console.error("NAPAKA PREGLED:", error);
    res.status(500).json({ message: "Napaka pri dodajanju pregleda." });
  }
});

// ✔ DELETE – izbriši pregled
router.delete("/:id", protect, async (req, res) => {
  try {
    const pregled = await Pregled.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!pregled) {
      return res.status(404).json({ message: "Pregled ni najden." });
    }

    await pregled.deleteOne();
    res.json({ message: "Pregled izbrisan." });
  } catch (error) {
    res.status(500).json({ message: "Napaka pri brisanju pregleda." });
  }
});

// 📥 PRENOS DATOTEKE
router.get("/:id/datoteka", protect, async (req, res) => {
  try {
    const pregled = await Pregled.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!pregled || !pregled.datoteka) {
      return res.status(404).json({ message: "Datoteka ne obstaja." });
    }

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=pregled-datoteka",
    });

    res.send(pregled.datoteka);
  } catch (error) {
    res.status(500).json({ message: "Napaka pri prenosu datoteke." });
  }
});

// ✔ PUT – uredi pregled (opcijsko z novo datoteko)
router.put("/:id", protect, upload.single("datoteka"), async (req, res) => {
  try {
    const { datum, veterinar, naziv } = req.body;

    const pregled = await Pregled.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!pregled) {
      return res.status(404).json({ message: "Pregled ni najden." });
    }

    // posodobi polja (če so poslana)
    pregled.datum = datum ?? pregled.datum;
    pregled.veterinar = veterinar ?? pregled.veterinar;
    pregled.naziv = naziv ?? pregled.naziv;

    // če je poslana nova datoteka → zamenjaj
    if (req.file) {
      pregled.datoteka = req.file.buffer;
    }

    const updated = await pregled.save();
    res.json(updated);
  } catch (error) {
    console.error("NAPAKA PRI UREJANJU PREGLEDA:", error);
    res.status(500).json({ message: "Napaka pri urejanju pregleda." });
  }
});

export default router;