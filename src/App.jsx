import React, { useState } from "react";
import "./App.css";
import BurgerBuilder from "./BurgerBuilder";
import MixMeal from "./MixMeal";
import { useEffect } from "react";

const ING_IMAGES = [
  "/burger/bun-bottom.png",
  "/burger/patty.png",
  "/burger/cheese.png",
  "/burger/lettuce.png",
  "/burger/tomato.png",
  "/burger/onion.png",
  "/burger/bun-top.png",
];

function preloadImages(list) {
  for (const src of list) {
    const img = new Image();
    img.src = src;
    // Optional: ensure decode completes (supported on modern browsers)
    img.decode?.().catch(() => {});
  }
}


// Use Netlify build-time env in production, localhost in dev
const API_BASE = 'https://burger-back-production.up.railway.app';


const CATEGORIES = [
  {
    id: "meals",
    title: "ארוחות",
    cover: "/cat-meals.jpg",
    items: [
      { key: "m-burger", name: "בורגר בהתאמה אישית 🍔", price: 65, builder: "burger" },
      { key: "mix-meal", name: "מיקס צ׳יפס וטבעות בצל🍟", price: 28, builder: "mix" },
    ],
  },
  {
    id: "drinks",
    title: "שתייה",
    cover: "/cat-drinks.jpg",
    items: [
      { key: "d1", name: "מים מינרליים", price: 7 },
      { key: "d2", name: "קולה", price: 10 },
      { key: "d3", name: "מיץ תפוזים", price: 12 },
      { key: "d4", name: "קפה הפוך", price: 14 },
    ],
  },
];

