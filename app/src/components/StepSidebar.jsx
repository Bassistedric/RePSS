import { useState } from "react";
import { Check, Circle, Save, Info } from "lucide-react";
import { getSteps } from "../lib/steps";

export default function StepSidebar({ current, dossier, onNavigate, onSave }) {
  const STEPS = getSteps(dossier.triage.modeChoisi);
  const currentIndex = STEPS.findIndex((s) => s.key === current);
  const [showInfo, setShowInfo] = useState(false);
  const { numeroChantier, nomChantier } = dossier.identification;
  const chantierLabel =
    numeroChantier && nomChantier ? `${numeroChantier} - ${nomChantier}` : numeroChantier || nomChantier || "Chantier";

  return (
    <div className="w-56 shrink-0 border-r p-4 flex flex-col" style={{ background: "#F7F8F9", borderColor: "#E2E5E8" }}>
      <p className="text-xs mb-4 truncate" style={{ color: "#5A646C" }}>
        {chantierLabel}
      </p>
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < currentIndex;
          const active = s.key === current;
          const reachable = i <= currentIndex;
          const label = s.fallback;
          return (
            <button
              key={s.key}
              onClick={() => reachable && onNavigate(s.key)}
              disabled={!reachable}
              className="flex items-center gap-2 px-2 py-2 rounded text-sm text-left"
              style={{
                cursor: reachable ? "pointer" : "default",
                ...(active
                  ? { background: "#E7EEF1", color: "#0B3040", fontWeight: 500 }
                  : { color: done ? "#3D4750" : "#5A646C" }),
              }}
            >
              {done ? <Check size={16} /> : active ? <Icon size={16} /> : <Circle size={16} />}
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-3 border-t" style={{ borderColor: "#E2E5E8" }}>
        <button
          onClick={onSave}
          disabled={!numeroChantier && !nomChantier}
          className="w-full flex items-center justify-center gap-2 text-xs px-3 py-2 rounded border disabled:opacity-40"
          style={{ borderColor: "#156082", color: "#156082" }}
        >
          <Save size={14} />
          Enregistrer
        </button>
        <button
          onClick={() => setShowInfo((v) => !v)}
          className="flex items-center gap-1 text-[11px] mt-1.5 mx-auto"
          style={{ color: "#5A646C" }}
        >
          <Info size={11} />
          Comment ça marche ?
        </button>
        {showInfo && (
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "#5A646C" }}>
            Télécharge l'état actuel dans un fichier .json à déposer dans le dossier SharePoint du chantier.
            Pour reprendre plus tard : reviens sur l'écran d'identification et clique "Reprendre un RePSS
            existant", puis choisis ce fichier.
          </p>
        )}
      </div>
    </div>
  );
}
