import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { readDossierFile } from "../lib/storage";

export default function Identification({ dossier, setDossier, onNext, t }) {
  const [importInfo, setImportInfo] = useState(null);
  const fileRef = useRef(null);
  const { numeroChantier, nomChantier } = dossier.identification;
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
      <h3 className="text-lg font-semibold mb-1" style={{ color: "#0B3040" }}>
        Identification du chantier
      </h3>
      <p className="text-sm mb-4" style={{ color: "#7A8590" }}>
        Nouveau chantier, ou reprise d'un RePSS déjà commencé
      </p>

      <div className="grid grid-cols-[140px_1fr] gap-3 mb-5">
        <div>
          <label className="text-sm font-medium block mb-1.5">N° chantier</label>
          <input
            type="text"
            placeholder="12345"
            className="w-full border rounded px-3 py-2 text-sm"
            style={{ borderColor: "#D6DADE" }}
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
            style={{ borderColor: "#D6DADE" }}
            value={nomChantier}
            onChange={(e) => {
              setIdentification({ nomChantier: e.target.value });
              setImportInfo(null);
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px" style={{ background: "#E2E5E8" }} />
        <span className="text-xs" style={{ color: "#A7AFB6" }}>
          ou
        </span>
        <div className="flex-1 h-px" style={{ background: "#E2E5E8" }} />
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 border rounded px-3 py-2.5 text-sm mb-2"
        style={{ borderColor: "#D6DADE", color: "#156082" }}
      >
        <Upload size={16} />
        Reprendre un RePSS existant (fichier .json)
      </button>
      <input ref={fileRef} type="file" accept=".json" onChange={handleFile} className="hidden" />

      {importInfo && !importInfo.error && (
        <p className="text-xs mb-5" style={{ color: "#156082" }}>
          Dossier importé : version {importInfo.version} · modifié le {importInfo.date}
        </p>
      )}
      {importInfo?.error && (
        <p className="text-xs mb-5" style={{ color: "#B3261E" }}>
          Ce fichier ne semble pas être un dossier RePSS valide.
        </p>
      )}
      {!importInfo && <div className="mb-5" />}

      <div className="flex justify-end">
        <button
          disabled={!chantierId}
          onClick={onNext}
          className="px-5 py-2 rounded text-sm font-medium disabled:opacity-40"
          style={{ background: "#0B3040", color: "white" }}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
