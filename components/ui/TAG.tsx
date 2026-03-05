import React from "react";

export function TAG({ c, children }: { c?: string; children: React.ReactNode }) {
  return (
    <span style={{ background: c || "var(--border)", color: "var(--tag-text)", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
      {children}
    </span>
  );
}
