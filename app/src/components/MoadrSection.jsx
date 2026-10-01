import { useState } from "react";
import { Plus, Trash2, AlertTriangle, FileText, CheckCircle2, FileCheck2 } from "lucide-react";
import { colors } from "../lib/colors";

// MOADR = points très spécifiques au chantier, hors catalogue. Liste non bloquante :
// le PM peut continuer le wizard sans les résoudre, elles ressortent en bannière à
// l'étape de génération (CLAUDE.md §5/§6, schéma §3 `demandesMoadr`).
// §13 : "Ouvrir le MOADR" lance l'outil MOADR pré-rempli depuis cette demande
// (chantier/date/contexte déjà connus) ; le PDF généré y est référencé en retour
// (fichierAnnexe + moadrDossier complet), la demande passant au statut "traite".
// "traite" ne veut dire que "un PDF existe" — "valide" est un palier distinct,
// posé explicitement ici par le PM, qui déclenche la fusion réelle des pages du
// MOADR dans le PDF du RePSS à la génération (§13, fusion).
export default function MoadrSection({ dossier, setDossier, onOpenMoadr, t }) {
  const [draft, setDraft] = useState("");
  const items = dossier.demandesMoadr;

  function addMoadr() {
    if (!draft.trim()) return;
    const entry = {
      id: `moadr_${Date.now()}`,
      descriptionSituation: draft.trim(),
      dateAjout: new Date().toISOString().slice(0, 10),
      statut: "demande",
      mentionDocument: t("moadr_mention_document"),
      fichierAnnexe: null,
      moadrDossier: null,
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
      return { ...prev, demandesMoadr: next, meta: { ...prev.meta, moadrEnAttente: next.some((m) => m.statut === "demande") } };
    });
  }

  function setStatutMoadr(id, statut) {
    setDossier((prev) => ({
      ...prev,
      demandesMoadr: prev.demandesMoadr.map((m) => (m.id === id ? { ...m, statut } : m)),
    }));
  }

  return (
    <div className="border rounded-lg p-5 mt-5" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
      <p className="text-base font-semibold mb-1.5" style={{ color: colors.blue }}>
        {t("moadr_titre")}
      </p>
      <p className="text-sm mb-3.5" style={{ color: colors.neutralText }}>
        {t("moadr_aide")}
      </p>

      {items.length > 0 && (
        <div className="flex flex-col gap-2 mb-3.5">
          {items.map((m) => {
            const traite = m.statut === "traite";
            const valide = m.statut === "valide";
            return (
              <div
                key={m.id}
                className="flex items-start justify-between gap-2 text-sm border rounded px-3 py-2"
                style={{ borderColor: colors.neutralBorder, background: "white" }}
              >
                <div className="flex flex-col gap-1">
                  <span className="flex items-start gap-2" style={{ color: colors.neutralTextStrong }}>
                    {valide ? (
                      <FileCheck2 size={13} className="mt-0.5 shrink-0" style={{ color: colors.success }} />
                    ) : traite ? (
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: colors.success }} />
                    ) : (
                      <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: colors.warningText }} />
                    )}
                    {m.descriptionSituation}
                  </span>
                  {(traite || valide) && m.fichierAnnexe && (
                    <span className="flex items-center gap-1.5 text-sm ml-5" style={{ color: colors.neutralText }}>
                      <FileText size={12} /> {m.fichierAnnexe}
                    </span>
                  )}
                  {valide && (
                    <span className="text-sm ml-5" style={{ color: colors.success }}>
                      {t("moadr_statut_valide")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {traite && (
                    <button onClick={() => setStatutMoadr(m.id, "valide")} className="text-sm font-medium whitespace-nowrap" style={{ color: colors.success }}>
                      {t("moadr_bouton_valider")}
                    </button>
                  )}
                  {valide && (
                    <button onClick={() => setStatutMoadr(m.id, "traite")} className="text-sm whitespace-nowrap" style={{ color: colors.neutralText }}>
                      {t("moadr_bouton_devalider")}
                    </button>
                  )}
                  {onOpenMoadr && (
                    <button onClick={() => onOpenMoadr(m)} className="text-sm font-medium whitespace-nowrap" style={{ color: colors.blue }}>
                      {traite || valide ? t("moadr_rouvrir") : t("moadr_ouvrir")}
                    </button>
                  )}
                  <button onClick={() => removeMoadr(m.id)} style={{ color: colors.neutralText }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2.5">
        <input
          type="text"
          placeholder={t("moadr_placeholder")}
          className="flex-1 border rounded px-3.5 py-2.5 text-sm"
          style={{ borderColor: colors.neutralBorderStrong, background: "white" }}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button onClick={addMoadr} className="flex items-center gap-1.5 text-sm px-3.5 py-2.5 rounded border" style={{ borderColor: colors.blue, color: colors.blue, background: "white" }}>
          <Plus size={14} /> {t("bouton_ajouter")}
        </button>
      </div>
    </div>
  );
}
