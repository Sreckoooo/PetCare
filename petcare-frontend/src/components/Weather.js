import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
    const [temp, setTemp] = useState('--');
    const [icon, setIcon] = useState('01d');
    const [loading, setLoading] = useState(true);
    const city = 'PTUJ'; // vedno prikazano ime mesta

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/weather'); // ali Render URL
                setTemp(Math.round(res.data.main.temp));
                setIcon(res.data.weather[0].icon);
            } catch (err) {
                console.error('Napaka pri pridobivanju vremena:', err);
                setTemp('--');
                setIcon('01d');
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    return (
        <div className="sidebar-weather">
            <div className="weather-left">
                <span className="weather-city">{city}</span>
            </div>
            <div className="weather-right">
                <img
                    src={`http://openweathermap.org/img/wn/${icon}.png`}
                    alt="weather icon"
                    className="weather-icon"
                />
                <span className="weather-temp">{loading ? '...' : temp}°C</span>
            </div>
        </div>
    );
};

export default Weather;