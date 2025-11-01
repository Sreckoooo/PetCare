import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './SignUp.css';

const API_URL = process.env.REACT_APP_API_URL;

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    ime: '',
    priimek: '',
    email: '',
    geslo: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.agreeToTerms) {
      setError('Prosimo, sprejmite pogoje uporabe');
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/users/register`, {
        ime: formData.ime,
        priimek: formData.priimek,
        email: formData.email,
        geslo: formData.geslo
      });
      login(res.data); 
      navigate('/main'); 
    } catch (err) {
      console.error(err);
      setError('Napaka pri registraciji. Email je morda že uporabljen.');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>Create New</h1>
          <h1>Account</h1>
          <p className="signup-subtitle">
            Water is life. Water is a basic human need. In various areas of life, humans need water.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>Ime</label>
            <input
              type="text"
              name="ime"
              value={formData.ime}
              onChange={handleChange}
              placeholder="Abdul"
              required
            />
          </div>

          <div className="form-group">
            <label>Priimek</label>
            <input
              type="text"
              name="priimek"
              value={formData.priimek}
              onChange={handleChange}
              placeholder="Dudul"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Abduldudul@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Geslo</label>
            <input
              type="password"
              name="geslo"
              value={formData.geslo}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="terms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <label htmlFor="terms">
              Strinjam se s <span className="link-text">pogoji uporabe</span> in{' '}
              <span className="link-text">politiko zasebnosti</span>
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="bottom-row">
            <span>Že imate račun? </span>
            <span className="link-text" onClick={handleLogin}>Prijavite se</span>
          </div>

          <button type="submit" className="signup-btn">Get Started</button>
        </form>
      </div>

      <div className="decoration-circle circle-1"></div>
      <div className="decoration-circle circle-2"></div>
    </div>
  );
};

export default SignupPage;