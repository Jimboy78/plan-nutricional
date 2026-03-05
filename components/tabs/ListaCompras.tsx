import React from "react";
import { SHOPPING } from "../data/plan";

interface Props {
  checkedItems: string[];
  toggleItem: (name: string) => void;
  resetAll: () => void;
}

export function ListaCompras({ checkedItems, toggleItem, resetAll }: Props) {
  const totalItems = SHOPPING.reduce((acc, g) => acc + g.items.length, 0);
  const checkedCount = checkedItems.length;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ background: "var(--warn-bg)", border: "1px solid var(--warn-border)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--warn-text)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span>Lista base para una semana completa (6 dias entreno + 1 descanso). <strong>{checkedCount}/{totalItems}</strong> comprados.</span>
        {checkedCount > 0 && (
          <button onClick={resetAll} style={{ background: "none", border: "1px solid var(--warn-text)", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "var(--warn-text)", cursor: "pointer", fontWeight: 600 }}>
            Resetear
          </button>
        )}
      </div>
      {SHOPPING.map(g => (
        <div key={g.cat} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderLeft: `4px solid ${g.color}` }}>
          <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14, marginBottom: 10 }}>{g.cat}</div>
          <div style={{ display: "grid", gap: 0 }}>
            {g.items.map(([nom, cant]) => {
              const checked = checkedItems.includes(nom);
              return (
                <div
                  key={nom}
                  onClick={() => toggleItem(nom)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: "0 10px",
                    padding: "6px 0",
                    borderBottom: "1px solid var(--border-light)",
                    cursor: "pointer",
                    alignItems: "center",
                    opacity: checked ? 0.5 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: checked ? "2px solid #22c55e" : "2px solid var(--border)",
                    background: checked ? "#22c55e" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {checked && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: checked ? "line-through" : "none" }}>{nom}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "right", whiteSpace: "nowrap" }}>{cant}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
