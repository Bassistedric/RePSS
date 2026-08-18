// Sous-sections de l'étape "Infos admin.", affichées comme sous-menu dépliable
// dans la sidebar (uniquement quand cette étape est active). isComplete() est une
// heuristique de remplissage utilisée pour l'indicateur de progression : au moins
// un champ significatif de la sous-section renseigné.
export const INFOS_ADMIN_TABS = [
  {
    key: "renseignements",
    labelKey: "titre_rens_gen",
    isComplete: (d) =>
      Boolean(
        d.renseignementsGeneraux.client ||
          d.renseignementsGeneraux.bureauArchitecture ||
          d.renseignementsGeneraux.coordinateurSecurite ||
          d.renseignementsGeneraux.adresseChantier
      ),
  },
  {
    key: "administration",
    labelKey: "titre_adm_chantier",
    isComplete: (d) =>
      Boolean(
        d.administratif.dateDebutTravaux ||
          d.administratif.dateFinTravauxEstimee ||
          Object.values(d.administratif.responsables).some(Boolean) ||
          d.documentsAccompagnants.sousTraitants.length > 0
      ),
  },
  {
    key: "reglesSpecifiques",
    labelKey: "titre_regles_speciales",
    isComplete: (d) =>
      Boolean(
        d.reglesSpecifiques.serviceIncendieInterne ||
          d.reglesSpecifiques.hopitalPlusProcheIds.length > 0 ||
          !d.reglesSpecifiques.derogations.neant
      ),
  },
];
