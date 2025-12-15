import express from "express";
import protect from "../middleware/auth.js";
import Pet from "../models/Pet.js";
import Zdravilo from "../models/Zdravilo.js";
import PetZdravilo from "../models/PetZdravilo.js";
import Opomnik from "../models/Opomnik.js";

const router = express.Router();

/**
 * GET /
 * Pridobi vsa zdravljenja za prijavljenega uporabnika
 */
router.get("/", protect, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id }).select("_id");
    const petIds = pets.map((p) => p._id);

    const povezave = await PetZdravilo.find({ pet: { $in: petIds } })
      .populate("pet", "ime pasma vrsta spol")
      .populate("zdravilo", "ime vrsta_odmerka");

    res.json(povezave);
  } catch (error) {
    res.status(500).json({ message: "Napaka pri pridobivanju zdravljenj." });
  }
});

/**
 * GET /pet/:petId
 * Pridobi vsa zdravljenja za določenega ljubljenčka
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

    const zdravljenja = await PetZdravilo.find({ pet: pet._id }).populate(
      "zdravilo",
      "ime vrsta_odmerka"
    );

    res.json(zdravljenja);
  } catch (error) {
    res.status(500).json({ message: "Napaka pri nalaganju zdravljenj." });
  }
});

/**
 * POST /
 * Ustvari novo zdravljenje za ljubljenčka
 */
router.post("/", protect, async (req, res) => {
  try {
    const { pet, zdravilo, odmerek, pogostost, datum_zacetka, datum_konca } =
      req.body;

    if (!pet || !zdravilo || !odmerek || !pogostost || !datum_zacetka) {
      return res
        .status(400)
        .json({ message: "Vsa obvezna polja morajo biti izpolnjena." });
    }

    const petCheck = await Pet.findOne({ _id: pet, owner: req.user._id });
    if (!petCheck) {
      return res
        .status(403)
        .json({ message: "Do tega ljubljenčka nimaš dostopa." });
    }

    const zdraviloCheck = await Zdravilo.findById(zdravilo);
    if (!zdraviloCheck) {
      return res.status(404).json({ message: "Zdravilo ne obstaja." });
    }

    const povezava = await PetZdravilo.create({
      pet,
      zdravilo,
      odmerek,
      pogostost,
      datum_zacetka,
      datum_konca,
    });

    // Samodejno ustvari opomnik, če zdravljenje še ni poteklo
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(datum_zacetka);
    startDate.setHours(0, 0, 0, 0);

    if (startDate >= today) {
      const opomnik = await Opomnik.create({
        datum: datum_zacetka,
        ura: "08:00",
        naziv: `Zdravljenje: ${zdraviloCheck.ime}`,
        tip: "zdravilo",
        pet,
        zdravilo,
        user: req.user._id,
      });

      povezava.opomnik = opomnik._id;
      await povezava.save();
    }

    const populated = await povezava.populate(
      "zdravilo",
      "ime vrsta_odmerka"
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Napaka pri ustvarjanju vnosa." });
  }
});

/**
 * PUT /:id
 * Posodobi obstoječe zdravljenje
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const { odmerek, pogostost, datum_zacetka, datum_konca } = req.body;

    let vnos = await PetZdravilo.findById(req.params.id).populate("pet");

    if (!vnos) {
      return res.status(404).json({ message: "Vnos ni najden." });
    }

    if (vnos.pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Nimaš dovoljenja za urejanje." });
    }

    vnos.odmerek = odmerek ?? vnos.odmerek;
    vnos.pogostost = pogostost ?? vnos.pogostost;
    vnos.datum_zacetka = datum_zacetka ?? vnos.datum_zacetka;
    vnos.datum_konca = datum_konca ?? vnos.datum_konca;

    const updated = await vnos.save();

    await Opomnik.findOneAndUpdate(
      { zdravilo: vnos.zdravilo, pet: vnos.pet._id, tip: "zdravilo" },
      {
        datum: vnos.datum_zacetka,
        naziv: "Zdravljenje posodobljeno",
      }
    );

    const populated = await updated.populate(
      "zdravilo",
      "ime vrsta_odmerka"
    );

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Napaka pri posodabljanju." });
  }
});

/**
 * DELETE /:id
 * Izbriše zdravljenje in pripadajoč opomnik
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const vnos = await PetZdravilo.findById(req.params.id).populate("pet");

    if (!vnos) {
      return res.status(404).json({ message: "Vnos ni najden." });
    }

    if (vnos.pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Nimaš dovoljenja za brisanje." });
    }

    await Opomnik.findOneAndDelete({
      zdravilo: vnos.zdravilo,
      pet: vnos.pet._id,
      tip: "zdravilo",
    });

    await vnos.deleteOne();

    res.json({ message: "Vnos uspešno izbrisan." });
  } catch (error) {
    res.status(500).json({ message: "Napaka pri brisanju." });
  }
});

export default router;