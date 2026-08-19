import FormStep from "./FormStep";
import HopitalPicker from "./HopitalPicker";
import { renseignementsGenerauxSchema, administratifSchema, caracteristiquesSchema, derogationsColumns } from "../lib/schema";
import { RAPPEL_ACCIDENT_KEYS, APPEL_SECOURS_KEYS } from "../lib/rappelAccident";
import { INFOS_ADMIN_TABS } from "../lib/infosAdminTabs";
import { colors } from "../lib/colors";
import ScreenTitle from "./ScreenTitle";

const derogationsSchema = [{ fields: [{ path: "reglesSpecifiques.derogations.items", type: "table", columns: derogationsColumns }] }];

function FixedRolesTable({ fixes, t }) {
  if (!fixes?.length) return null;
  return (
    <div className="border rounded-lg p-5" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
      <p className="text-base font-semibold mb-3.5" style={{ color: colors.blue }}>
        {t("resp_approbation")} : {t("roles_fixes_suffixe")}
      </p>
      <div className="flex flex-col gap-2">
        {fixes.map((r) => (
          <div key={r.fonction} className="text-sm" style={{ color: colors.neutralTextStrong }}>
            <span className="font-medium">{r.fonction}</span> : {r.nom || t("non_renseigne")}
            {r.tel && <span style={{ color: colors.neutralText }}> · {r.tel}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactCard({ c }) {
  if (!c) return null;
  return (
    <div className="border rounded-lg px-4 py-3 text-sm" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
      <p className="font-semibold" style={{ color: colors.neutralTextStrong }}>
        {c.nom}
      </p>
      {c.adresse && <p style={{ color: colors.neutralText }}>{c.adresse}</p>}
      <p style={{ color: colors.neutralText }}>{[c.tel, c.email].filter(Boolean).join(" · ")}</p>
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
      <ScreenTitle
        title={t("infos_admin_titre")}
        subtitle={t(INFOS_ADMIN_TABS.find((tb) => tb.key === tab)?.labelKey)}
      />

      {tab === "renseignements" && (
        <div>
          <FormStep schema={renseignementsGenerauxSchema} dossier={dossier} setDossier={setDossier} t={t} />
          <div className="mt-5">
            <FormStep schema={caracteristiquesSchema} dossier={dossier} setDossier={setDossier} t={t} />
          </div>
          <p className="text-base font-semibold mt-6 mb-2.5" style={{ color: colors.blue }}>
            {t("contacts_reference_titre")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ContactCard c={contacts.assureurLoi} />
            <ContactCard c={contacts.cnacConstructiv} />
            <ContactCard c={contacts.volta} />
            <ContactCard c={contacts.sepp} />
          </div>
        </div>
      )}

      {tab === "administration" && (
        <div>
          <div className="mb-5">
            <FixedRolesTable fixes={entreprise?.rolesApprobation?.fixes} t={t} />
          </div>
          <FormStep schema={administratifSchema} dossier={dossier} setDossier={setDossier} t={t} />
          <div
            className="border rounded-lg p-5 mt-5"
            style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}
          >
            <p className="text-base font-semibold mb-3.5" style={{ color: colors.blue }}>
              {t("version_dossier_titre")}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3.5 text-sm" style={{ color: colors.neutralText }}>
              <span>
                {t("label_version")} : {dossier.meta.version}
              </span>
              <span>
                {t("derniere_modification")} : {dossier.meta.dateDerniereModif}
              </span>
            </div>
            <label className="text-sm font-medium block mb-2">{t("motif_nouvelle_version")}</label>
            <input
              type="text"
              className="w-full border rounded px-3.5 py-2.5 text-sm"
              style={{ borderColor: colors.neutralBorderStrong }}
              value={dossier.administratif.motifNouvelleVersion}
              onChange={(e) => updateAdministratif({ motifNouvelleVersion: e.target.value })}
            />
          </div>
        </div>
      )}

      {tab === "reglesSpecifiques" && (
        <div className="flex flex-col gap-5">
          <div className="border rounded-lg p-5" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
            <p className="text-base font-semibold mb-2.5" style={{ color: colors.blue }}>
              {t("titre_rappel_accident")}
            </p>
            <ul className="text-sm mb-4 pl-4 list-disc" style={{ color: colors.neutralTextStrong }}>
              {RAPPEL_ACCIDENT_KEYS.map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
            <p className="text-base font-semibold mb-2.5" style={{ color: colors.blue }}>
              {t("titre_appel_secours")}
            </p>
            <ul className="text-sm pl-4 list-disc" style={{ color: colors.neutralTextStrong }}>
              {APPEL_SECOURS_KEYS.map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
          </div>

          <div className="border rounded-lg p-5" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
            <p className="text-base font-semibold mb-3.5" style={{ color: colors.blue }}>
              {t("contacts_urgence_titre")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium block mb-2">{t("service_incendie")}</label>
                <p className="text-sm mb-1.5" style={{ color: colors.neutralTextStrong }}>
                  112
                </p>
                <input
                  type="text"
                  placeholder={t("n_interne_placeholder")}
                  className="w-full border rounded px-3.5 py-2.5 text-sm"
                  style={{ borderColor: colors.neutralBorderStrong }}
                  value={dossier.reglesSpecifiques.serviceIncendieInterne}
                  onChange={(e) => updateReglesSpecifiques({ serviceIncendieInterne: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">{t("centre_antipoison_label")}</label>
                <p className="text-sm" style={{ color: colors.neutralTextStrong }}>
                  070/245.245
                </p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">{t("police_label")}</label>
                <p className="text-sm" style={{ color: colors.neutralTextStrong }}>
                  {contacts.police?.tel || "101"}
                </p>
                {contacts.police?.site_web && (
                  <p className="text-sm" style={{ color: colors.neutralText }}>
                    {t("police_zone_proche")} : {contacts.police.site_web}
                  </p>
                )}
              </div>
            </div>
            <HopitalPicker dossier={dossier} setDossier={setDossier} hopitaux={hopitaux} t={t} />
          </div>

          <div className="border rounded-lg p-5" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
            <p className="text-base font-semibold mb-3.5" style={{ color: colors.blue }}>
              {t("titre_derogations_pss")}
            </p>
            <label className="flex items-center gap-2 text-sm mb-2.5">
              <input
                type="checkbox"
                checked={dossier.reglesSpecifiques.derogations.neant}
                onChange={(e) => updateReglesSpecifiques({ derogations: { ...dossier.reglesSpecifiques.derogations, neant: e.target.checked } })}
              />
              {t("neant")}
            </label>
            {!dossier.reglesSpecifiques.derogations.neant && (
              <FormStep schema={derogationsSchema} dossier={dossier} setDossier={setDossier} t={t} nested />
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-7">
        <button onClick={handleBack} className="px-6 py-2.5 rounded text-sm border" style={{ borderColor: colors.neutralBorderStrong }}>
          {t("bouton_retour")}
        </button>
        <button onClick={handleNext} className="px-6 py-2.5 rounded text-sm font-medium" style={{ background: colors.navy, color: "white" }}>
          {t("bouton_continuer")}
        </button>
      </div>
    </div>
  );
}
