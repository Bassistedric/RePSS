import { Search, Sparkles, ClipboardList, ListChecks, FileCheck, Factory } from "lucide-react";

// Le parcours bifurque juste après la Caractérisation : la branche complète et la
// branche abrégée n'ont pas les mêmes étapes (CLAUDE.md §5).
export const PREFIX_STEPS = [
  { key: "identification", labelKey: "step_identification", icon: Search },
  { key: "caracterisation", labelKey: "step_caracterisation", icon: Sparkles },
];

export const COMPLET_STEPS = [
  { key: "infosAdmin", labelKey: "step_infos_admin", icon: ClipboardList },
  { key: "analyse", labelKey: "step_analyse_complet", icon: ListChecks },
  { key: "generation", labelKey: "step_generation_complet", icon: FileCheck },
];

export const ABREGE_STEPS = [
  { key: "infosChantierUsine", labelKey: "step_infos_chantier_usine", icon: Factory },
  { key: "analyse", labelKey: "step_analyse_abrege", icon: ListChecks },
  { key: "generation", labelKey: "step_generation_abrege", icon: FileCheck },
];

export function getSteps(mode) {
  return [...PREFIX_STEPS, ...(mode === "abrege" ? ABREGE_STEPS : COMPLET_STEPS)];
}
