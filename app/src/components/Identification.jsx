import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { readDossierFile } from "../lib/storage";
import { colors } from "../lib/colors";

export default function Identification({ dossier, setDossier, onNext, t }) {
  const [importInfo, setImportInfo] = useState(null);
  const fileRef = useRef(null);
  const { numeroChantier, nomChantier, pmLead, pmSecondaire } = dossier.identification;
  const chantierId = numeroChantier && nomChantier ? `${numeroChantier} - ${nomChantier}` : "";

  function setIdentification(patch) {
    setDossier((prev) => ({ ...prev, identification: { ...prev.identification, ...patch } }));
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await readDossierFile(file);
      if (!data?.identification) throw new Error("format invalide");
      setDossier(data);
      setImportInfo({
        version: data?.meta?.version ?? "?",
        date: data?.meta?.dateDerniereModif ?? "?",
      });
    } catch {
      setImportInfo({ error: true });
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: colors.navy }}>
        {t("identification_titre")}
      </h3>
      <p className="text-sm mb-4" style={{ color: colors.neutralText }}>
        {t("identification_sous_titre")}
      </p>

      <div className="grid grid-cols-[140px_1fr] gap-3 mb-5">
        <div>
          <label className="text-sm font-medium block mb-1.5">{t("identification_numero_chantier")}</label>
          <input
            type="text"
            placeholder="12345"
            className="w-full border rounded px-3 py-2 text-sm"
            style={{ borderColor: colors.neutralBorderStrong }}
            value={numeroChantier}
            onChange={(e) => {
              setIdentification({ numeroChantier: e.target.value });
              setImportInfo(null);
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">{t("nom_chantier")}</label>
          <input
            type="text"
            placeholder="Rénovation site Gembloux"
            className="w-full border rounded px-3 py-2 text-sm"
            style={{ borderColor: colors.neutralBorderStrong }}
            value={nomChantier}
            onChange={(e) => {
              setIdentification({ nomChantier: e.target.value });
              setImportInfo(null);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="text-sm font-medium block mb-1.5">{t("identification_pm_lead")}</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            style={{ borderColor: colors.neutralBorderStrong }}
            value={pmLead}
            onChange={(e) => setIdentification({ pmLead: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">{t("identification_pm_secondaire")}</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            style={{ borderColor: colors.neutralBorderStrong }}
            value={pmSecondaire}
            onChange={(e) => setIdentification({ pmSecondaire: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px" style={{ background: colors.neutralBorder }} />
        <span className="text-xs" style={{ color: colors.neutralText }}>
          {t("identification_ou")}
        </span>
        <div className="flex-1 h-px" style={{ background: colors.neutralBorder }} />
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 border rounded px-3 py-2.5 text-sm mb-2"
        style={{ borderColor: colors.neutralBorderStrong, color: colors.blue }}
      >
        <Upload size={16} />
        {t("identification_reprendre_bouton")}
      </button>
      <input ref={fileRef} type="file" accept=".json" onChange={handleFile} className="hidden" />

      {importInfo && !importInfo.error && (
        <p className="text-xs mb-5" style={{ color: colors.blue }}>
          {t("identification_dossier_importe")} : {t("identification_version_mot")} {importInfo.version} · {t("identification_modifie_le")} {importInfo.date}
        </p>
      )}
      {importInfo?.error && (
        <p className="text-xs mb-5" style={{ color: colors.error }}>
          {t("identification_erreur_fichier")}
        </p>
      )}
      {!importInfo && <div className="mb-5" />}

      <div className="flex justify-end">
        <button
          disabled={!chantierId}
          onClick={onNext}
          className="px-5 py-2 rounded text-sm font-medium disabled:opacity-40"
          style={{ background: colors.navy, color: "white" }}
        >
          {t("bouton_continuer")}
        </button>
      </div>
    </div>
  );
}
