import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/users/login`, {
        email: form.email,
        geslo: form.password
      });
      login(res.data);
      navigate('/main'); 
    } catch (err) {
      console.error(err);
      setError('Napaka pri prijavi. Preveri email in geslo.');
    }
  };

  const goToSignup = () => navigate('/signup');

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1>Hello,</h1>
          <h1>Welcome Back!</h1>
          <p className="subtitle">
            Water is life. Water is a basic human need. In various lines of life, humans need water.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Abduldul@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="bottom-row">
            <span className="small-text">
              Nimate računa?{' '}
              <button type="button" className="link" onClick={goToSignup}>
                Registrirajte se
              </button>
            </span>
          </div>

          <button type="submit" className="cta-btn">Get Started</button>
        </form>
      </div>

      <div className="decor decor-1"></div>
      <div className="decor decor-2"></div>
    </div>
  );
};

export default Login;