import React, { useMemo, useState } from "react";
import "./Burger.css";

/** Layers order — bun always present */
const LAYERS = [
  { id: "bun-bottom", label: "לחמנייה תחתונה", price: 0, img: "/burger/bun-bottom.png" },
  { id: "patty",      label: "קציצה",            price: 12, img: "/burger/patty.png" }, // price per extra patty
  { id: "cheese",     label: "גבינה",            price: 7,  img: "/burger/cheese.png" },
  { id: "lettuce",    label: "חסה",              price: 0,  img: "/burger/lettuce.png" }, // free
  { id: "tomato",     label: "עגבנייה",          price: 0,  img: "/burger/tomato.png" },  // free
  { id: "onion",      label: "בצל",              price: 0,  img: "/burger/onion.png" },   // free
  { id: "bun-top",    label: "לחמנייה עליונה",   price: 0,  img: "/burger/bun-top.png" },
];

export default function BurgerBuilder({ onClose, onAdd }) {

  // Always show bun-bottom and one patty
  const initial = LAYERS.reduce((acc, l) => {
    if (l.id === "bun-bottom" || l.id === "patty") return { ...acc, [l.id]: true };
    return { ...acc, [l.id]: false };
  }, {});
  const [selected, setSelected] = useState(initial);

  // Track number of patties (>=1)
  const [pattyCount, setPattyCount] = useState(1);

  // Calculate total price:
  // base (65) includes first patty; each extra patty +12; cheese +7; others free
  const price = useMemo(() => {
    const base = 65;
    const extraPatty = Math.max(0, pattyCount - 1) * 12;
    const cheese = selected.cheese ? 7 : 0;
    return base + extraPatty + cheese;
  }, [selected, pattyCount]);

  // Title for order summary
  const title = useMemo(() => {
    const picks = [];
    picks.push(`${pattyCount}× קציצה`);
    if (selected.cheese) picks.push("גבינה");
    if (selected.lettuce) picks.push("חסה");
    if (selected.tomato) picks.push("עגבנייה");
    if (selected.onion) picks.push("בצל");
    if (selected["bun-top"]) picks.push("לחמנייה עליונה");
    return `בורגר (${picks.join(", ")})`;
  }, [selected, pattyCount]);

  return (
    <div className="builder-modal" dir="rtl">
      <div className="builder-card">
        <div className="builder-head">
          <h2>בנו את הבורגר 🍔</h2>
          <button className="btn small" onClick={onClose}>סגור</button>
        </div>

        <div className="builder-body">
          {/* Burger preview */}
          <div className="burger-preview" aria-label="תצוגת בורגר">
            {/* Always show bottom bun */}
            <img
              key="bun-bottom"
              src="/burger/bun-bottom.png"
              alt="לחמנייה תחתונה"
              className="burger-layer bun-bottom"
            />

            {/* Patties (stack by count) */}
            {Array.from({ length: pattyCount }).map((_, i) => (
              <img
                key={`patty-${i}`}
                src="/burger/patty.png"
                alt="קציצה"
                className="burger-layer patty"
                style={{ bottom: 26 + i * 18 }}
              />
            ))}

            {/* Toppings shift up with patty count */}
            {(() => {
              const offset = (pattyCount - 1) * 18;
              return (
                <>
                  {selected.cheese && (
                    <img
                      src="/burger/cheese.png"
                      alt="גבינה"
                      className="burger-layer cheese"
                      style={{ bottom: 60 + offset }}
                    />
                  )}
                  {selected.lettuce && (
                    <img
                      src="/burger/lettuce.png"
                      alt="חסה"
                      className="burger-layer lettuce"
                      style={{ bottom: 66 + offset }}
                    />
                  )}
                  {selected.tomato && (
                    <img
                      src="/burger/tomato.png"
                      alt="עגבנייה"
                      className="burger-layer tomato"
                      style={{ bottom: 96 + offset }}
                    />
                  )}
                  {selected.onion && (
                    <img
                      src="/burger/onion.png"
                      alt="בצל"
                      className="burger-layer onion"
                      style={{ bottom: 98 + offset }}
                    />
                  )}
                  {selected["bun-top"] && (
                    <img
                      src="/burger/bun-top.png"
                      alt="לחמנייה עליונה"
                      className="burger-layer bun-top"
                      style={{ bottom: 65 + offset }}
                    />
                  )}
                </>
              );
            })()}
          </div>

          {/* Controls */}
          <div className="builder-controls">
            {/* Patty counter — shows cost of extra patties only */}
            <div className="check" style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <span>קציצה (120 גרם × {pattyCount})</span>
              <button className="btn small" onClick={() => setPattyCount(c => Math.max(1, c - 1))}>-</button>
              <button className="btn small" onClick={() => setPattyCount(c => c + 1)}>+</button>
              <em>תוספת ₪{Math.max(0, pattyCount - 1) * 12}</em>
            </div>

            {/* Optional toppings (free except cheese) */}
            {LAYERS.filter(l => !["bun-bottom", "patty"].includes(l.id)).map(l => (
              <label key={l.id} className="check">
                <input
                  type="checkbox"
                  checked={!!selected[l.id]}
                  onChange={e => setSelected(s => ({ ...s, [l.id]: e.target.checked }))}
                />
                <span>
                  {l.label}
                  {l.id === "cheese" && <em> +₪7</em>}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="builder-footer">
          <div className="total">סה״כ: <b>₪{price.toFixed(2)}</b></div>
          <button
            className="btn btn-primary"
            onClick={() => onAdd({ item: title, price })}
          >
            הוסף להזמנה
          </button>
        </div>
      </div>
    </div>
  );
}



