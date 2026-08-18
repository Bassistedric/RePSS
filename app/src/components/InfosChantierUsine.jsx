import FormStep from "./FormStep";
import { infosChantierUsineSchema } from "../lib/schema";

export default function InfosChantierUsine({ dossier, setDossier, t, onBack, onNext }) {
  return (
    <div>
      <FormStep schema={infosChantierUsineSchema} dossier={dossier} setDossier={setDossier} t={t} title="Infos chantier & usine" />
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="px-5 py-2 rounded text-sm border" style={{ borderColor: "#D6DADE" }}>
          Retour
        </button>
        <button onClick={onNext} className="px-5 py-2 rounded text-sm font-medium" style={{ background: "#0B3040", color: "white" }}>
          Continuer
        </button>
      </div>
    </div>
  );
}
