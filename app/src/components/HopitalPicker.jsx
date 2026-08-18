import { useState } from "react";
import { X } from "lucide-react";
import { findHopitauxProches } from "../lib/hopitaux";
import { colors } from "../lib/colors";

export default function HopitalPicker({ dossier, setDossier, hopitaux, t }) {
  const { codePostalChantier, hopitalPlusProcheIds } = dossier.reglesSpecifiques;
  const [manualId, setManualId] = useState("");

  const selected = hopitalPlusProcheIds
    .map((id) => hopitaux.find((h) => h.id === id))
    .filter(Boolean);

  function update(patch) {
    setDossier((prev) => ({ ...prev, reglesSpecifiques: { ...prev.reglesSpecifiques, ...patch } }));
  }

  function onCodePostalChange(cp) {
    const matches = findHopitauxProches(hopitaux, cp);
    update({ codePostalChantier: cp, hopitalPlusProcheIds: matches.map((h) => h.id) });
  }

  function removeHopital(id) {
    update({ hopitalPlusProcheIds: hopitalPlusProcheIds.filter((x) => x !== id) });
  }

  function addManual() {
    if (!manualId || hopitalPlusProcheIds.includes(manualId)) return;
    update({ hopitalPlusProcheIds: [...hopitalPlusProcheIds, manualId] });
    setManualId("");
  }

  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{t("hopital_plus_proche")}</label>
      <input
        type="text"
        placeholder={t("hopital_code_postal_placeholder")}
        className="w-full border rounded px-3 py-2 text-sm mb-2"
        style={{ borderColor: colors.neutralBorderStrong }}
        value={codePostalChantier}
        onChange={(e) => onCodePostalChange(e.target.value)}
      />
      <div className="flex flex-col gap-1.5 mb-2">
        {selected.map((h) => (
          <div key={h.id} className="flex items-center justify-between text-xs border rounded px-2.5 py-1.5" style={{ borderColor: colors.neutralBorder }}>
            <span>
              {h.nom_hopital}
              {h.nom_site ? ` (${h.nom_site})` : ""}, {h.adresse}, {h.code_postal} {h.commune}
            </span>
            <button onClick={() => removeHopital(h.id)} style={{ color: colors.neutralText }}>
              <X size={14} />
            </button>
          </div>
        ))}
        {selected.length === 0 && (
          <p className="text-xs" style={{ color: colors.neutralText }}>
            {t("hopital_saisis_code_postal")}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <select
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          className="flex-1 border rounded px-2 py-1.5 text-xs"
          style={{ borderColor: colors.neutralBorderStrong }}
        >
          <option value="">{t("hopital_ajouter_manuellement")}</option>
          {hopitaux.map((h) => (
            <option key={h.id} value={h.id}>
              {h.nom_hopital} {h.nom_site ? `(${h.nom_site})` : ""}, {h.code_postal} {h.commune}
            </option>
          ))}
        </select>
        <button onClick={addManual} className="text-xs px-3 py-1.5 rounded border" style={{ borderColor: colors.neutralBorderStrong }}>
          {t("bouton_ajouter")}
        </button>
      </div>
    </div>
  );
}
