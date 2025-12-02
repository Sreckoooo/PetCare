import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import petRoutes from "./routes/petRoutes.js";
import zdraviloRoutes from './routes/zdraviloRoutes.js';
import obrokRoutes from './routes/obrokRoutes.js';
import aktivnostRoutes from './routes/aktivnostRoutes.js';
import pregledRoutes from './routes/pregledRoutes.js';
import opomnikRoutes from './routes/opomnikRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use("/api/pets", petRoutes);
app.use('/api/zdravila', zdraviloRoutes);
app.use('/api/obroki', obrokRoutes);
app.use('/api/aktivnosti', aktivnostRoutes);
app.use('/api/pregledi', pregledRoutes);
app.use('/api/opomniki', opomnikRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));