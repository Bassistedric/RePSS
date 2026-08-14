import {
  Search,
  FileText,
  ClipboardList,
  Users,
  Building2,
  Sparkles,
  ListChecks,
  Siren,
  FileCheck,
} from "lucide-react";

export const STEPS = [
  { key: "identification", labelKey: null, fallback: "Identification", icon: Search },
  { key: "renseignements", labelKey: "titre_rens_gen", fallback: "Renseignements généraux", icon: FileText },
  { key: "administration", labelKey: "titre_adm_chantier", fallback: "Administration", icon: ClipboardList },
  { key: "sousTraitants", labelKey: "titre_liste_sous_traitants", fallback: "Sous-traitants", icon: Users },
  { key: "caracteristiques", labelKey: "titre_carac_chantier", fallback: "Caractéristiques du chantier", icon: Building2 },
  { key: "caracterisation", labelKey: null, fallback: "Caractérisation (abrégé/complet)", icon: Sparkles },
  { key: "analyse", labelKey: "titre_analyse_risques_chantier", fallback: "Analyse de risques", icon: ListChecks },
  { key: "complements", labelKey: "titre_regles_speciales", fallback: "Règles spécifiques & compléments", icon: Siren },
  { key: "finalisation", labelKey: null, fallback: "Finalisation & export", icon: FileCheck },
];
