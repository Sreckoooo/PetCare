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
      setError('Prosimo, sprejmite pogoje uporabe.');
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

  const goToLogin = () => navigate('/login');

  // generiranje datotek za pogoje / politiko
  const openPolicyFile = (kind) => {
    const isTerms = kind === 'terms';
    const title = isTerms ? 'Pogoji uporabe' : 'Politika zasebnosti';
    const filename = isTerms ? 'pogoji-uporabe.txt' : 'politika-zasebnosti.txt';

    const rules = isTerms
      ? [
          '1. Z uporabo aplikacije PetCare se strinjate, da boste podatke vnašali resnično in odgovorno.',
          '2. Aplikacija je namenjena organizaciji skrbi za ljubljenčke in ne nadomešča veterinarskega nasveta.',
          '3. Uporabnik je odgovoren za varovanje svojega gesla in vse aktivnosti v svojem računu.',
          '4. Prepovedana je zloraba aplikacije (spam, poskusi vdora, škodljiva vsebina).',
          '5. PetCare si pridržuje pravico do sprememb ali ukinitve računa ob kršitvah.'
        ]
      : [
          '1. Zbiramo le podatke, potrebne za delovanje aplikacije.',
          '2. Vaših podatkov ne prodajamo tretjim osebam.',
          '3. Podatke hranimo le toliko časa, kolikor je potrebno za namen uporabe.',
          '4. Uporabljamo osnovne varnostne ukrepe za zaščito podatkov.',
          '5. Za vprašanja glede zasebnosti se lahko obrnete na podporo PetCare.'
        ];

    const content = `${title}\n\n${rules.join('\n')}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank', 'noopener,noreferrer');

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1>Ustvari račun</h1>
          <p className="subtitle">
            Registrirajte se in ustvarite svoj PetCare račun za enostavno skrb
            in upravljanje vseh vaših ljubljenčkov.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="ime"
              value={formData.ime}
              onChange={handleChange}
              placeholder="Ime"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="priimek"
              value={formData.priimek}
              onChange={handleChange}
              placeholder="Priimek"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@primer.si"
              required
            />
          </div>

          <div className="form-group">
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
              Strinjam se s{' '}
              <button
                type="button"
                className="link"
                onClick={() => openPolicyFile('terms')}
              >
                pogoji uporabe
              </button>{' '}
              in{' '}
              <button
                type="button"
                className="link"
                onClick={() => openPolicyFile('privacy')}
              >
                politiko zasebnosti
              </button>
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="bottom-row">
            <span className="small-text">
              Že imate račun?{' '}
              <button type="button" className="link" onClick={goToLogin}>
                Prijavite se
              </button>
            </span>
          </div>

          <button type="submit" className="cta-btn">
            Registracija
          </button>
        </form>
      </div>

      {/* isti dekorji kot Login */}
      <div className="decor decor-1"></div>
      <div className="decor decor-2"></div>
    </div>
  );
};

export default SignupPage;