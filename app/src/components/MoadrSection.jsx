import { useState } from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

// MOADR = points très spécifiques au chantier, hors catalogue. Liste non bloquante :
// le PM peut continuer le wizard sans les résoudre, elles ressortent en bannière à
// l'étape de génération (CLAUDE.md §5/§6, schéma §3 `demandesMoadr`).
export default function MoadrSection({ dossier, setDossier }) {
  const [draft, setDraft] = useState("");
  const items = dossier.demandesMoadr;

  function addMoadr() {
    if (!draft.trim()) return;
    const entry = {
      id: `moadr_${Date.now()}`,
      descriptionSituation: draft.trim(),
      dateAjout: new Date().toISOString().slice(0, 10),
      statut: "demande",
      mentionDocument: "Ce point sera traité à part et joint en annexe.",
      fichierAnnexe: null,
    };
    setDossier((prev) => ({
      ...prev,
      demandesMoadr: [...prev.demandesMoadr, entry],
      meta: { ...prev.meta, moadrEnAttente: true },
    }));
    setDraft("");
  }

  function removeMoadr(id) {
    setDossier((prev) => {
      const next = prev.demandesMoadr.filter((m) => m.id !== id);
      return { ...prev, demandesMoadr: next, meta: { ...prev.meta, moadrEnAttente: next.length > 0 } };
    });
  }

  return (
    <div className="border rounded-lg p-4 mt-4" style={{ borderColor: "#E2E5E8" }}>
      <p className="text-sm font-semibold mb-1" style={{ color: "#156082" }}>
        Point hors catalogue (MOADR)
      </p>
      <p className="text-xs mb-3" style={{ color: "#5A646C" }}>
        Une situation spécifique au chantier n'est couverte par aucune ligne du catalogue ? Décris-la ici → elle
        sera traitée à part et jointe en annexe, sans bloquer la suite du dossier.
      </p>

      {items.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3">
          {items.map((m) => (
            <div key={m.id} className="flex items-start justify-between gap-2 text-xs border rounded px-2.5 py-1.5" style={{ borderColor: "#E2E5E8" }}>
              <span className="flex items-start gap-1.5" style={{ color: "#3D4750" }}>
                <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: "#B3261E" }} />
                {m.descriptionSituation}
              </span>
              <button onClick={() => removeMoadr(m.id)} style={{ color: "#B3261E" }} className="shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Décrire la situation…"
          className="flex-1 border rounded px-3 py-2 text-sm"
          style={{ borderColor: "#D6DADE" }}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button onClick={addMoadr} className="flex items-center gap-1 text-xs px-3 py-2 rounded border" style={{ borderColor: "#156082", color: "#156082" }}>
          <Plus size={14} /> Ajouter
        </button>
      </div>
    </div>
  );
}
