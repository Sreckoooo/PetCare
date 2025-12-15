import express from "express";
import Opomnik from "../models/Opomnik.js";
import Pet from "../models/Pet.js";
import protect from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /
 * Ustvari nov opomnik (splošni ali povezan z obrokom, aktivnostjo ali zdravilom)
 */
router.post("/", protect, async (req, res) => {
  try {
    const { datum, ura, naziv, tip, pet, zdravilo, aktivnost, obrok } = req.body;

    if (!datum || !ura || !naziv || !pet) {
      return res.status(400).json({ message: "Manjkajo obvezna polja." });
    }

    // Preveri, ali ljubljenček pripada uporabniku
    const petCheck = await Pet.findOne({ _id: pet, owner: req.user._id });
    if (!petCheck) {
      return res.status(403).json({ message: "Nimaš dostopa do tega ljubljenčka." });
    }

    // Opomnik je lahko povezan samo z eno entiteto
    const povezave = [zdravilo, aktivnost, obrok].filter(Boolean);
    if (povezave.length > 1) {
      return res.status(400).json({
        message: "Opomnik je lahko povezan samo z eno stvarjo.",
      });
    }

    const opomnik = await Opomnik.create({
      datum,
      ura,
      naziv,
      tip,
      pet,
      user: req.user._id,
      zdravilo: tip === "zdravilo" ? zdravilo : null,
      aktivnost: tip === "aktivnost" ? aktivnost : null,
      obrok: tip === "obrok" ? obrok : null,
    });

    res.status(201).json(opomnik);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /
 * Pridobi vse opomnike prijavljenega uporabnika
 */
router.get("/", protect, async (req, res) => {
  try {
    const filter = { user: req.user._id };

    // Po želji vrne samo prihodnje opomnike
    if (req.query.onlyFuture === "true") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.datum = { $gte: today };
    }

    const opomniki = await Opomnik.find(filter)
      .populate("pet", "ime")
      .populate("zdravilo", "ime")
      .populate("aktivnost", "naziv")
      .populate("obrok", "ime ura")
      .sort({ datum: 1, ura: 1 });

    res.json(opomniki);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /pet/:petId
 * Pridobi vse opomnike za določenega ljubljenčka
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

    const filter = {
      pet: pet._id,
      user: req.user._id,
    };

    // Po želji vrne samo prihodnje opomnike
    if (req.query.onlyFuture === "true") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.datum = { $gte: today };
    }

    const opomniki = await Opomnik.find(filter)
      .populate("pet", "ime")
      .populate("zdravilo", "ime")
      .populate("aktivnost", "naziv")
      .populate("obrok", "ime ura")
      .sort({ datum: 1, ura: 1 });

    res.json(opomniki);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /:id/status
 * Posodobi status opomnika (pending / done)
 */
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "done"].includes(status)) {
      return res.status(400).json({ message: "Neveljaven status" });
    }

    const opomnik = await Opomnik.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!opomnik) {
      return res.status(404).json({ message: "Opomnik ni najden" });
    }

    opomnik.status = status;
    await opomnik.save();

    res.json(opomnik);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /:id
 * Posodobi obstoječ opomnik
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const opomnik = await Opomnik.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!opomnik) {
      return res.status(404).json({ message: "Opomnik ni najden" });
    }

    const { datum, ura, naziv, status, tip, pet, zdravilo, aktivnost, obrok } =
      req.body;

    // Opomnik je lahko povezan samo z eno entiteto
    const povezave = [zdravilo, aktivnost, obrok].filter(Boolean);
    if (povezave.length > 1) {
      return res
        .status(400)
        .json({ message: "Opomnik je lahko vezan samo na eno stvar." });
    }

    opomnik.datum = datum ?? opomnik.datum;
    opomnik.ura = ura ?? opomnik.ura;
    opomnik.naziv = naziv ?? opomnik.naziv;
    opomnik.status = status ?? opomnik.status;
    opomnik.tip = tip ?? opomnik.tip;
    opomnik.pet = pet ?? opomnik.pet;

    opomnik.zdravilo =
      opomnik.tip === "zdravilo" ? zdravilo ?? opomnik.zdravilo : null;
    opomnik.aktivnost =
      opomnik.tip === "aktivnost" ? aktivnost ?? opomnik.aktivnost : null;
    opomnik.obrok =
      opomnik.tip === "obrok" ? obrok ?? opomnik.obrok : null;

    const updated = await opomnik.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE /:id
 * Izbriše opomnik
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const opomnik = await Opomnik.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!opomnik) {
      return res.status(404).json({ message: "Opomnik ni najden" });
    }

    res.json({ message: "Opomnik izbrisan" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;