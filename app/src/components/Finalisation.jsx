import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileCheck, Save } from "lucide-react";
import RepssDocument from "./pdf/RepssDocument";
import { logoUrl } from "../lib/contentPack";
import { saveDossier } from "../lib/storage";

export default function Finalisation({ dossier, setDossier, entreprise, catalogueComplet, catalogueAbrege, hopitaux, t, onBack }) {
  const accepte = dossier.annexe4.accepte;

  function setAccepte(v) {
    setDossier((prev) => ({ ...prev, annexe4: { accepte: v } }));
  }

  const brand = entreprise?.branding || {};
  const logoAbsoluteUrl = brand.logo ? new URL(logoUrl(brand.logo), window.location.origin).href : null;
  const filename = `RePSS_${dossier.identification.numeroChantier || "brouillon"}.pdf`;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#0B3040" }}>
        {t("titre_regles_generales_entreprise").replace("[nom entreprise]", entreprise?.identite?.nomAffichage || "")}
      </h3>

      <div className="border rounded-lg p-4 mb-4 max-h-64 overflow-y-auto" style={{ borderColor: "#E2E5E8" }}>
        <p className="text-xs whitespace-pre-line" style={{ color: "#3D4750" }}>
          {entreprise?.reglesGeneralesAnnexe4?.texte}
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm mb-6">
        <input type="checkbox" checked={accepte} onChange={(e) => setAccepte(e.target.checked)} />
        Le dossier a été relu, les règles générales de l'entreprise sont annexées et acceptées.
      </label>

      <div className="flex justify-between items-center">
        <button onClick={onBack} className="px-5 py-2 rounded text-sm border" style={{ borderColor: "#D6DADE" }}>
          Retour
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => saveDossier(dossier)}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm border"
            style={{ borderColor: "#156082", color: "#156082" }}
          >
            <Save size={16} />
            Enregistrer le .json
          </button>
          <PDFDownloadLink
            document={
              <RepssDocument
                dossier={dossier}
                entreprise={entreprise}
                catalogueComplet={catalogueComplet}
                catalogueAbrege={catalogueAbrege}
                hopitaux={hopitaux}
                t={t}
                logoAbsoluteUrl={logoAbsoluteUrl}
              />
            }
            fileName={filename}
            className="flex items-center gap-2 px-5 py-2 rounded text-sm font-medium"
            style={{ background: accepte ? "#0B3040" : "#A7AFB6", color: "white", pointerEvents: accepte ? "auto" : "none" }}
          >
            {({ loading }) => (
              <>
                <FileCheck size={16} />
                {loading ? "Génération…" : "Générer le PDF"}
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}
