import express from "express";
import Aktivnost from "../models/Aktivnost.js";
import protect from "../middleware/auth.js";
import Opomnik from "../models/Opomnik.js";

const router = express.Router();

/**
 * POST /
 * Ustvari novo aktivnost in po potrebi povezan opomnik
 */
router.post("/", protect, async (req, res) => {
  const { naziv, trajanje, datum, ura, pet } = req.body;

  if (!naziv || !trajanje || !datum || !ura || !pet) {
    return res.status(400).json({ message: "Vsa obvezna polja niso izpolnjena" });
  }

  try {
    const user = req.user;

    // Ustvarjanje aktivnosti
    const aktivnost = await Aktivnost.create({
      naziv,
      trajanje,
      datum,
      ura,
      pet,
      user,
    });

    // Preveri, ali je datum danes ali v prihodnosti
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activityDate = new Date(datum);
    activityDate.setHours(0, 0, 0, 0);

    // Ustvari opomnik samo za aktualne ali prihodnje aktivnosti
    if (activityDate >= today) {
      await Opomnik.create({
        datum,
        ura,
        naziv: `Aktivnost: ${naziv}`,
        tip: "aktivnost",
        pet,
        aktivnost: aktivnost._id,
        user: user._id,
      });
    }

    res.status(201).json(aktivnost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /
 * Pridobi vse aktivnosti prijavljenega uporabnika
 */
router.get("/", protect, async (req, res) => {
  try {
    const aktivnosti = await Aktivnost.find({ user: req.user }).populate(
      "pet",
      "ime pasma -_id"
    );

    res.json(aktivnosti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /pet/:petId
 * Pridobi vse aktivnosti za določenega ljubljenčka
 */
router.get("/pet/:petId", protect, async (req, res) => {
  try {
    const aktivnosti = await Aktivnost.find({
      pet: req.params.petId,
      user: req.user._id,
    }).populate("pet", "ime pasma");

    res.json(aktivnosti);
  } catch (error) {
    res.status(500).json({ message: "Napaka pri nalaganju aktivnosti" });
  }
});

/**
 * PUT /:id
 * Posodobi obstoječo aktivnost in pripadajoč opomnik
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const aktivnost = await Aktivnost.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!aktivnost) {
      return res.status(404).json({ message: "Aktivnost ni najdena" });
    }

    const { naziv, trajanje, datum, ura, pet } = req.body;

    aktivnost.naziv = naziv || aktivnost.naziv;
    aktivnost.trajanje = trajanje || aktivnost.trajanje;
    aktivnost.datum = datum || aktivnost.datum;
    aktivnost.ura = ura || aktivnost.ura;
    aktivnost.pet = pet || aktivnost.pet;

    const updatedAktivnost = await aktivnost.save();

    // Posodobitev povezanega opomnika
    await Opomnik.findOneAndUpdate(
      { aktivnost: aktivnost._id, user: req.user._id },
      {
        datum: aktivnost.datum,
        ura: aktivnost.ura,
        naziv: `Aktivnost: ${aktivnost.naziv}`,
      }
    );

    res.json(updatedAktivnost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /:id
 * Izbriše aktivnost in povezan opomnik
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const aktivnost = await Aktivnost.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!aktivnost) {
      return res.status(404).json({ message: "Aktivnost ni najdena" });
    }

    await Opomnik.deleteOne({
      aktivnost: aktivnost._id,
      user: req.user._id,
    });

    res.json({ message: "Aktivnost uspešno izbrisana" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;