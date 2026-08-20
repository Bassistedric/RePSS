import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { findHopitauxProches } from "../lib/hopitaux";
import { colors } from "../lib/colors";

export default function HopitalPicker({ dossier, setDossier, hopitaux, t }) {
  const { codePostalChantier, hopitalPlusProcheIds } = dossier.reglesSpecifiques;
  const codePostalAdresse = dossier.renseignementsGeneraux.codePostal;
  const [manualId, setManualId] = useState("");

  // Aide à l'encodage (§10) : dès que le code postal du chantier (Renseignements
  // généraux) est connu et qu'aucune recherche n'a encore été lancée ici, on
  // pré-remplit et on lance la recherche automatiquement.
  useEffect(() => {
    if (codePostalAdresse && !codePostalChantier) {
      onCodePostalChange(codePostalAdresse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codePostalAdresse]);

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

  const peutResynchroniser = codePostalAdresse && codePostalAdresse !== codePostalChantier;

  return (
    <div>
      <label className="text-sm font-medium block mb-2">{t("hopital_plus_proche")}</label>
      <div className="flex gap-2.5 mb-1.5">
        <input
          type="text"
          placeholder={t("hopital_code_postal_placeholder")}
          className="flex-1 border rounded px-3.5 py-2.5 text-sm"
          style={{ borderColor: colors.neutralBorderStrong, background: "white" }}
          value={codePostalChantier}
          onChange={(e) => onCodePostalChange(e.target.value)}
        />
        {peutResynchroniser && (
          <button
            type="button"
            onClick={() => onCodePostalChange(codePostalAdresse)}
            className="text-sm px-3.5 py-2 rounded border whitespace-nowrap"
            style={{ borderColor: colors.blue, color: colors.blue, background: "white" }}
          >
            {t("hopital_reutiliser_code_postal").replace("{cp}", codePostalAdresse)}
          </button>
        )}
      </div>
      <p className="text-sm mb-2.5" style={{ color: colors.neutralText }}>
        {codePostalChantier
          ? t("hopital_code_postal_utilise").replace("{cp}", codePostalChantier)
          : t("hopital_code_postal_manquant")}
      </p>
      <div className="flex flex-col gap-2 mb-2.5">
        {selected.map((h) => (
          <div
            key={h.id}
            className="flex items-center justify-between text-sm border rounded px-3 py-2"
            style={{ borderColor: colors.neutralBorder, background: "white" }}
          >
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
          <p className="text-sm" style={{ color: colors.neutralText }}>
            {t("hopital_saisis_code_postal")}
          </p>
        )}
      </div>
      <div className="flex gap-2.5">
        <select
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          className="flex-1 border rounded px-2.5 py-2 text-sm"
          style={{ borderColor: colors.neutralBorderStrong, background: "white" }}
        >
          <option value="">{t("hopital_ajouter_manuellement")}</option>
          {hopitaux.map((h) => (
            <option key={h.id} value={h.id}>
              {h.nom_hopital} {h.nom_site ? `(${h.nom_site})` : ""}, {h.code_postal} {h.commune}
            </option>
          ))}
        </select>
        <button
          onClick={addManual}
          className="text-sm px-3.5 py-2 rounded border"
          style={{ borderColor: colors.neutralBorderStrong, background: "white" }}
        >
          {t("bouton_ajouter")}
        </button>
      </div>
    </div>
  );
}
