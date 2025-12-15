import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import protect from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /register
 * Registracija novega uporabnika
 */
router.post("/register", async (req, res) => {
  const { ime, priimek, email, geslo } = req.body;

  if (!ime || !priimek || !email || !geslo) {
    return res.status(400).json({ message: "Vsa polja so obvezna" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Uporabnik že obstaja" });
  }

  const hashedPassword = await bcrypt.hash(geslo, 10);
  const user = await User.create({
    ime,
    priimek,
    email,
    geslo: hashedPassword,
  });

  const { geslo: pw, ...userWithoutPassword } = user._doc;

  res
    .status(201)
    .json({ message: "Registracija uspešna", user: userWithoutPassword });
});

/**
 * POST /login
 * Prijava uporabnika in generiranje JWT žetona
 */
router.post("/login", async (req, res) => {
  const { email, geslo } = req.body;

  if (!email || !geslo) {
    return res
      .status(400)
      .json({ message: "Email in geslo sta obvezna" });
  }

  // Dovoli samo pričakovana polja
  const extraFields = Object.keys(req.body).filter(
    (key) => !["email", "geslo"].includes(key)
  );
  if (extraFields.length > 0) {
    return res.status(400).json({
      message: `Nepričakovana polja: ${extraFields.join(", ")}`,
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Uporabnik ne obstaja" });
  }

  const isMatch = await bcrypt.compare(geslo, user.geslo);
  if (!isMatch) {
    return res.status(401).json({ message: "Napačno geslo" });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Prijava uspešna",
    user: {
      ime: user.ime,
      priimek: user.priimek,
      email: user.email,
    },
    token,
  });
});

/**
 * GET /me
 * Pridobi podatke prijavljenega uporabnika
 */
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

/**
 * PUT /me
 * Urejanje profila in menjava gesla
 */
router.put("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Uporabnik ni najden" });
    }

    const { ime, priimek, trenutnoGeslo, novoGeslo } = req.body;

    // Posodobitev osnovnih podatkov
    if (ime) user.ime = ime;
    if (priimek) user.priimek = priimek;

    // Menjava gesla
    if (novoGeslo) {
      if (!trenutnoGeslo) {
        return res.status(400).json({
          message: "Za spremembo gesla morate vnesti trenutno geslo",
        });
      }

      const isMatch = await bcrypt.compare(trenutnoGeslo, user.geslo);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Trenutno geslo ni pravilno" });
      }

      const isSamePassword = await bcrypt.compare(novoGeslo, user.geslo);
      if (isSamePassword) {
        return res.status(400).json({
          message: "Novo geslo ne sme biti enako trenutnemu",
        });
      }

      user.geslo = await bcrypt.hash(novoGeslo, 10);
    }

    const updatedUser = await user.save();
    const { geslo, ...userWithoutPassword } = updatedUser._doc;

    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;