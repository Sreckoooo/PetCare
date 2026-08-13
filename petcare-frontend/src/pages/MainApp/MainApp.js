import React, { useEffect, useState } from "react";
import "./MainApp.css";
import Sidebar from "../../components/Sidebar/Sidebar";

import {
  getOpomniki,
  getObroki,
  getAktivnosti,
  getPets,
  getPetZdravilaByPet,
} from "../../api/api";

/* ================= POMOŽNE FUNKCIJE ================= */

const formatDateSI = (date) =>
  date.toLocaleDateString("sl-SI", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatTimeAMPM = (time) => {
  if (!time) return "";

  const [h, m] = time.split(":");
  let hour = Number(h);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${m} ${ampm}`;
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/* ================= KOMPONENTA ================= */

const MainApp = () => {
  const token = localStorage.getItem("token");

  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  // Trenutni dan za mobilni koledar
  const [mobileDayIndex, setMobileDayIndex] = useState(0);

  /* ================= NALAGANJE PODATKOV ================= */

  useEffect(() => {
    if (!token) return;

    const loadDashboard = async () => {
      try {
        const [pets, opomniki, obroki, aktivnosti] = await Promise.all([
          getPets(token),
          getOpomniki(token),
          getObroki(token),
          getAktivnosti(token),
        ]);

        /* ===== ZDRAVLJENJA ===== */

        let zdravljenja = [];

        for (const pet of pets) {
          const z = await getPetZdravilaByPet(pet._id, token);

          zdravljenja.push(
            ...z.map((zz) => ({
              ...zz,
              petIme: pet.ime,
            }))
          );
        }

        /* ===== KOLEDAR ===== */

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const daysInMonth = new Date(
          year,
          month + 1,
          0
        ).getDate();

        const days = [];

        for (let d = 1; d <= daysInMonth; d++) {
          days.push(new Date(year, month, d));
        }

        const calendar = days.map((day) => {
          const events = [];
          const currentDay = normalizeDate(day);

          /* ===== OPOMNIKI ===== */

          opomniki.forEach((o) => {
            if (
              o.tip === "obrok" ||
              o.tip === "aktivnost" ||
              o.tip === "zdravljenje" ||
              o.zdravilo ||
              o.zdravljenjeId
            ) {
              return;
            }

            if (isSameDay(new Date(o.datum), day)) {
              events.push({
                id: o._id,
                type: "opomnik",
                title: o.naziv,
                time: o.ura,
                pet: o.pet?.ime || "",
              });
            }
          });

          /* ===== OBROKI ===== */

          obroki.forEach((o) => {
            if (isSameDay(new Date(o.datum), day)) {
              events.push({
                id: o._id,
                type: "obrok",
                title: o.ime,
                time: o.ura,
                pet: o.pet?.ime || "",
              });
            }
          });

          /* ===== AKTIVNOSTI ===== */

          aktivnosti.forEach((a) => {
            if (isSameDay(new Date(a.datum), day)) {
              events.push({
                id: a._id,
                type: "aktivnost",
                title: a.naziv,
                time: a.ura,
                pet: a.pet?.ime || "",
              });
            }
          });

          /* ===== ZDRAVLJENJA ===== */

          zdravljenja.forEach((z) => {
            const start = normalizeDate(z.datum_zacetka);

            const end = z.datum_konca
              ? normalizeDate(z.datum_konca)
              : null;

            if (
              start <= currentDay &&
              (!end || end >= currentDay)
            ) {
              events.push({
                id: z._id,
                type: "zdravljenje",
                title: z.zdravilo?.ime,
                time: "",
                pet: z.petIme,
              });
            }
          });

          return {
            date: day,
            events,
          };
        });

        setCalendarDays(calendar);

        /* ===== NASTAVI MOBILNI KOLEDAR NA DANES ===== */

        const todayIndex = calendar.findIndex((day) =>
          isSameDay(day.date, new Date())
        );

        if (todayIndex !== -1) {
          setMobileDayIndex(todayIndex);
        }
      } catch (err) {
        console.error(
          "Napaka pri nalaganju nadzorne plošče",
          err
        );
      }
    };

    loadDashboard();
  }, [token]);

  /* ================= DOGODKI ZA DANES ================= */

  const today = calendarDays.find((d) =>
    isSameDay(d.date, new Date())
  );

  const todayEvents = today ? today.events : [];

  const todayByType = {
    obrok: todayEvents.filter(
      (e) => e.type === "obrok"
    ),

    aktivnost: todayEvents.filter(
      (e) => e.type === "aktivnost"
    ),

    zdravljenje: todayEvents.filter(
      (e) => e.type === "zdravljenje"
    ),

    opomnik: todayEvents.filter(
      (e) => e.type === "opomnik"
    ),
  };

  /* ================= MOBILNI KOLEDAR ================= */

  const mobileDay = calendarDays[mobileDayIndex];

  const previousDay = () => {
    if (mobileDayIndex > 0) {
      setMobileDayIndex((index) => index - 1);
    }
  };

  const nextDay = () => {
    if (mobileDayIndex < calendarDays.length - 1) {
      setMobileDayIndex((index) => index + 1);
    }
  };

  /* ================= PRIKAZ ENEGA DNEVA ================= */

  const renderCalendarDay = (day) => {
    if (!day) return null;

    return (
      <div className="calendar-day">
        <h3>{formatDateSI(day.date)}</h3>

        {day.events.length === 0 && (
          <p className="calendar-empty">
            Ni dogodkov
          </p>
        )}

        {day.events.map((e) => (
          <div
            key={`${e.type}-${e.id}`}
            className={`calendar-event ${e.type}`}
          >
            <span className="event-title">
              {e.title}
            </span>

            {e.time && (
              <span className="event-time">
                {formatTimeAMPM(e.time)}
              </span>
            )}

            {e.pet && (
              <span className="event-pet">
                🐾 {e.pet}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  /* ================= RENDER ================= */

  return (
    <div className="app-layout">
      <Sidebar active="home" />

      <div className="page-content main-app-page">

        {/* ===== NASLOV ===== */}

        <h1>Nadzorna plošča</h1>

        <p className="dashboard-subtitle">
          Pregled za danes
        </p>

        {/* ===== KARTICE ===== */}

        <div className="dashboard-cards">

          {[
            "obrok",
            "aktivnost",
            "zdravljenje",
            "opomnik",
          ].map((type) => (
            <div
              key={type}
              className={`card ${type} ${
                selectedType === type
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedType((p) =>
                  p === type ? null : type
                )
              }
            >

              {type === "obrok" &&
                "🍽 Obroki"}

              {type === "aktivnost" &&
                "🏃 Aktivnosti"}

              {type === "zdravljenje" &&
                "💊 Zdravljenja"}

              {type === "opomnik" &&
                "🔔 Opomniki"}

              :{" "}
              {todayByType[type].length}

              {selectedType === type && (
                <div className="card-content">

                  {todayByType[type].length === 0 && (
                    <div className="card-item">
                      <span className="item-main">
                        Danes ni dogodkov
                      </span>
                    </div>
                  )}

                  {todayByType[type].map((e) => (
                    <div
                      key={e.id}
                      className="card-item"
                    >
                      <span className="item-main">
                        {e.title}
                      </span>

                      <span className="item-meta">

                        {e.pet && (
                          <span>
                            {e.pet}
                          </span>
                        )}

                        {e.time && (
                          <span className="item-time">
                            {formatTimeAMPM(
                              e.time
                            )}
                          </span>
                        )}

                      </span>
                    </div>
                  ))}

                </div>
              )}

            </div>
          ))}

        </div>

        {/* ================================================= */}
        {/* DESKTOP KOLEDAR */}
        {/* ================================================= */}

        <div className="calendar-desktop">
          <div className="calendar-grid">

            {calendarDays.map((day) => (
              <div
                key={day.date.toISOString()}
                className="calendar-day"
              >
                <h3>
                  {formatDateSI(day.date)}
                </h3>

                {day.events.length === 0 && (
                  <p className="calendar-empty">
                    Ni dogodkov
                  </p>
                )}

                {day.events.map((e) => (
                  <div
                    key={`${e.type}-${e.id}`}
                    className={`calendar-event ${e.type}`}
                  >
                    <span className="event-title">
                      {e.title}
                    </span>

                    {e.time && (
                      <span className="event-time">
                        {formatTimeAMPM(e.time)}
                      </span>
                    )}

                    {e.pet && (
                      <span className="event-pet">
                        🐾 {e.pet}
                      </span>
                    )}
                  </div>
                ))}

              </div>
            ))}

          </div>
        </div>

        {/* ================================================= */}
        {/* MOBILNI KOLEDAR */}
        {/* ================================================= */}

        <div className="calendar-mobile">

          <button
            className="calendar-arrow"
            onClick={previousDay}
            disabled={mobileDayIndex === 0}
            aria-label="Prejšnji dan"
          >
            ←
          </button>

          <div className="calendar-mobile-day">
            {renderCalendarDay(mobileDay)}
          </div>

          <button
            className="calendar-arrow"
            onClick={nextDay}
            disabled={
              mobileDayIndex ===
              calendarDays.length - 1
            }
            aria-label="Naslednji dan"
          >
            →
          </button>

        </div>

      </div>
    </div>
  );
};

export default MainApp;