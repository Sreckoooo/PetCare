import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!form.email.trim() || !form.password.trim()) {
            setError("Izpolnite vsa polja.");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/users/login`, {
                email: form.email.trim(),
                geslo: form.password
            });

            login(res.data);

            navigate("/main");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Prijava ni uspela."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page fade">

            <div className="auth-container">

                <div className="card auth-card">

                    <div className="auth-header">
                        <h1 className="auth-title">PetCare</h1>

                        <p className="auth-subtitle">
                            Dobrodošli nazaj.
                            Prijavite se in nadaljujte s skrbjo za svoje
                            ljubljenčke.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="auth-group">
                            <label>E-pošta</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Vnesite e-pošto"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>

                        <div className="auth-group">
                            <label>Geslo</label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Vnesite geslo"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                disabled={loading}
                            />
                        </div>

                        <div className="auth-actions">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Prijavljanje..." : "Prijava"}
                            </button>
                        </div>

                    </form>

                    <div className="auth-divider">
                        ali
                    </div>

                    <div className="auth-footer">

                        <p>
                            Še nimate računa?
                        </p>

                        <Link
                            to="/signup"
                            className="auth-link"
                        >
                            Ustvari račun
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;