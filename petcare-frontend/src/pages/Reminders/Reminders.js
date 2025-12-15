import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  getPets,
  getOpomnikiByPet,
  createOpomnik,
  deleteOpomnik,
  getPetZdravilaByPet,
  getObrokiByPet,
  getAktivnostiByPet,
  createObrok,
  createAktivnost,
  createPetZdravilo,
  getZdravila,
} from "../../api/api";
import "../../styles/layout.css";
import "./Reminders.css";


const getDoneMap = () =>
  JSON.parse(localStorage.getItem("doneReminders") || "{}");

const saveDoneMap = (map) =>
  localStorage.setItem("doneReminders", JSON.stringify(map));

const getHiddenReminders = () =>
  JSON.parse(localStorage.getItem("hiddenReminders") || "[]");

const saveHiddenReminders = (list) =>
  localStorage.setItem("hiddenReminders", JSON.stringify(list));

/* =========================
   HELPERS
========================= */
const formatTime = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = ((hour + 11) % 12 + 1);
  return `${formattedHour}:${m} ${suffix}`;
};

const toDate = (datum, ura = "00:00") => {
  if (!datum) return null;
  const d = new Date(datum);
  if (isNaN(d)) return null;

  if (ura) {
    const [h, m] = ura.split(":");
    d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
  }
  return d;
};

