import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { colors } from "../lib/colors";
import { optionsProbabilite, optionsExposition, optionsGravite, niveauDepuisScore, couleurNiveau, formatNombre } from "../lib/kinney";

const INPUT_CLASS = "w-full border rounded px-3.5 py-2.5 text-sm";
const INPUT_STYLE = { borderColor: colors.neutralBorderStrong, background: "white" };

const NIVEAUX_LEGENDE = [
  { code: "acceptable", labelKey: "niveau_acceptable" },
  { code: "attention", labelKey: "niveau_attention" },
  { code: "correction", labelKey: "niveau_correction" },
  { code: "immediate", labelKey: "niveau_immediate" },
  { code: "arret", labelKey: "niveau_arret" },
];

function emptyKinney() {
  return { probabilite: "", exposition: "", gravite: "" };
}
function emptyDraft() {
  return { tache: "", danger: "", situationDangereuse: "", mesuresExistantes: "", initial: emptyKinney(), residuel: emptyKinney() };
}

function scoreEtNiveau(k) {
  if (!k.probabilite || !k.exposition || !k.gravite) return null;
  const score = parseFloat(k.probabilite) * parseFloat(k.exposition) * parseFloat(k.gravite);
  return { score, niveauCode: niveauDepuisScore(score) };
}

function KinneySelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm block mb-1.5" style={{ color: colors.neutralText }}>
        {label}
      </span>
      <select className={INPUT_CLASS} style={INPUT_STYLE} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" />
        {options.map((o) => (
          <option key={o.valeur} value={o.valeur}>
            {o.label} ({formatNombre(o.valeur)})
          </option>
        ))}
      </select>
    </label>
  );
}

function RisqueBlock({ titre, tint, kinney, onChange, t }) {
  const probas = optionsProbabilite(t);
  const expos = optionsExposition(t);
  const gravites = optionsGravite(t);
  const resultat = scoreEtNiveau(kinney);
  const c = resultat ? couleurNiveau(resultat.niveauCode) : null;

  return (
    <div className="flex-1 rounded-lg border p-4" style={{ borderColor: colors.neutralBorder, background: tint }}>
      <p className="text-sm font-semibold mb-3" style={{ color: colors.neutralTextStrong }}>
        {titre}
      </p>
      <div className="flex flex-col gap-3 mb-3">
        <KinneySelect label={t("kinney_probabilite")} value={kinney.probabilite} onChange={(v) => onChange({ ...kinney, probabilite: v })} options={probas} />
        <KinneySelect label={t("kinney_exposition")} value={kinney.exposition} onChange={(v) => onChange({ ...kinney, exposition: v })} options={expos} />
        <KinneySelect label={t("kinney_gravite")} value={kinney.gravite} onChange={(v) => onChange({ ...kinney, gravite: v })} options={gravites} />
      </div>
      {resultat && (
        <div className="rounded px-3 py-2 text-center" style={{ background: c.bg }}>
          <span className="text-sm font-bold" style={{ color: c.texte }}>
            {t("moadr_score_label")} {formatNombre(resultat.score)} · {t(NIVEAUX_LEGENDE.find((n) => n.code === resultat.niveauCode).labelKey)}
          </span>
        </div>
      )}
    </div>
  );
}

function NiveauBadge({ kinney, t }) {
  const resultat = scoreEtNiveau(kinney);
  if (!resultat) return null;
  const c = couleurNiveau(resultat.niveauCode);
  const niveauLabel = t(NIVEAUX_LEGENDE.find((n) => n.code === resultat.niveauCode).labelKey);
  return (
    <span className="inline-block rounded px-2 py-1 text-xs font-bold whitespace-nowrap" style={{ background: c.bg, color: c.texte }}>
      {formatNombre(resultat.score)} · {niveauLabel}
    </span>
  );
}

