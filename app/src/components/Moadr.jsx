import { Save, ArrowLeft, Link2 } from "lucide-react";
import FormStep from "./FormStep";
import ScreenTitle from "./ScreenTitle";
import MoadrAnalyseRisques from "./MoadrAnalyseRisques";
import {
  moadrObjetSchema,
  moadrInterventionSchema,
  moadrEquipementSchema,
  moadrRessourcesHumainesSchema,
  moadrMesuresPreventionSchema,
  moadrProcedureSecoursSchema,
  moadrSuiviControlesSchema,
} from "../lib/moadrSchema";
import { saveMoadr } from "../lib/storage";
import { colors } from "../lib/colors";

const LANGUES = [
  { code: "fr", label: "FR" },
  { code: "nl", label: "NL" },
  { code: "en", label: "EN" },
];

export default function Moadr({ moadr, setMoadr, entreprise, t, lang, setLang, onBack }) {
  const responsableSippt = entreprise?.rolesApprobation?.fixes?.find((r) => /SIPPT/i.test(r.fonction));
  const { repssNumeroChantier, repssNomChantier } = moadr.origine;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm" style={{ color: colors.blue }}>
          <ArrowLeft size={15} /> {t("bouton_retour")}
        </button>
        <div className="flex gap-1">
          {LANGUES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="px-2.5 py-1.5 rounded text-xs font-medium border"
              style={{
                borderColor: lang === l.code ? colors.navy : colors.neutralBorderStrong,
                background: lang === l.code ? colors.navyTint : "white",
                color: lang === l.code ? colors.navy : colors.neutralText,
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <ScreenTitle title={t("moadr_outil_titre")} subtitle={t("moadr_outil_sous_titre")} />

      {repssNumeroChantier && (
        <div className="flex items-start gap-2.5 border rounded-lg px-4 py-3 mb-5" style={{ borderColor: colors.blue, background: colors.navyTint }}>
          <Link2 size={16} className="mt-0.5 shrink-0" style={{ color: colors.navy }} />
          <div className="text-sm" style={{ color: colors.neutralTextStrong }}>
            <p className="font-medium">
              {t("moadr_lie_chantier")} : {repssNumeroChantier} — {repssNomChantier}
            </p>
            <p style={{ color: colors.neutralText }}>{t("moadr_lie_demande")}</p>
          </div>
        </div>
      )}

      <FormStep schema={moadrObjetSchema} dossier={moadr} setDossier={setMoadr} t={t} />
      <div className="mt-5">
        <FormStep schema={moadrInterventionSchema} dossier={moadr} setDossier={setMoadr} t={t} />
      </div>
      <div className="mt-5">
        <FormStep schema={moadrEquipementSchema} dossier={moadr} setDossier={setMoadr} t={t} />
      </div>
      <div className="mt-5">
        <FormStep schema={moadrRessourcesHumainesSchema} dossier={moadr} setDossier={setMoadr} t={t} />
      </div>

      <div className="mt-5">
        <p className="text-base font-semibold mb-1" style={{ color: colors.navy }}>
          {t("moadr_s5_titre")}
        </p>
        <p className="text-sm font-medium mb-2.5" style={{ color: colors.neutralText }}>
          {t("moadr_s5_1_titre")}
        </p>
        <MoadrAnalyseRisques moadr={moadr} setMoadr={setMoadr} t={t} />
      </div>

      <div className="mt-5">
        <FormStep schema={moadrMesuresPreventionSchema} dossier={moadr} setDossier={setMoadr} t={t} />
      </div>
      <div className="mt-5">
        <FormStep schema={moadrProcedureSecoursSchema} dossier={moadr} setDossier={setMoadr} t={t} />
      </div>
      <div className="mt-5">
        <FormStep schema={moadrSuiviControlesSchema} dossier={moadr} setDossier={setMoadr} t={t} />
      </div>

      <div className="mt-5 border rounded-lg p-5" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
        <p className="text-base font-semibold mb-4" style={{ color: colors.blue }}>
          {t("moadr_s9_titre")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">{t("moadr_signature_responsable_operation")}</label>
            <input
              type="text"
              className="w-full border rounded px-3.5 py-2.5 text-sm"
              style={{ borderColor: colors.neutralBorderStrong, background: "white" }}
              value={moadr.signatures.responsableOperationNom}
              onChange={(e) => setMoadr((prev) => ({ ...prev, signatures: { ...prev.signatures, responsableOperationNom: e.target.value } }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("moadr_signature_sippt")}</label>
            <p className="text-sm py-2.5" style={{ color: colors.neutralTextStrong }}>
              {responsableSippt?.nom || t("non_renseigne")}
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium block mb-2">{t("moadr_signature_operateurs")}</label>
            <textarea
              className="w-full border rounded px-3.5 py-2.5 text-sm"
              style={{ borderColor: colors.neutralBorderStrong, background: "white" }}
              rows={2}
              value={moadr.signatures.operateursNoms}
              onChange={(e) => setMoadr((prev) => ({ ...prev, signatures: { ...prev.signatures, operateursNoms: e.target.value } }))}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-7">
        <button onClick={onBack} className="px-6 py-2.5 rounded text-sm border" style={{ borderColor: colors.neutralBorderStrong }}>
          {t("bouton_retour")}
        </button>
        <button
          onClick={() => saveMoadr(moadr)}
          className="flex items-center gap-2 px-5 py-2.5 rounded text-sm border"
          style={{ borderColor: colors.blue, color: colors.blue }}
        >
          <Save size={16} />
          {t("enregistrer_json_bouton")}
        </button>
      </div>
    </div>
  );
}