const formatDateLabel = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;

  return d.toLocaleDateString("sl-SI", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const isPastDate = (dateStr) => {
  if (!dateStr) return false;
  const selected = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today;
};

/* =========================
   COMPONENT
========================= */
const Reminders = () => {
  const token = localStorage.getItem("token");

  const [pets, setPets] = useState([]);
  const [zdravila, setZdravila] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [items, setItems] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    naziv: "",
    tip: "splošni",
    datum: "",
    datum_konca: "",
    ura: "",
    trajanje: "",
    zdraviloId: "",
    odmerek: "",
    pogostost: "",
  });

  const [view, setView] = useState("vse");
  const [hideDone, setHideDone] = useState(false);

  /* =========================
     LOAD PETS
  ========================= */
  useEffect(() => {
    const load = async () => {
      try {
        const [petsData, zdravilaData] = await Promise.all([
          getPets(token),
          getZdravila(token),
        ]);
        setPets(petsData);
        setZdravila(zdravilaData);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [token]);

  /* =========================
     LOAD ALL ITEMS BY PET
  ========================= */
  useEffect(() => {
    if (!selectedPet) {
      setItems([]);
      return;
    }
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const loadAll = async () => {
      try {
        const [opomniki, zdravljenja, obroki, aktivnosti] = await Promise.all([
          getOpomnikiByPet(selectedPet, token),
          getPetZdravilaByPet(selectedPet, token),
          getObrokiByPet(selectedPet, token),
          getAktivnostiByPet(selectedPet, token),
        ]);

        const mergedRaw = [
          ...opomniki
            .filter(o => o.tip === "splošni")
            .map(o => ({
              id: o._id,
              opomnikId: o._id,
              sourceId: o._id,
              naziv: o.naziv,
              tip: o.tip,
              datum: o.datum,
              ura: o.ura,
              status: o.status,
              rawDate: toDate(o.datum, o.ura),
            })),

          ...zdravljenja.flatMap(z => {
            const result = [];

            if (!z.datum_zacetka || !z.datum_konca) return result;

            const current = new Date(z.datum_zacetka);
            const end = new Date(z.datum_konca);

            current.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            while (current <= end) {
              const day = new Date(current);

              const rawDate = toDate(
                day.toISOString().split("T")[0],
                z.ura
              );

              if (rawDate && rawDate >= startOfToday) {
                result.push({
                  id: `${z._id}-${day.toISOString().split("T")[0]}`,
                  opomnikId: z.opomnik?._id || null,
                  sourceId: z._id,
                  naziv: z.zdravilo?.ime || "Zdravljenje",
                  tip: "zdravilo",
                  datum: day.toISOString().split("T")[0],
                  ura: z.ura,
                  odmerek: z.odmerek,
                  pogostost: z.pogostost,
                  datum_konca: z.datum_konca,
                  status: z.opomnik?.status || "pending",
                  rawDate,
                });
              }

              current.setDate(current.getDate() + 1);
            }

            return result;
          }),

          ...obroki
            .map(o => ({
              id: o._id,
              opomnikId: o.opomnik?._id || null,
              sourceId: o._id,
              naziv: o.ime,
              tip: "obrok",
              datum: o.datum,
              ura: o.ura,
              status: o.opomnik?.status || "pending",
              rawDate: toDate(o.datum, o.ura),
            }))
            .filter(i => i.rawDate && i.rawDate >= startOfToday),

          ...aktivnosti
            .map(a => ({
              id: a._id,
              opomnikId: a.opomnik?._id || null,
              sourceId: a._id,
              naziv: a.naziv,
              tip: "aktivnost",
              datum: a.datum,
              ura: a.ura,
              trajanje: a.trajanje,
              status: a.opomnik?.status || "pending",
              rawDate: toDate(a.datum, a.ura),
            }))
            .filter(i => i.rawDate && i.rawDate >= startOfToday),
        ].filter(i => i.rawDate);

        const doneMap = getDoneMap();

        mergedRaw.forEach(i => {
          if (!i.opomnikId) {
            const key = `${i.tip}-${i.sourceId}`;
            if (doneMap[key]) {
              i.status = doneMap[key];
            }
          }
        });

        const uniqueMap = new Map();

        mergedRaw.forEach(item => {
          const key = `${item.tip}-${item.sourceId}-${item.datum}-${item.ura}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        });

        const merged = Array.from(uniqueMap.values());
        const hidden = getHiddenReminders();
        const filtered = merged.filter(
          i => !hidden.includes(`${i.tip}-${i.sourceId}`)
        );

        setItems(filtered.sort((a, b) => a.rawDate - b.rawDate));
      } catch (err) {
        console.error("Napaka pri nalaganju opomnikov", err);
      }
    };

    loadAll();
  }, [selectedPet, token]);

  /* =========================
     ADD REMINDER
  ========================= */
  const submitReminder = async (e) => {
    e.preventDefault();
    if (formData.tip === "zdravilo") {
      if (!formData.datum || !formData.datum_konca) {
        alert("Za zdravljenje moraš vnesti datum začetka in datum konca.");
        return;
      }
      if (new Date(formData.datum_konca) < new Date(formData.datum)) {
        alert("Datum konca ne sme biti pred datumom začetka.");
        return;
      }
    }

    if (!formData.ura) {
      alert("Ura je obvezna.");
      return;
    }

    if (isPastDate(formData.datum)) {
      alert("Datum ne sme biti v preteklosti.");
      return;
    }

    try {
      // 🔹 SPLOŠNI OPOMNIK
      if (formData.tip === "splošni") {
        await createOpomnik(
          {
            naziv: formData.naziv,
            datum: formData.datum,
            ura: formData.ura,
            tip: "splošni",
            pet: selectedPet,
          },
          token
        );
      }

      // 🔹 OBROK
      if (formData.tip === "obrok") {
        await createObrok(
          {
            ime: formData.naziv,
            datum: formData.datum,
            ura: formData.ura,
            pet: selectedPet,
          },
          token
        );
      }

      // 🔹 AKTIVNOST
      if (formData.tip === "aktivnost") {
        await createAktivnost(
          {
            naziv: formData.naziv,
            datum: formData.datum,
            ura: formData.ura,
            trajanje: Number(formData.trajanje),
            pet: selectedPet,
          },
          token
        );
      }

      // 🔹 ZDRAVLJENJE (privzeto brez odmerka/pogostosti – to je hitri opomnik)
      if (formData.tip === "zdravilo") {
        await createPetZdravilo(
          {
            pet: selectedPet,
            zdravilo: formData.zdraviloId,
            odmerek: formData.odmerek,
            pogostost: formData.pogostost,
            datum_zacetka: formData.datum,
            datum_konca: formData.datum_konca,
            ura: formData.ura,
          },
          token
        );
      }

      // reset + reload
      setShowForm(false);
      setFormData({
        naziv: "",
        tip: "splošni",
        datum: "",
        datum_konca: "",
        ura: "",
        trajanje: "",
        zdraviloId: "",
        odmerek: "",
        pogostost: "",
      });
      setSelectedPet(selectedPet);
    } catch (err) {
      console.error("Napaka pri dodajanju opomnika", err);
    }
  };

  /* =========================
     DELETE
  ========================= */
  const removeReminder = async (item) => {
    // 🔹 ročni opomnik → briši iz backenda
    if (item.opomnikId) {
      try {
        await deleteOpomnik(item.opomnikId, token);
        setItems(prev =>
          prev.filter(i => i.opomnikId !== item.opomnikId)
        );
      } catch (err) {
        console.error("Napaka pri brisanju opomnika", err);
      }
      return;
    }

    // 🔹 avtomatski opomnik → samo skrij (persistirano)
    const hidden = getHiddenReminders();
    const key = `${item.tip}-${item.sourceId}`;

    if (!hidden.includes(key)) {
      saveHiddenReminders([...hidden, key]);
    }

    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  /* =========================
     TOGGLE STATUS
  ========================= */
  const toggleStatus = async (item) => {
    // 🔹 PRAVI opomnik → backend
    if (item.opomnikId) {
      try {
        const newStatus = item.status === "done" ? "pending" : "done";

        const res = await fetch(
          `http://localhost:5001/api/opomniki/${item.opomnikId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        if (!res.ok) throw new Error();

        setItems(prev =>
          prev.map(i =>
            i.opomnikId === item.opomnikId
              ? { ...i, status: newStatus }
              : i
          )
        );
      } catch (err) {
        console.error("Napaka pri posodobitvi statusa", err);
      }
      return;
    }

    // 🔹 AVTOMATSKI opomnik → localStorage
    const doneMap = getDoneMap();
    const key = `${item.tip}-${item.sourceId}`;

    const newStatus = item.status === "done" ? "pending" : "done";
    doneMap[key] = newStatus;

    saveDoneMap(doneMap);

    setItems(prev =>
      prev.map(i =>
        i.id === item.id ? { ...i, status: newStatus } : i
      )
    );
  };


  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const startOfDayAfterTomorrow = new Date(startOfTomorrow);
  startOfDayAfterTomorrow.setDate(startOfDayAfterTomorrow.getDate() + 1);

  const endOfYesterday = new Date(startOfToday);
  endOfYesterday.setMilliseconds(-1);

  const filteredByView = items.filter(i => {
    if (!i.rawDate) return false;

    // 🔹 najprej skrij opravljene
    if (hideDone && i.status === "done") return false;

    if (view === "vse") return true;

    if (view === "danes") {
      return i.rawDate >= startOfToday && i.rawDate < startOfTomorrow;
    }

    if (view === "jutri") {
      return i.rawDate >= startOfTomorrow && i.rawDate < startOfDayAfterTomorrow;
    }

    if (view === "prihodnje") {
      return i.rawDate >= startOfDayAfterTomorrow;
    }

    if (view === "pretekle") {
      return i.rawDate < startOfToday;
    }

    return true;
  });

  /* =========================
     GROUP BY DAY
  ========================= */
  const grouped = {};
  filteredByView.forEach(i => {
    if (!i.rawDate) return;

    const y = i.rawDate.getFullYear();
    const m = String(i.rawDate.getMonth() + 1).padStart(2, "0");
    const d = String(i.rawDate.getDate()).padStart(2, "0");

    const key = `${y}-${m}-${d}`;

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(i);
  });

  return (
    <div className="app-layout">
      <Sidebar active="reminders" />

      <div className="page-content reminders-page">
        <h1>Opomniki</h1>

        {/* 🔹 ISTA VRSTICA: izberi ljubljenčka + dodaj */}
        <div className="reminders-actions">
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
          >
            <option value="">Izberi ljubljenčka</option>
            {pets.map((p) => (
              <option key={p._id} value={p._id}>
                {p.ime}
              </option>
            ))}
          </select>

          {selectedPet && (
            <button className="add-btn" onClick={() => setShowForm(true)}>
              + Dodaj opomnik
            </button>
          )}
        </div>

        {/* TABS */}
        <div className="reminder-tabs">
          <button
            className={view === "vse" ? "active" : ""}
            onClick={() => setView("vse")}
          >
            Vse
          </button>
          <button
            className={view === "danes" ? "active" : ""}
            onClick={() => setView("danes")}
          >
            Danes
          </button>
          <button
            className={view === "jutri" ? "active" : ""}
            onClick={() => setView("jutri")}
          >
            Jutri
          </button>
          <button
            className={view === "prihodnje" ? "active" : ""}
            onClick={() => setView("prihodnje")}
          >
            Prihodnje
          </button>
          <button
            className={view === "pretekle" ? "active" : ""}
            onClick={() => setView("pretekle")}
          >
            Pretekle
          </button>
          <button
            className={hideDone ? "active" : ""}
            onClick={() => setHideDone(!hideDone)}
          >
            {hideDone ? "Prikaži opravljene" : "Skrij opravljene"}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="add-pet-form-overlay">
            <form className="add-pet-form" onSubmit={submitReminder}>
              <h3>Dodaj opomnik</h3>

              <input
                type="text"
                placeholder="Naziv"
                value={formData.naziv}
                onChange={(e) =>
                  setFormData({ ...formData, naziv: e.target.value })
                }
                required
              />

              <select
                value={formData.tip}
                onChange={(e) =>
                  setFormData({ ...formData, tip: e.target.value })
                }
              >
                <option value="splošni">Splošni</option>
                <option value="zdravilo">Zdravilo</option>
                <option value="aktivnost">Aktivnost</option>
                <option value="obrok">Obrok</option>
              </select>

              <input
                type="date"
                value={formData.datum}
                onChange={(e) =>
                  setFormData({ ...formData, datum: e.target.value })
                }
                required
              />

              <input
                type="time"
                value={formData.ura}
                onChange={(e) =>
                  setFormData({ ...formData, ura: e.target.value })
                }
                required
              />

              {formData.tip === "aktivnost" && (
                <input
                  type="number"
                  placeholder="Trajanje (v minutah)"
                  value={formData.trajanje}
                  onChange={(e) =>
                    setFormData({ ...formData, trajanje: e.target.value })
                  }
                  required
                />
              )}

              {formData.tip === "zdravilo" && (
                <>
                  <input
                    type="date"
                    value={formData.datum_konca}
                    onChange={(e) =>
                      setFormData({ ...formData, datum_konca: e.target.value })
                    }
                    required
                  />

                  <select
                    value={formData.zdraviloId}
                    onChange={(e) =>
                      setFormData({ ...formData, zdraviloId: e.target.value })
                    }
                    required
                  >
                    <option value="">Izberi zdravilo</option>
                    {zdravila.map((z) => (
                      <option key={z._id} value={z._id}>
                        {z.ime} ({z.vrsta_odmerka})
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Odmerek"
                    value={formData.odmerek}
                    onChange={(e) =>
                      setFormData({ ...formData, odmerek: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Pogostost"
                    value={formData.pogostost}
                    onChange={(e) =>
                      setFormData({ ...formData, pogostost: e.target.value })
                    }
                    required
                  />
                </>
              )}

              <div className="form-buttons">
                <button type="submit">Shrani</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Prekliči
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LISTA */}
        {Object.entries(grouped).map(([day, list]) => (
          <div key={day}>
            <h2>{formatDateLabel(day)}</h2>

            {list.map((i) => (
              <div
                key={i.id}
                className={`card reminder-${i.tip} ${i.status === "done" ? "done" : ""
                  }`}
              >
                {/* LEVI DEL – VSEBINA */}
                <div className="reminder-main">
                  <div className="reminder-header">
                    <h3>
                      {i.naziv}
                      <span className={`reminder-type tag-${i.tip}`}>
                        {i.tip === "splošni" && "Splošni"}
                        {i.tip === "zdravilo" && "Zdravilo"}
                        {i.tip === "aktivnost" && "Aktivnost"}
                        {i.tip === "obrok" && "Obrok"}
                      </span>
                    </h3>
                  </div>

                  <div className="reminder-details">
                    {/* DATUM + URA */}
                    <div>
                      Datum:{" "}
                      {new Date(i.datum).toLocaleDateString("sl-SI")}
                      {i.ura && ` ob ${formatTime(i.ura)}`}
                    </div>

                    {/* ZDRAVLJENJE */}
                    {i.tip === "zdravilo" && (
                      <>
                        {i.odmerek && <div>Odmerek: {i.odmerek}</div>}
                        {i.pogostost && <div>Pogostost: {i.pogostost}</div>}
                      </>
                    )}

                    {/* AKTIVNOST */}
                    {i.tip === "aktivnost" && i.trajanje && (
                      <div>Trajanje: {i.trajanje} min</div>
                    )}
                  </div>

                  {i.rawDate >= startOfToday && (
                    <div className="reminder-actions">
                      <label className="reminder-checkbox">
                        <input
                          type="checkbox"
                          checked={i.status === "done"}
                          onChange={() => toggleStatus(i)}
                        />
                        <span>Opravljeno</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* DESNI DEL – DELETE (ZDAJ BO NA SREDINI) */}
                <button
                  className="reminder-delete"
                  onClick={() => removeReminder(i)}
                  title="Izbriši opomnik"
                >
                  🗑️
                </button>
              </div>


            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminders;