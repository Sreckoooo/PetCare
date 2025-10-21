import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Registracija
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Vsa polja so obvezna' });

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Uporabnik že obstaja' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  const { password: pw, ...userWithoutPassword } = user._doc;

  res.status(201).json({ message: 'Registracija uspešna', user: userWithoutPassword });
});

// Prijava (z JWT)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email in geslo sta obvezna' });

  const extraFields = Object.keys(req.body).filter(
    key => !['email', 'password'].includes(key)
  );
  if (extraFields.length > 0)
    return res.status(400).json({ message: `Nepričakovana polja: ${extraFields.join(', ')}` });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Uporabnik ne obstaja' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Napačno geslo' });

  // 🔐 Ustvari JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Prijava uspešna',
    user: { name: user.name, email: user.email },
    token,
  });
});

// GET /api/users (brez gesel)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;