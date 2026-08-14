const AIDE_CRITERES = [
  { key: "heures", label: "Heures de chantier < 1000" },
  { key: "hauteur", label: "Travail en hauteur ≥ 5 m" },
  { key: "ht", label: "Haute tension" },
  { key: "confine", label: "Espace confiné" },
];

export default function Caracterisation({ dossier, setDossier, corpsMetierOptions, onBack, onNext }) {
  const { mode, corpsMetier, aide } = dossier.caracterisation;
  const aideActive = Object.values(aide).some(Boolean);

  function update(patch) {
    setDossier((prev) => ({ ...prev, caracterisation: { ...prev.caracterisation, ...patch } }));
  }
  function setMode(next) {
    update({ mode: next });
  }
  function toggleCorpsMetier(id) {
    update({ corpsMetier: corpsMetier.includes(id) ? corpsMetier.filter((x) => x !== id) : [...corpsMetier, id] });
  }
  function toggleAide(key) {
    const next = { ...aide, [key]: !aide[key] };
    update({ aide: next, ...(Object.values(next).some(Boolean) ? { mode: "complet" } : {}) });
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#0B3040" }}>
        Caractérisation du chantier
      </h3>

      <p className="text-sm font-medium mb-2">RePSS abrégé ou complet ?</p>
      <div className="flex gap-5 mb-3">
        <label className="flex items-center gap-1.5 text-sm" style={aideActive ? { color: "#A7AFB6" } : undefined}>
          <input type="radio" checked={mode === "abrege"} disabled={aideActive} onChange={() => setMode("abrege")} />
          Abrégé
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="radio" checked={mode === "complet"} onChange={() => setMode("complet")} />
          Complet
        </label>
      </div>
      {aideActive && (
        <p className="text-xs mb-3" style={{ color: "#B3261E" }}>
          Abrégé non disponible : au moins un critère ci-dessous s'applique à ce chantier.
        </p>
      )}

      <div className="rounded p-3 mb-5" style={{ background: "#F7F8F9" }}>
        <p className="text-xs mb-1.5" style={{ color: "#5A646C" }}>
          Si l'un de ces points concerne le chantier, le complet est requis
        </p>
        {AIDE_CRITERES.map((o) => (
          <label key={o.key} className="flex items-center gap-2 text-sm py-0.5">
            <input type="checkbox" checked={aide[o.key]} onChange={() => toggleAide(o.key)} />
            {o.label}
          </label>
        ))}
      </div>

      <p className="text-sm font-medium mb-2">Corps de métier concernés</p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {corpsMetierOptions.map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={corpsMetier.includes(o.id)} onChange={() => toggleCorpsMetier(o.id)} />
            {o.label}
          </label>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-5 py-2 rounded text-sm border" style={{ borderColor: "#D6DADE" }}>
          Retour
        </button>
        <button onClick={onNext} className="px-5 py-2 rounded text-sm font-medium" style={{ background: "#0B3040", color: "white" }}>
          Continuer
        </button>
      </div>
    </div>
  );
}
