import FormStep from "./FormStep";
import HopitalPicker from "./HopitalPicker";
import { complementsSchema } from "../lib/schema";

export default function ComplementsStep({ dossier, setDossier, hopitaux, t, onBack, onNext }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#0B3040" }}>
        {t("titre_regles_speciales")}
      </h3>

      <div className="border rounded-lg p-4 mb-6" style={{ borderColor: "#E2E5E8" }}>
        <HopitalPicker dossier={dossier} setDossier={setDossier} hopitaux={hopitaux} t={t} />
      </div>

      <FormStep schema={complementsSchema} dossier={dossier} setDossier={setDossier} t={t} />

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