export default function MoadrAnalyseRisques({ moadr, setMoadr, t }) {
  const [draft, setDraft] = useState(emptyDraft());
  const lignes = moadr.analyseRisques.lignes;

  function updateLignes(next) {
    setMoadr((prev) => ({ ...prev, analyseRisques: { lignes: next } }));
  }

  function ajouterLigne() {
    if (!draft.tache.trim() || !draft.danger.trim()) return;
    updateLignes([...lignes, { id: `moadr_risque_${Date.now()}`, ...draft }]);
    setDraft(emptyDraft());
  }

  function annulerDraft() {
    setDraft(emptyDraft());
  }

  function supprimerLigne(id) {
    updateLignes(lignes.filter((l) => l.id !== id));
  }

  function viderTableau() {
    if (lignes.length === 0) return;
    if (window.confirm(t("moadr_confirmer_vider_tableau"))) updateLignes([]);
  }

  return (
    <div>
      <div className="rounded-lg border p-4 mb-4" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
        <p className="text-sm mb-4" style={{ color: colors.neutralText }}>
          {t("moadr_s5_1_texte")}
        </p>
        <div className="flex flex-col gap-3">
          {[
            ["moadr_kinney_p_titre", "moadr_kinney_p_texte"],
            ["moadr_kinney_e_titre", "moadr_kinney_e_texte"],
            ["moadr_kinney_g_titre", "moadr_kinney_g_texte"],
          ].map(([titreKey, texteKey]) => (
            <div key={titreKey}>
              <p className="text-sm font-semibold mb-1" style={{ color: colors.blue }}>
                {t(titreKey)}
              </p>
              <p className="text-sm" style={{ color: colors.neutralText }}>
                {t(texteKey)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4 mb-5" style={{ borderColor: colors.neutralBorder }}>
        <p className="text-base font-semibold mb-3" style={{ color: colors.blue }}>
          {t("moadr_s5_2_titre")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">{t("moadr_ligne_tache")}</span>
            <input className={INPUT_CLASS} style={INPUT_STYLE} value={draft.tache} onChange={(e) => setDraft({ ...draft, tache: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">{t("moadr_ligne_danger")}</span>
            <input className={INPUT_CLASS} style={INPUT_STYLE} value={draft.danger} onChange={(e) => setDraft({ ...draft, danger: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">{t("moadr_ligne_situation")}</span>
            <input
              className={INPUT_CLASS}
              style={INPUT_STYLE}
              value={draft.situationDangereuse}
              onChange={(e) => setDraft({ ...draft, situationDangereuse: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">{t("moadr_ligne_mesures_existantes")}</span>
            <input
              className={INPUT_CLASS}
              style={INPUT_STYLE}
              value={draft.mesuresExistantes}
              onChange={(e) => setDraft({ ...draft, mesuresExistantes: e.target.value })}
            />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-3.5">
          <RisqueBlock
            titre={t("moadr_risque_initial")}
            tint={colors.errorBg}
            kinney={draft.initial}
            onChange={(k) => setDraft({ ...draft, initial: k })}
            t={t}
          />
          <RisqueBlock
            titre={t("moadr_risque_residuel")}
            tint={colors.successBg}
            kinney={draft.residuel}
            onChange={(k) => setDraft({ ...draft, residuel: k })}
            t={t}
          />
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={ajouterLigne}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded text-sm font-medium"
            style={{ background: colors.navy, color: "white" }}
          >
            <Plus size={15} /> {t("moadr_bouton_ajouter_ligne_risque")}
          </button>
          <button onClick={annulerDraft} className="px-5 py-2.5 rounded text-sm border" style={{ borderColor: colors.neutralBorderStrong }}>
            {t("bouton_annuler")}
          </button>
        </div>
      </div>

      {lignes.length === 0 ? (
        <p className="text-sm mb-3" style={{ color: colors.neutralText }}>
          {t("moadr_aucune_ligne")}
        </p>
      ) : (
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium pb-2 pr-3" style={{ color: colors.neutralText }}>
                  {t("moadr_ref_ligne")}
                </th>
                <th className="text-left text-sm font-medium pb-2 pr-3" style={{ color: colors.neutralText }}>
                  {t("moadr_ligne_tache")}
                </th>
                <th className="text-left text-sm font-medium pb-2 pr-3" style={{ color: colors.neutralText }}>
                  {t("moadr_ligne_danger")}
                </th>
                <th className="text-left text-sm font-medium pb-2 pr-3" style={{ color: colors.neutralText }}>
                  {t("moadr_risque_initial")}
                </th>
                <th className="text-left text-sm font-medium pb-2 pr-3" style={{ color: colors.neutralText }}>
                  {t("moadr_risque_residuel")}
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lignes.map((l, i) => (
                <tr key={l.id} style={{ borderTop: `0.5pt solid ${colors.neutralBorder}` }}>
                  <td className="py-2.5 pr-3" style={{ color: colors.neutralText }}>
                    {i + 1}
                  </td>
                  <td className="py-2.5 pr-3">{l.tache}</td>
                  <td className="py-2.5 pr-3">{l.danger}</td>
                  <td className="py-2.5 pr-3">
                    <NiveauBadge kinney={l.initial} t={t} />
                  </td>
                  <td className="py-2.5 pr-3">
                    <NiveauBadge kinney={l.residuel} t={t} />
                  </td>
                  <td className="py-2.5">
                    <button onClick={() => supprimerLigne(l.id)} style={{ color: colors.neutralText }}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          {NIVEAUX_LEGENDE.map((n) => {
            const c = couleurNiveau(n.code);
            return (
              <span key={n.code} className="flex items-center gap-1.5 text-xs" style={{ color: colors.neutralText }}>
                <span className="w-3 h-2.5 rounded-sm inline-block" style={{ background: c.bg }} />
                {t(n.labelKey)}
              </span>
            );
          })}
        </div>
        {lignes.length > 0 && (
          <button onClick={viderTableau} className="flex items-center gap-1.5 text-sm" style={{ color: colors.error }}>
            <Trash2 size={14} /> {t("moadr_bouton_vider_tableau")}
          </button>
        )}
      </div>
    </div>
  );
}
