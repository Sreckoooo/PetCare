import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/', async (req, res) => {
    const API_KEY = 'REMOVED_OPENWEATHER_API_KEY'; 
    const lat = 46.4192;
    const lon = 15.8701;

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=sl`
        );
        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Napaka pri pridobivanju vremena' });
    }
});

export default router;