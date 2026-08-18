import { colors } from "../lib/colors";

const AIDE_CRITERES = [
  { key: "heuresInf1000", labelKey: "caracterisation_critere_heures" },
  { key: "hauteur5mPlus", labelKey: "caracterisation_critere_hauteur" },
  { key: "hauteTension", labelKey: "caracterisation_critere_ht" },
  { key: "espaceConfine", labelKey: "caracterisation_critere_confine" },
];

export default function Caracterisation({ dossier, setDossier, corpsMetierOptions, onBack, onNext, t }) {
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
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.navy }}>
        {t("caracterisation_titre")}
      </h3>

      <p className="text-sm font-medium mb-2">{t("caracterisation_question")}</p>
      <div className="flex gap-5 mb-3">
        <label className="flex items-center gap-1.5 text-sm" style={aideActive ? { color: colors.neutralText } : undefined}>
          <input type="radio" checked={modeChoisi === "abrege"} disabled={aideActive} onChange={() => setMode("abrege")} />
          {t("caracterisation_abrege")}
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="radio" checked={modeChoisi === "complet"} onChange={() => setMode("complet")} />
          {t("caracterisation_complet")}
        </label>
      </div>
      {aideActive && (
        <p className="text-xs mb-3" style={{ color: colors.warningText }}>
          {t("caracterisation_abrege_indispo")}
        </p>
      )}

      <div className="rounded p-3 mb-5" style={{ background: colors.neutralBgSubtle }}>
        <p className="text-xs mb-1.5" style={{ color: colors.neutralText }}>
          {t("caracterisation_aide_intro")}
        </p>
        {AIDE_CRITERES.map((o) => (
          <label key={o.key} className="flex items-center gap-2 text-sm py-0.5">
            <input type="checkbox" checked={aideAuChoix[o.key]} onChange={() => toggleAide(o.key)} />
            {t(o.labelKey)}
          </label>
        ))}
      </div>

      <p className="text-sm font-medium mb-2">{t("caracterisation_corps_metier")}</p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {corpsMetierOptions.map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={corpsMetier.includes(o.id)} onChange={() => toggleCorpsMetier(o.id)} />
            {o.label}
          </label>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-5 py-2 rounded text-sm border" style={{ borderColor: colors.neutralBorderStrong }}>
          {t("bouton_retour")}
        </button>
        <button onClick={onNext} className="px-5 py-2 rounded text-sm font-medium" style={{ background: colors.navy, color: "white" }}>
          {t("bouton_continuer")}
        </button>
      </div>
    </div>
  );
}
