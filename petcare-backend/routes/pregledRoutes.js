import express from "express";
import multer from "multer";
import Pregled from "../models/Pregled.js";
import Pet from "../models/Pet.js";
import protect from "../middleware/auth.js";

const router = express.Router();

/**
 * Nastavitev multerja za shranjevanje datotek v pomnilnik (Buffer)
 */
const upload = multer({
  storage: multer.memoryStorage(),
});

/**
 * GET /pet/:petId
 * Pridobi vse preglede za določenega ljubljenčka
 */
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

/**
 * POST /
 * Dodaj nov pregled (z opcijsko datoteko)
 */
router.post("/", protect, upload.single("datoteka"), async (req, res) => {
  try {
    const { datum, veterinar, naziv, pet } = req.body;

    if (!datum || !veterinar || !naziv || !pet) {
      return res.status(400).json({ message: "Manjkajo obvezna polja." });
    }

    const petCheck = await Pet.findOne({
      _id: pet,
      owner: req.user._id,
    });

    if (!petCheck) {
      return res
        .status(403)
        .json({ message: "Nimaš dostopa do tega ljubljenčka." });
    }

    const pregled = await Pregled.create({
      datum,
      veterinar,
      naziv,
      pet,
      user: req.user._id,
      datoteka: req.file ? req.file.buffer : null,
    });

    res.status(201).json(pregled);
  } catch (error) {
    res.status(500).json({ message: "Napaka pri dodajanju pregleda." });
  }
});

/**
 * PUT /:id
 * Posodobi obstoječ pregled (opcijsko z novo datoteko)
 */
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

    pregled.datum = datum ?? pregled.datum;
    pregled.veterinar = veterinar ?? pregled.veterinar;
    pregled.naziv = naziv ?? pregled.naziv;

    if (req.file) {
      pregled.datoteka = req.file.buffer;
    }

    const updated = await pregled.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Napaka pri urejanju pregleda." });
  }
});

/**
 * DELETE /:id
 * Izbriše pregled
 */
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

/**
 * GET /:id/datoteka
 * Prenos datoteke pregleda
 */
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

export default router;