import { Fragment } from "react";
import { Plus, Trash2, HardHat, SportShoe, Glasses, Shirt } from "lucide-react";
import FormStep from "./FormStep";
import ScreenTitle from "./ScreenTitle";
import { infosChantierUsineClientSchema, infosChantierUsineSchema } from "../lib/schema";
import { setPath } from "../lib/paths";
import { colors } from "../lib/colors";

const INPUT_CLASS = "w-full border rounded px-3.5 py-2.5 text-sm";
const INPUT_STYLE = { borderColor: colors.neutralBorderStrong, background: "white" };

// Grille fixe (2 colonnes x 4 lignes, comme le document de référence), plus des
// lignes "Autre" libres et non limitées à une seule (contrairement au document).
const HABILITATIONS_COL1 = [
  { key: "chariotElevateur", labelKey: "icu_hab_chariot" },
  { key: "nacelle", labelKey: "icu_hab_nacelle" },
  { key: "pontier", labelKey: "icu_hab_pontier" },
  { key: "levageTelescopique", labelKey: "icu_hab_levage" },
];
const HABILITATIONS_COL2 = [
  { key: "ba4", labelKey: "icu_hab_ba4" },
  { key: "ba5", labelKey: "icu_hab_ba5" },
  { key: "soudeur", labelKey: "icu_hab_soudeur" },
  { key: "frigoriste", labelKey: "icu_hab_frigoriste" },
];

// Pictogrammes d'obligation bleus ronds (style ISO 7010), absents de la version web
// actuelle bien que présents dans le document de référence.
const EPI_PICTOS = [
  { key: "casque", labelKey: "icu_epi_casque", Icon: HardHat },
  { key: "chaussures", labelKey: "icu_epi_chaussures", Icon: SportShoe },
  { key: "lunettes", labelKey: "icu_epi_lunettes", Icon: Glasses },
  { key: "gantsCombinaison", labelKey: "icu_epi_gants_combinaison", Icon: Shirt },
];
const EPI_SANS_PICTO = [
  { key: "protectionAuditive", labelKey: "icu_epi_protection_auditive" },
  { key: "masqueAntiPoussiere", labelKey: "icu_epi_masque_anti_poussiere" },
  { key: "protectionFaciale", labelKey: "icu_epi_protection_faciale" },
  { key: "harnaisSecurite", labelKey: "icu_epi_harnais" },
];

const SECOURS_CHECKS = [
  { key: "infirmerie", labelKey: "icu_infirmerie" },
  { key: "serviceSecurite", labelKey: "icu_service_securite" },
  { key: "pompiers", labelKey: "icu_pompiers" },
  { key: "gardiennage", labelKey: "icu_gardiennage" },
];

