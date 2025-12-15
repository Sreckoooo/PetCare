import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware za zaščito routov.
 * Preveri JWT token in doda uporabnika v req.user
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Preveri, ali obstaja Authorization header z Bearer tokenom
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Ni dostopa, manjka token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Validacija JWT tokena
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Pridobi uporabnika iz baze (brez gesla)
    const user = await User.findById(decoded.id).select("-geslo");
    if (!user) {
      return res.status(401).json({ message: "Uporabnik ne obstaja" });
    }

    // Dodaj uporabnika v request objekt
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Neveljaven ali potekel token" });
  }
};

export default protect;