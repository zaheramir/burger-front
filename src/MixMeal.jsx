import React from "react";
import "./Burger.css"; // reuse same modal style

export default function MixMeal({ onClose, onAdd }) {
  const meal = {
    name: "מיקס צ׳יפס וטבעות בצל",
    price: 28,
    img: "/burger/mix-meal.jpg",
    desc: "מנת צד מושלמת למבורגר — שילוב פריך של צ׳יפס זהב וטבעות בצל חמות עם רוטב לבחירה.",
  };

  return (
    <div className="builder-modal" dir="rtl">
      <div className="builder-card">
        <div className="builder-head">
          <h2>{meal.name}</h2>
          <button className="btn small" onClick={onClose}>סגור</button>
        </div>

        <div className="builder-body" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src={meal.img}
            alt={meal.name}
            style={{ width: "260px", borderRadius: "14px", marginBottom: "1rem" }}
          />
          <p style={{ maxWidth: "90%", textAlign: "center", lineHeight: 1.6 }}>
            {meal.desc}
          </p>
          <p style={{ fontSize: "1.2rem", marginTop: ".8rem" }}>
            <b>₪{meal.price}</b>
          </p>
        </div>

        <div className="builder-footer" style={{ justifyContent: "center" }}>
          <button
            className="btn btn-primary"
            onClick={() => onAdd({ item: meal.name, price: meal.price })}
          >
            הוסף להזמנה
          </button>
        </div>
      </div>
    </div>
  );
}