function Card({ title, children }) {
  return (
    <div className="border rounded-lg p-5 mb-5" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
      {title && (
        <p className="text-base font-semibold mb-3.5" style={{ color: colors.blue }}>
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

function EpiPictogram({ Icon }) {
  return (
    <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: colors.blue }}>
      <Icon size={18} color="white" />
    </span>
  );
}

export default function InfosChantierUsine({ dossier, setDossier, t, onBack, onNext }) {
  const icu = dossier.infosChantierUsine;

  function onChange(path, value) {
    setDossier((prev) => setPath(prev, path, value));
  }

  // Comme les 4 critères de l'aide au choix en Caractérisation : cocher "Oui"
  // bascule immédiatement modeChoisi = "complet" et verrouille "Abrégé" (nouveau
  // critère bloquant, déclenché ici puisque cette question n'existe qu'à cette
  // étape, après que le PM ait déjà choisi "Abrégé").
  function toggleCoactivite() {
    const next = !icu.coactivite;
    setDossier((prev) => ({
      ...prev,
      infosChantierUsine: { ...prev.infosChantierUsine, coactivite: next },
      triage: next ? { ...prev.triage, modeChoisi: "complet" } : prev.triage,
    }));
  }

  function toggleHabilitation(key) {
    onChange(`infosChantierUsine.habilitations.${key}`, !icu.habilitations[key]);
  }
  function addHabilitationAutre() {
    onChange("infosChantierUsine.habilitations.autres", [...icu.habilitations.autres, ""]);
  }
  function updateHabilitationAutre(i, value) {
    onChange(
      "infosChantierUsine.habilitations.autres",
      icu.habilitations.autres.map((v, idx) => (idx === i ? value : v))
    );
  }
  function removeHabilitationAutre(i) {
    onChange(
      "infosChantierUsine.habilitations.autres",
      icu.habilitations.autres.filter((_, idx) => idx !== i)
    );
  }

  function toggleEpi(key) {
    onChange(`infosChantierUsine.epi.${key}`, !icu.epi[key]);
  }

  function updateSecoursCheck(key, patch) {
    onChange(`infosChantierUsine.organisationSecours.${key}`, { ...icu.organisationSecours[key], ...patch });
  }

  return (
    <div>
      <ScreenTitle title={t("titre_infos_chantier_usine")} />

      <div className="mb-5">
        <FormStep schema={infosChantierUsineClientSchema} dossier={dossier} setDossier={setDossier} t={t} />
      </div>

      <Card>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={icu.coactivite} onChange={toggleCoactivite} />
          {t("coactivite")}
        </label>
        {icu.coactivite && (
          <p className="text-sm mt-1.5" style={{ color: colors.warningText }}>
            {t("icu_coactivite_bloquant")}
          </p>
        )}
      </Card>

      <FormStep schema={infosChantierUsineSchema} dossier={dossier} setDossier={setDossier} t={t} />

      <div className="mt-5">
        <Card title={t("icu_regime_travail")}>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={icu.regimeTravail === "1_poste"}
                onChange={() => onChange("infosChantierUsine.regimeTravail", "1_poste")}
              />
              {t("icu_regime_1_poste")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={icu.regimeTravail === "2_postes"}
                onChange={() => onChange("infosChantierUsine.regimeTravail", "2_postes")}
              />
              {t("icu_regime_2_postes")}
            </label>
          </div>
        </Card>

        <Card title={t("icu_habilitations_titre")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-3.5">
            {HABILITATIONS_COL1.map((h, i) => (
              <Fragment key={h.key}>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={icu.habilitations[h.key]} onChange={() => toggleHabilitation(h.key)} />
                  {t(h.labelKey)}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={icu.habilitations[HABILITATIONS_COL2[i].key]}
                    onChange={() => toggleHabilitation(HABILITATIONS_COL2[i].key)}
                  />
                  {t(HABILITATIONS_COL2[i].labelKey)}
                </label>
              </Fragment>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {icu.habilitations.autres.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t("icu_hab_autre")}
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                  value={val}
                  onChange={(e) => updateHabilitationAutre(i, e.target.value)}
                />
                <button type="button" onClick={() => removeHabilitationAutre(i)} style={{ color: colors.neutralText }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addHabilitationAutre} className="flex items-center gap-1.5 text-sm mt-2.5" style={{ color: colors.blue }}>
            <Plus size={14} /> {t("icu_hab_autre_ajouter")}
          </button>
        </Card>

        <Card title={t("icu_epi_titre")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {EPI_PICTOS.map((e) => (
              <label key={e.key} className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={icu.epi[e.key]} onChange={() => toggleEpi(e.key)} />
                <EpiPictogram Icon={e.Icon} />
                {t(e.labelKey)}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
            {EPI_SANS_PICTO.map((e) => (
              <label key={e.key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={icu.epi[e.key]} onChange={() => toggleEpi(e.key)} />
                {t(e.labelKey)}
              </label>
            ))}
          </div>
          <label className="text-sm font-medium block mb-2">{t("icu_epi_autres")}</label>
          <input
            type="text"
            className={INPUT_CLASS}
            style={INPUT_STYLE}
            value={icu.epi.autres}
            onChange={(e) => onChange("infosChantierUsine.epi.autres", e.target.value)}
          />
        </Card>

        <Card title={t("icu_organisation_secours_titre")}>
          <label className="text-sm font-medium block mb-2">{t("icu_numero_urgence_interne")}</label>
          <input
            type="text"
            className={`${INPUT_CLASS} mb-4`}
            style={INPUT_STYLE}
            value={icu.organisationSecours.numeroUrgenceInterne}
            onChange={(e) => onChange("infosChantierUsine.organisationSecours.numeroUrgenceInterne", e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECOURS_CHECKS.map((s) => {
              const value = icu.organisationSecours[s.key];
              return (
                <div key={s.key} className="flex items-center gap-2.5">
                  <label className="flex items-center gap-2 text-sm shrink-0">
                    <input type="checkbox" checked={value.actif} onChange={(e) => updateSecoursCheck(s.key, { actif: e.target.checked })} />
                    {t(s.labelKey)}
                  </label>
                  <input
                    type="text"
                    className="border rounded px-2.5 py-1.5 text-sm flex-1"
                    style={INPUT_STYLE}
                    value={value.numero}
                    onChange={(e) => updateSecoursCheck(s.key, { numero: e.target.value })}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="flex justify-between mt-7">
        <button onClick={onBack} className="px-6 py-2.5 rounded text-sm border" style={{ borderColor: colors.neutralBorderStrong }}>
          {t("bouton_retour")}
        </button>
        <button onClick={onNext} className="px-6 py-2.5 rounded text-sm font-medium" style={{ background: colors.navy, color: "white" }}>
          {t("bouton_continuer")}
        </button>
      </div>
    </div>
  );
}
