import FormStep from "./FormStep";
import HopitalPicker from "./HopitalPicker";
import { renseignementsGenerauxSchema, administratifSchema, caracteristiquesSchema, derogationsColumns } from "../lib/schema";
import { RAPPEL_ACCIDENT_KEYS, APPEL_SECOURS_KEYS } from "../lib/rappelAccident";
import { INFOS_ADMIN_TABS } from "../lib/infosAdminTabs";

const derogationsSchema = [{ fields: [{ path: "reglesSpecifiques.derogations.items", type: "table", columns: derogationsColumns }] }];

function FixedRolesTable({ fixes, t }) {
  if (!fixes?.length) return null;
  return (
    <div className="border rounded-lg p-4" style={{ borderColor: "#E2E5E8" }}>
      <p className="text-sm font-semibold mb-3" style={{ color: "#156082" }}>
        {t("resp_approbation")} : {t("roles_fixes_suffixe")}
      </p>
      <div className="flex flex-col gap-1.5">
        {fixes.map((r) => (
          <div key={r.fonction} className="text-xs" style={{ color: "#3D4750" }}>
            <span className="font-medium">{r.fonction}</span> : {r.nom || t("non_renseigne")}
            {r.tel && <span style={{ color: "#5A646C" }}> · {r.tel}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactCard({ c }) {
  if (!c) return null;
  return (
    <div className="border rounded px-3 py-2 text-xs" style={{ borderColor: "#E2E5E8" }}>
      <p className="font-semibold" style={{ color: "#3D4750" }}>
        {c.nom}
      </p>
      {c.adresse && <p style={{ color: "#5A646C" }}>{c.adresse}</p>}
      <p style={{ color: "#5A646C" }}>{[c.tel, c.email].filter(Boolean).join(" · ")}</p>
    </div>
  );
}

export default function InfosAdmin({ dossier, setDossier, entreprise, hopitaux, t, onBack, onNext, tab, setTab }) {
  const contacts = entreprise?.contactsReference || {};
  const tabIndex = INFOS_ADMIN_TABS.findIndex((tb) => tb.key === tab);

  // "Continuer"/"Retour" avancent d'abord dans les sous-sections ; ce n'est qu'à la
  // première/dernière qu'ils sortent de l'étape "Infos admin." elle-même.
  function handleNext() {
    const next = INFOS_ADMIN_TABS[tabIndex + 1];
    if (next) setTab(next.key);
    else onNext();
  }
  function handleBack() {
    const prev = INFOS_ADMIN_TABS[tabIndex - 1];
    if (prev) setTab(prev.key);
    else onBack();
  }

  function updateReglesSpecifiques(patch) {
    setDossier((prev) => ({ ...prev, reglesSpecifiques: { ...prev.reglesSpecifiques, ...patch } }));
  }
  function updateAdministratif(patch) {
    setDossier((prev) => ({ ...prev, administratif: { ...prev.administratif, ...patch } }));
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: "#0B3040" }}>
        {t("infos_admin_titre")}
      </h3>
      <p className="text-sm mb-5" style={{ color: "#156082" }}>
        {t(INFOS_ADMIN_TABS.find((tb) => tb.key === tab)?.labelKey)}
      </p>

      {tab === "renseignements" && (
        <div>
          <FormStep schema={renseignementsGenerauxSchema} dossier={dossier} setDossier={setDossier} t={t} />
          <div className="mt-4">
            <FormStep schema={caracteristiquesSchema} dossier={dossier} setDossier={setDossier} t={t} />
          </div>
          <p className="text-sm font-semibold mt-5 mb-2" style={{ color: "#156082" }}>
            {t("contacts_reference_titre")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <ContactCard c={contacts.assureurLoi} />
            <ContactCard c={contacts.cnacConstructiv} />
            <ContactCard c={contacts.volta} />
            <ContactCard c={contacts.sepp} />
          </div>
        </div>
      )}

      {tab === "administration" && (
        <div>
          <div className="mb-4">
            <FixedRolesTable fixes={entreprise?.rolesApprobation?.fixes} t={t} />
          </div>
          <FormStep schema={administratifSchema} dossier={dossier} setDossier={setDossier} t={t} />
          <div className="border rounded-lg p-4 mt-4" style={{ borderColor: "#E2E5E8" }}>
            <p className="text-sm font-semibold mb-3" style={{ color: "#156082" }}>
              {t("version_dossier_titre")}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs" style={{ color: "#5A646C" }}>
              <span>
                {t("label_version")} : {dossier.meta.version}
              </span>
              <span>
                {t("derniere_modification")} : {dossier.meta.dateDerniereModif}
              </span>
            </div>
            <label className="text-sm font-medium block mb-1.5">{t("motif_nouvelle_version")}</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              style={{ borderColor: "#D6DADE" }}
              value={dossier.administratif.motifNouvelleVersion}
              onChange={(e) => updateAdministratif({ motifNouvelleVersion: e.target.value })}
            />
          </div>
        </div>
      )}

      {tab === "reglesSpecifiques" && (
        <div className="flex flex-col gap-4">
          <div className="border rounded-lg p-4" style={{ borderColor: "#E2E5E8" }}>
            <p className="text-sm font-semibold mb-2" style={{ color: "#156082" }}>
              {t("titre_rappel_accident")}
            </p>
            <ul className="text-xs mb-3 pl-4 list-disc" style={{ color: "#3D4750" }}>
              {RAPPEL_ACCIDENT_KEYS.map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
            <p className="text-sm font-semibold mb-2" style={{ color: "#156082" }}>
              {t("titre_appel_secours")}
            </p>
            <ul className="text-xs pl-4 list-disc" style={{ color: "#3D4750" }}>
              {APPEL_SECOURS_KEYS.map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
          </div>

          <div className="border rounded-lg p-4" style={{ borderColor: "#E2E5E8" }}>
            <p className="text-sm font-semibold mb-3" style={{ color: "#156082" }}>
              {t("contacts_urgence_titre")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-sm font-medium block mb-1.5">{t("service_incendie")}</label>
                <p className="text-sm mb-1" style={{ color: "#3D4750" }}>
                  112
                </p>
                <input
                  type="text"
                  placeholder={t("n_interne_placeholder")}
                  className="w-full border rounded px-3 py-2 text-sm"
                  style={{ borderColor: "#D6DADE" }}
                  value={dossier.reglesSpecifiques.serviceIncendieInterne}
                  onChange={(e) => updateReglesSpecifiques({ serviceIncendieInterne: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">{t("centre_antipoison_label")}</label>
                <p className="text-sm" style={{ color: "#3D4750" }}>
                  070/245.245
                </p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">{t("police_label")}</label>
                <p className="text-sm" style={{ color: "#3D4750" }}>
                  {contacts.police?.tel || "101"}
                </p>
                {contacts.police?.site_web && (
                  <p className="text-xs" style={{ color: "#5A646C" }}>
                    {t("police_zone_proche")} : {contacts.police.site_web}
                  </p>
                )}
              </div>
            </div>
            <HopitalPicker dossier={dossier} setDossier={setDossier} hopitaux={hopitaux} t={t} />
          </div>

          <div className="border rounded-lg p-4" style={{ borderColor: "#E2E5E8" }}>
            <p className="text-sm font-semibold mb-3" style={{ color: "#156082" }}>
              {t("titre_derogations_pss")}
            </p>
            <label className="flex items-center gap-2 text-sm mb-2">
              <input
                type="checkbox"
                checked={dossier.reglesSpecifiques.derogations.neant}
                onChange={(e) => updateReglesSpecifiques({ derogations: { ...dossier.reglesSpecifiques.derogations, neant: e.target.checked } })}
              />
              {t("neant")}
            </label>
            {!dossier.reglesSpecifiques.derogations.neant && (
              <FormStep schema={derogationsSchema} dossier={dossier} setDossier={setDossier} t={t} />
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={handleBack} className="px-5 py-2 rounded text-sm border" style={{ borderColor: "#D6DADE" }}>
          {t("bouton_retour")}
        </button>
        <button onClick={handleNext} className="px-5 py-2 rounded text-sm font-medium" style={{ background: "#0B3040", color: "white" }}>
          {t("bouton_continuer")}
        </button>
      </div>
    </div>
  );
}
