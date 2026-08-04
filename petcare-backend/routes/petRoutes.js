import express from "express";
import multer from "multer";
import Pet from "../models/Pet.js";
import protect from "../middleware/auth.js";

const router = express.Router();

/**
 * Nastavitev shranjevanja slik v pomnilnik
 */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * POST /
 * Ustvari novega ljubljenčka (z možnostjo slike)
 */
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { ime, pasma, datum_rojstva, spol, vrsta } = req.body;
  const owner = req.user;

  const image = req.file
    ? { data: req.file.buffer, contentType: req.file.mimetype }
    : undefined;

  if (!ime || !pasma || !datum_rojstva || !spol) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const pet = await Pet.create({
      owner,
      ime,
      pasma,
      datum_rojstva,
      spol,
      vrsta,
      image,
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /
 * Pridobi vse ljubljenčke prijavljenega uporabnika
 */
router.get("/", protect, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user }).populate(
      "owner",
      "ime priimek email -_id"
    );

    // Pretvori sliko v base64 za frontend
    const petsWithImage = pets.map((pet) => {
      const petObj = pet.toObject();

      if (pet.image && pet.image.data) {
        petObj.image = {
          data: pet.image.data.toString("base64"),
          contentType: pet.image.contentType,
        };
      } else {
        petObj.image = null;
      }

      return petObj;
    });

    res.json(petsWithImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /:id
 * Posodobi obstoječega ljubljenčka
 */
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const pet = await Pet.findOne({
      _id: req.params.id,
      owner: req.user,
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const { ime, pasma, datum_rojstva, spol, vrsta } = req.body;

    pet.ime = ime || pet.ime;
    pet.pasma = pasma || pet.pasma;
    pet.datum_rojstva = datum_rojstva || pet.datum_rojstva;
    pet.spol = spol || pet.spol;
    pet.vrsta = vrsta || pet.vrsta;

    if (req.file) {
      pet.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedPet = await pet.save();
    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /:id
 * Izbriše ljubljenčka
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({
      _id: req.params.id,
      owner: req.user,
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json({ message: "Pet successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;