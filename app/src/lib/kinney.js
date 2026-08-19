// §12 : couleur de la cellule "Évaluation" dérivée du texte eval_ini_niveau /
// eval_res_niveau déjà présent dans catalogue_risques.json — jamais recalculée.
// Palette Kinney à 5 niveaux, volontairement séparée de la palette UI de l'app
// (colors.js) : c'est une échelle de criticité imprimée, pas un état d'interface.
const NIVEAUX = [
  { test: (s) => s.includes("arrêt") || s.includes("arret"), bg: "#7A1F1F", texte: "white" },
  { test: (s) => s.includes("immédiate") || s.includes("immediate"), bg: "#C1392B", texte: "white" },
  { test: (s) => s.includes("correction"), bg: "#E08B2F", texte: "white" },
  { test: (s) => s.includes("attention"), bg: "#E8C547", texte: "#3A2E00" },
  { test: (s) => s.includes("acceptable"), bg: "#3E9B57", texte: "white" },
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

export function couleurNiveau(niveau) {
  const s = (niveau || "").toLowerCase();
  return (NIVEAUX.find((n) => n.test(s)) || NIVEAU_PAR_DEFAUT);
}

// Légende Annexe 1 : dérivée dynamiquement de catalogue_risques.json (jamais codée
// en dur dans l'app) — l'ensemble des couples (texte, valeur) réellement utilisés
// pour chaque facteur, triés par valeur croissante.
export function legendeKinney(catalogue) {
  const probabilite = new Map();
  const exposition = new Map();
  const gravite = new Map();
  for (const r of catalogue.lignesRisque) {
    for (const ev of [r.evaluationInitiale, r.evaluationResiduelle]) {
      probabilite.set(ev.probabilite.texte, ev.probabilite.valeur);
      exposition.set(ev.exposition.texte, ev.exposition.valeur);
      gravite.set(ev.gravite.texte, ev.gravite.valeur);
    }
  }
  const toSortedRows = (m) =>
    [...m.entries()].sort((a, b) => parseFloat(a[1]) - parseFloat(b[1])).map(([texte, valeur]) => ({ texte, valeur }));
  return {
    probabilite: toSortedRows(probabilite),
    exposition: toSortedRows(exposition),
    gravite: toSortedRows(gravite),
  };
}
