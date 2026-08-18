const AIDE_CRITERES = [
  { key: "heuresInf1000", label: "Heures de chantier < 1000" },
  { key: "hauteur5mPlus", label: "Travail en hauteur ≥ 5 m" },
  { key: "hauteTension", label: "Haute tension" },
  { key: "espaceConfine", label: "Espace confiné" },
];

export default function Caracterisation({ dossier, setDossier, corpsMetierOptions, onBack, onNext }) {
  const { modeChoisi, aideAuChoix } = dossier.triage;
  const { corpsMetier } = dossier.caracterisation;
  const aideActive = Object.values(aideAuChoix).some(Boolean);

  function updateTriage(patch) {
    setDossier((prev) => ({ ...prev, triage: { ...prev.triage, ...patch } }));
  }
  function setMode(next) {
    updateTriage({ modeChoisi: next });
  }
  function toggleCorpsMetier(id) {
    const next = corpsMetier.includes(id) ? corpsMetier.filter((x) => x !== id) : [...corpsMetier, id];
    setDossier((prev) => ({ ...prev, caracterisation: { ...prev.caracterisation, corpsMetier: next } }));
  }
  function toggleAide(key) {
    const next = { ...aideAuChoix, [key]: !aideAuChoix[key] };
    updateTriage({ aideAuChoix: next, ...(Object.values(next).some(Boolean) ? { modeChoisi: "complet" } : {}) });
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#0B3040" }}>
        Caractérisation du chantier
      </h3>

      <p className="text-sm font-medium mb-2">RePSS abrégé ou complet ?</p>
      <div className="flex gap-5 mb-3">
        <label className="flex items-center gap-1.5 text-sm" style={aideActive ? { color: "#5A646C" } : undefined}>
          <input type="radio" checked={modeChoisi === "abrege"} disabled={aideActive} onChange={() => setMode("abrege")} />
          Abrégé
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="radio" checked={modeChoisi === "complet"} onChange={() => setMode("complet")} />
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
            <input type="checkbox" checked={aideAuChoix[o.key]} onChange={() => toggleAide(o.key)} />
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
