import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Uporabnik ne obstaja' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Napačno geslo' });

  res.json({ message: 'Prijava uspešna', user: { name: user.name, email: user.email } });
});

export default router;