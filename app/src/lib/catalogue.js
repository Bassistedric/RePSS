// §6 : plusieurs lignes de catalogue_risques.json peuvent partager le même
// sourceDanger sous une même activité (une évaluation Kinney distincte par
// conséquence possible). Regroupées ici par ordre d'apparition pour l'affichage
// (wizard et PDF) : une seule case à cocher / un seul en-tête par sourceDanger,
// même quand plusieurs `risqueId` y sont rattachés.
export function grouperLignesParSourceDanger(lignesRisque) {
  const groupes = [];
  const parSourceDanger = new Map();
  for (const r of lignesRisque) {
    let groupe = parSourceDanger.get(r.sourceDanger);
    if (!groupe) {
      groupe = { sourceDanger: r.sourceDanger, membres: [] };
      parSourceDanger.set(r.sourceDanger, groupe);
      groupes.push(groupe);
    }
    groupe.membres.push(r);
  }
  return groupes;
}
