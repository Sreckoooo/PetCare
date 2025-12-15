import express from "express";
import Obrok from "../models/Obrok.js";
import Opomnik from "../models/Opomnik.js";
import protect from "../middleware/auth.js";

const router = express.Router();

/**
 * Preveri, ali je podan datum danes ali v prihodnosti
 */
const isTodayOrFuture = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(dateStr + "T00:00:00");
  return d >= today;
};

/**
 * POST /
 * Ustvari nov obrok in po potrebi povezan opomnik
 */
router.post("/", protect, async (req, res) => {
  const { ime, datum, ura, pet } = req.body;

  if (!ime || !datum || !ura || !pet) {
    return res.status(400).json({ message: "Vsa obvezna polja niso izpolnjena" });
  }

  try {
    const user = req.user;

    const obrok = await Obrok.create({
      ime,
      datum,
      ura,
      pet,
      user,
    });

    if (isTodayOrFuture(datum)) {
      await Opomnik.create({
        datum,
        ura,
        naziv: ime,
        tip: "obrok",
        status: "pending",
        pet,
        obrok: obrok._id,
        user: req.user._id,
      });
    }

    res.status(201).json(obrok);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /pet/:petId
 * Pridobi vse obroke za določenega ljubljenčka
 */
router.get("/pet/:petId", protect, async (req, res) => {
  try {
    const obroki = await Obrok.find({
      pet: req.params.petId,
      user: req.user._id,
    }).sort({ datum: 1, ura: 1 });

    res.json(obroki);
  } catch (error) {
    res.status(500).json({ message: "Napaka pri nalaganju obrokov" });
  }
});

/**
 * GET /
 * Pridobi vse obroke prijavljenega uporabnika
 */
router.get("/", protect, async (req, res) => {
  try {
    const obroki = await Obrok.find({ user: req.user }).populate(
      "pet",
      "ime pasma -_id"
    );

    res.json(obroki);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /:id
 * Posodobi obrok in pripadajoč opomnik
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const obrok = await Obrok.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!obrok) {
      return res.status(404).json({ message: "Obrok ni najden" });
    }

    const { ime, datum, ura, pet } = req.body;

    obrok.ime = ime || obrok.ime;
    obrok.datum = datum || obrok.datum;
    obrok.ura = ura || obrok.ura;
    obrok.pet = pet || obrok.pet;

    const updatedObrok = await obrok.save();

    if (isTodayOrFuture(obrok.datum)) {
      await Opomnik.findOneAndUpdate(
        { obrok: obrok._id },
        {
          datum: obrok.datum,
          ura: obrok.ura,
          naziv: obrok.ime,
          tip: "obrok",
          status: "pending",
          pet: obrok.pet,
          user: req.user._id,
        },
        { upsert: true }
      );
    } else {
      await Opomnik.findOneAndDelete({ obrok: obrok._id });
    }

    res.json(updatedObrok);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /:id
 * Izbriše obrok in pripadajoč opomnik
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const obrok = await Obrok.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!obrok) {
      return res.status(404).json({ message: "Obrok ni najden" });
    }

    await Opomnik.findOneAndDelete({ obrok: obrok._id });

    res.json({ message: "Obrok uspešno izbrisan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;