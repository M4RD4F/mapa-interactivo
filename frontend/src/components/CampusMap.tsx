import React from "react";

// SVG temporal mientras cargamos el definitivo
const exampleSVG = `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="120" height="80" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
  <text x="110" y="95" text-anchor="middle" font-size="16" fill="#334155">Edificio A</text>

  <rect x="220" y="120" width="130" height="90" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
  <text x="285" y="170" text-anchor="middle" font-size="16" fill="#334155">Edificio B</text>
</svg>
`;

export default function CampusMap() {
  return (
    <div className="border rounded-lg shadow p-2 w-full overflow-auto max-w-3xl mx-auto">
      <div
        dangerouslySetInnerHTML={{ __html: exampleSVG }}
        className="w-full"
      />
</div>
  );
}
