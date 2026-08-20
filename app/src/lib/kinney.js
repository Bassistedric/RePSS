// §12 : couleur de la cellule "Évaluation" dérivée de `niveauCode` (compilé à
// partir du texte `niveau` français, seule langue de référence pour ce calcul —
// voir compile_anrigen_multilang_json.py), jamais du texte affiché lui-même :
// un code stable évite toute dépendance à la langue choisie pour le PDF.
// Palette Kinney à 5 niveaux, volontairement séparée de la palette UI de l'app
// (colors.js) : c'est une échelle de criticité imprimée, pas un état d'interface.
const NIVEAUX = [
  { code: "arret", bg: "#7A1F1F", texte: "white" },
  { code: "immediate", bg: "#C1392B", texte: "white" },
  { code: "correction", bg: "#E08B2F", texte: "white" },
  { code: "attention", bg: "#E8C547", texte: "#3A2E00" },
  { code: "acceptable", bg: "#3E9B57", texte: "white" },
];
const NIVEAU_PAR_DEFAUT = { bg: "#E3DFD9", texte: "#3A352E" };

// Certains scores de catalogue_risques.json (calcul P×E×G dans le classeur source)
// portent du bruit de virgule flottante (ex. "9.0000000000000018" au lieu de "9").
// Purement un problème d'affichage : on arrondit pour la lecture, sans jamais
// modifier ni recalculer la valeur métier elle-même.
export function formatNombre(valeur) {
  const n = parseFloat(valeur);
  if (Number.isNaN(n)) return valeur;
  return String(Math.round(n * 100) / 100);
}

export function couleurNiveau(niveauCode) {
  return NIVEAUX.find((n) => n.code === niveauCode) || NIVEAU_PAR_DEFAUT;
}

// Vocabulaire fixe Probabilité/Exposition/Gravité de l'échelle Kinney (§12) :
// même échelle numérique quelle que soit la langue, donc le texte de légende est
// dérivé de `valeur` + UI_Textes (déjà traduit en fr/en/nl), jamais du champ
// `texte` du catalogue lui-même — ça évite de dupliquer cette traduction dans
// les 3 catalogues de risques alors qu'elle existe déjà une seule fois ici.
const PROBABILITE_KEYS = {
  "0.2": "kinney_p_pratiquement_impossible",
  "0.5": "kinney_p_si_tout_va_de_travers",
  1: "kinney_p_possible_simultane",
  3: "kinney_p_inhabituel_possible",
  6: "kinney_p_tout_a_fait_possible",
  10: "kinney_p_va_se_produire",
};
const EXPOSITION_KEYS = {
  "0.5": "kinney_e_2_3x_an",
  1: "kinney_e_chaque_mois",
  3: "kinney_e_chaque_semaine",
  6: "kinney_e_2_3x_jour",
  10: "kinney_e_h_travail",
};
const GRAVITE_KEYS = {
  1: "kinney_g_premiers_soins",
  3: "kinney_g_incapacite",
  7: "kinney_g_invalidite",
  15: "kinney_g_1_mort",
  40: "kinney_g_plusieurs_morts",
};

// Légende Annexe 1 : dérivée dynamiquement de catalogue_risques.json (jamais codée
// en dur dans l'app) — l'ensemble des valeurs réellement utilisées pour chaque
// facteur, triées par valeur croissante, avec leur libellé traduit dans la langue
// du document (`t`).
export function legendeKinney(catalogue, t) {
  const probabilite = new Set();
  const exposition = new Set();
  const gravite = new Set();
  for (const r of catalogue.lignesRisque) {
    for (const ev of [r.evaluationInitiale, r.evaluationResiduelle]) {
      probabilite.add(ev.probabilite.valeur);
      exposition.add(ev.exposition.valeur);
      gravite.add(ev.gravite.valeur);
    }
  }
  const toSortedRows = (s, keys) =>
    [...s]
      .sort((a, b) => parseFloat(a) - parseFloat(b))
      .map((valeur) => ({ texte: keys[valeur] ? t(keys[valeur]) : valeur, valeur }));
  return {
    probabilite: toSortedRows(probabilite, PROBABILITE_KEYS),
    exposition: toSortedRows(exposition, EXPOSITION_KEYS),
    gravite: toSortedRows(gravite, GRAVITE_KEYS),
  };
}