export default function App() {
  useEffect(() => {
    // don’t block first paint; prefetch when the browser is idle
    const run = () => preloadImages(ING_IMAGES);
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 0);
    }
  }, []);
  const [mode, setMode] = useState("home"); // 'home' | 'menu' | 'track'
  const [selectedCategory, setSelectedCategory] = useState("meals");

  const [order, setOrder] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [table, setTable] = useState("");

  const [trackPhone, setTrackPhone] = useState("");
  const [trackStatus, setTrackStatus] = useState(null);
  const [err, setErr] = useState(null);

  const [showBurger, setShowBurger] = useState(false);
  const [showMix, setShowMix] = useState(false); // <-- moved INSIDE component

  const addItem = (item) =>
    setOrder((prev) => [...prev, { item: item.name, price: item.price }]);
  const removeItem = (idx) => setOrder(order.filter((_, i) => i !== idx));

  const total = order.reduce((s, i) => s + Number(i.price || 0), 0).toFixed(2);

  const handleSubmit = async () => {
    if (!name || !phone || !table || order.length === 0) {
      alert("נא למלא שם, טלפון, שולחן/כתובת ולהוסיף לפחות פריט אחד.");
      return;
    }
    const payload = { name, phone, table, items: order, total };
    try {
      const res = await fetch(`${API_BASE}/submit-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      setOrder([]); setName(""); setPhone(""); setTable("");
      setSelectedCategory("meals"); setTrackPhone(phone);
      setMode("track"); fetchStatus(phone);
    } catch (e) { console.error(e); alert("השליחה נכשלה. נסו שוב."); }
  };

  const fetchStatus = async (ph) => {
    if (!ph) { setErr("חסר טלפון"); return; }
    try {
      const r = await fetch(`${API_BASE}/order-status?phone=${encodeURIComponent(ph)}`);
      if (r.ok) { const d = await r.json(); setTrackStatus(d.found ? d.status : "not-found"); setErr(null); }
      else { setTrackStatus(null); setErr("שגיאת שרת"); }
    } catch { setErr("שגיאת שרת"); }
  };

  // ===== Dark Home =====
  if (mode === "home") {
    const s = {
      page: { minHeight: "100dvh", display: "grid", placeItems: "center", background: "linear-gradient(180deg, #0e0e10, #1a1a1d)", color: "#f5f5f5", padding: 24 },
      card: { width: "min(980px, 92vw)", background: "linear-gradient(180deg, #17171b, #121215)", border: "1px solid #2a2a2e", borderRadius: 24, boxShadow: "0 8px 40px rgba(0,0,0,.45)", padding: 28, position: "relative", overflow: "hidden", textAlign: "center" },
      h1: { fontSize: "clamp(36px, 7vw, 68px)", lineHeight: 1.1, margin: "6px 0 24px", fontWeight: 800, letterSpacing: "-0.5px" },
      actions: { display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 10 },
      btn: { border: "1px solid #2a2a2e", borderRadius: 14, padding: "12px 20px", cursor: "pointer", fontWeight: 700, fontSize: 18, transition: "all .15s ease" },
      primary: { background: "linear-gradient(135deg, #f2b705, #f7d85d)", color: "#111", boxShadow: "0 6px 26px rgba(242,183,5,.25)" },
      ghost: { background: "#111", color: "#f3f3f3" },
      chips: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 20 },
      chip: { border: "1px solid #2a2a2e", background: "#101013", color: "#d7d7dc", padding: "8px 12px", borderRadius: 999, fontSize: 14 },
    };

    return (
      <div style={s.page} dir="rtl" lang="he">
        <div style={s.card}>
          <h1 style={s.h1}>ברוכים הבאים<br />Burger House</h1>
          <div style={s.actions}>
            <button style={{ ...s.btn, ...s.primary }} onClick={() => setMode("menu")}>להזמנה 🍔</button>
            <button style={{ ...s.btn, ...s.ghost }} onClick={() => setMode("track")}>מעקב הזמנה</button>
          </div>
          <div style={s.chips}>
            <span style={s.chip}>ארוחות</span>
            <span style={s.chip}>שתייה</span>
            <span style={s.chip}>קינוחים</span>
          </div>
        </div>
      </div>
    );
  }

  // ===== Track page =====
  if (mode === "track") {
    return (
      <div className="container" dir="rtl" lang="he">
        <header className="app-header"><img src="/logo.png" alt="Piano Logo" className="logo" /></header>
        <h1>מעקב הזמנה</h1>
        <div className="row">
          <input placeholder="טלפון" value={trackPhone} onChange={(e) => setTrackPhone(e.target.value)} />
          <button className="btn btn-primary" onClick={() => fetchStatus(trackPhone)}>בדיקה</button>
        </div>
        {trackStatus && (<p className="status">מצב: <b>{trackStatus === "completed" ? "מוכן ✅" : trackStatus === "not-found" ? "לא נמצאה הזמנה" : "בהכנה 🍽️"}</b></p>)}
        {err && <p className="error">{err}</p>}
        <hr />
        <button className="btn" onClick={() => { setMode("home"); setTrackStatus(null); setErr(null); }}>חזרה לדף הבית</button>
      </div>
    );
  }

  // ===== Menu / Order page =====
  const active = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <div className="container" dir="rtl" lang="he">
      <header className="app-header"><img src="/logo.png" alt="Piano Logo" className="logo" /></header>
      <h1>{active.title}</h1>

      <div className="toolbar">
        <button className="btn" onClick={() => setMode("home")}>דף הבית</button>
        <select className="btn" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
        </select>
        <button className="btn" onClick={() => setMode("track")}>מעקב הזמנה קיימת</button>
      </div>

      <div className="card">
        <h2 className="card-title">{active.title}</h2>
        {active.items.map((it) => (
          <div key={it.key} className="item-row">
            <span className="item-text">{it.name}{it.price ? ` — ₪${it.price}` : ""}</span>
            <button
              className="btn btn-add"
              onClick={() => {
                if (it.builder === "burger") setShowBurger(true);
                else if (it.builder === "mix") setShowMix(true);
                else addItem(it);
              }}
            >
              הוסף +
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="card-title">הזמנה</h2>
        {order.length === 0 ? (
          <p>אין פריטים עדיין.</p>
        ) : (
          <ul className="order-list">
            {order.map((it, i) => (
              <li key={i}>
                {it.item} ₪{it.price}
                <button className="btn btn-danger small" onClick={() => removeItem(i)}>הסר</button>
              </li>
            ))}
          </ul>
        )}
        <p className="total"><b>סה״כ:</b> ₪{total}</p>
        <div className="row">
          <input placeholder="שם" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input placeholder="שולחן / כתובת" value={table} onChange={(e) => setTable(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>שליחת הזמנה</button>
      </div>

      {showBurger && (
        <BurgerBuilder
          onClose={() => setShowBurger(false)}
          onAdd={(built) => {
            setShowBurger(false);
            setOrder((prev) => [...prev, { item: built.item, price: built.price }]);
          }}
        />
      )}

      {showMix && (
        <MixMeal
          onClose={() => setShowMix(false)}
          onAdd={(meal) => {
            setShowMix(false);
            setOrder((prev) => [...prev, { item: meal.item, price: meal.price }]);
          }}
        />
      )}
    </div>
  );
}
