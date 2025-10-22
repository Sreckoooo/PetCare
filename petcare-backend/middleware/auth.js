import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Ni dostopa, manjka token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // v req.user bo zdaj ID uporabnika iz tokena
    next();
  } catch (error) {
    res.status(401).json({ message: "Neveljaven ali potekel token" });
  }
};

export default protect;