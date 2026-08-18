import { Search, Sparkles, ClipboardList, ListChecks, FileCheck, Factory } from "lucide-react";

// Le parcours bifurque juste après la Caractérisation : la branche complète et la
// branche abrégée n'ont pas les mêmes étapes (CLAUDE.md §5).
export const PREFIX_STEPS = [
  { key: "identification", fallback: "Identification", icon: Search },
  { key: "caracterisation", fallback: "Caractérisation", icon: Sparkles },
];

export const COMPLET_STEPS = [
  { key: "infosAdmin", fallback: "Infos admin.", icon: ClipboardList },
  { key: "analyse", fallback: "Analyse de risques", icon: ListChecks },
  { key: "generation", fallback: "Annexes & génération", icon: FileCheck },
];

export const ABREGE_STEPS = [
  { key: "infosChantierUsine", fallback: "Infos chantier & usine", icon: Factory },
  { key: "analyse", fallback: "Risques & mesures", icon: ListChecks },
  { key: "generation", fallback: "Génération", icon: FileCheck },
];

export function getSteps(mode) {
  return [...PREFIX_STEPS, ...(mode === "abrege" ? ABREGE_STEPS : COMPLET_STEPS)];
}
