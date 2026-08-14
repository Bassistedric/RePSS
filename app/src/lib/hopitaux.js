// Trouve les 2 hôpitaux les plus proches d'un code postal de chantier,
// par proximité numérique du code postal (même logique que l'ancien
// formulaire de recherche manuelle, cf. content-pack/liste_hopitaux.json).
export function findHopitauxProches(hopitaux, codePostalChantier) {
  const cible = parseInt(codePostalChantier, 10);
  if (!hopitaux?.length || Number.isNaN(cible)) return [];

  const tries = [...hopitaux]
    .filter((h) => !Number.isNaN(parseInt(h.code_postal, 10)))
    .sort((a, b) => Math.abs(parseInt(a.code_postal, 10) - cible) - Math.abs(parseInt(b.code_postal, 10) - cible));

  if (tries.length === 0) return [];

  const premier = tries[0];
  const memeCodePostal = tries.find((h) => h.id !== premier.id && h.code_postal === premier.code_postal);
  const second = memeCodePostal || tries.find((h) => h.id !== premier.id);

  return second ? [premier, second] : [premier];
}
