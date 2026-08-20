import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { readDossierFile } from "../lib/storage";
import { resizeImageToDataUrl } from "../lib/imageResize";
import { colors } from "../lib/colors";
import ScreenTitle from "./ScreenTitle";

export default function Identification({ dossier, setDossier, onNext, t }) {
  const [importInfo, setImportInfo] = useState(null);
  const [imageError, setImageError] = useState(false);
  const fileRef = useRef(null);
  const imageFileRef = useRef(null);
  const { numeroChantier, nomChantier, pmLead, pmSecondaire, imagePageDeGarde } = dossier.identification;
  const chantierId = numeroChantier && nomChantier ? `${numeroChantier} - ${nomChantier}` : "";

  function setIdentification(patch) {
    setDossier((prev) => ({ ...prev, identification: { ...prev.identification, ...patch } }));
  }

  async function handleImageFile(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setImageError(true);
      return;
    }
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setIdentification({ imagePageDeGarde: dataUrl });
      setImageError(false);
    } catch {
      setImageError(true);
    }
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
      <ScreenTitle title={t("identification_titre")} subtitle={t("identification_sous_titre")} />

      <div className="grid grid-cols-[160px_1fr] gap-4 mb-6">
        <div>
          <label className="text-sm font-medium block mb-2">{t("identification_numero_chantier")}</label>
          <input
            type="text"
            placeholder="12345"
            className="w-full border rounded px-3.5 py-2.5 text-sm"
            style={{ borderColor: colors.neutralBorderStrong }}
            value={numeroChantier}
            onChange={(e) => {
              setIdentification({ numeroChantier: e.target.value });
              setImportInfo(null);
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">{t("nom_chantier")}</label>
          <input
            type="text"
            placeholder="Rénovation site Gembloux"
            className="w-full border rounded px-3.5 py-2.5 text-sm"
            style={{ borderColor: colors.neutralBorderStrong }}
            value={nomChantier}
            onChange={(e) => {
              setIdentification({ nomChantier: e.target.value });
              setImportInfo(null);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium block mb-2">{t("identification_pm_lead")}</label>
          <input
            type="text"
            className="w-full border rounded px-3.5 py-2.5 text-sm"
            style={{ borderColor: colors.neutralBorderStrong }}
            value={pmLead}
            onChange={(e) => setIdentification({ pmLead: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">{t("identification_pm_secondaire")}</label>
          <input
            type="text"
            className="w-full border rounded px-3.5 py-2.5 text-sm"
            style={{ borderColor: colors.neutralBorderStrong }}
            value={pmSecondaire}
            onChange={(e) => setIdentification({ pmSecondaire: e.target.value })}
          />
        </div>
      </div>

      <div className="border rounded-lg p-5 mb-6" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
        <p className="text-base font-semibold mb-1.5" style={{ color: colors.blue }}>
          {t("identification_image_page_de_garde_titre")}
        </p>
        <p className="text-sm mb-3.5" style={{ color: colors.neutralText }}>
          {t("identification_image_page_de_garde_texte")}
        </p>
        <div className="flex items-center gap-3.5">
          {imagePageDeGarde && (
            <img
              src={imagePageDeGarde}
              alt=""
              className="h-16 w-28 object-cover rounded border"
              style={{ borderColor: colors.neutralBorder }}
            />
          )}
          <button
            onClick={() => imageFileRef.current?.click()}
            className="flex items-center gap-2 border rounded px-3.5 py-2 text-sm"
            style={{ borderColor: colors.neutralBorderStrong, color: colors.blue, background: "white" }}
          >
            <Upload size={14} />
            {t("identification_image_page_de_garde_bouton")}
          </button>
          {imagePageDeGarde && (
            <button
              onClick={() => setIdentification({ imagePageDeGarde: null })}
              className="flex items-center gap-1.5 text-sm"
              style={{ color: colors.neutralText }}
            >
              <X size={14} />
              {t("identification_image_page_de_garde_reinitialiser")}
            </button>
          )}
        </div>
        <input ref={imageFileRef} type="file" accept="image/png,image/jpeg" onChange={handleImageFile} className="hidden" />
        {imageError && (
          <p className="text-sm mt-2.5" style={{ color: colors.error }}>
            {t("identification_image_page_de_garde_erreur")}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: colors.neutralBorder }} />
        <span className="text-sm" style={{ color: colors.neutralText }}>
          {t("identification_ou")}
        </span>
        <div className="flex-1 h-px" style={{ background: colors.neutralBorder }} />
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 border rounded px-3.5 py-3 text-sm mb-2"
        style={{ borderColor: colors.neutralBorderStrong, color: colors.blue }}
      >
        <Upload size={16} />
        {t("identification_reprendre_bouton")}
      </button>
      <input ref={fileRef} type="file" accept=".json" onChange={handleFile} className="hidden" />

      {importInfo && !importInfo.error && (
        <p className="text-sm mb-6" style={{ color: colors.blue }}>
          {t("identification_dossier_importe")} : {t("identification_version_mot")} {importInfo.version} · {t("identification_modifie_le")} {importInfo.date}
        </p>
      )}
      {importInfo?.error && (
        <p className="text-sm mb-6" style={{ color: colors.error }}>
          {t("identification_erreur_fichier")}
        </p>
      )}
      {!importInfo && <div className="mb-6" />}

      <div className="flex justify-end">
        <button
          disabled={!chantierId}
          onClick={onNext}
          className="px-6 py-2.5 rounded text-sm font-medium disabled:opacity-40"
          style={{ background: colors.navy, color: "white" }}
        >
          {t("bouton_continuer")}
        </button>
      </div>
    </div>
  );
}
