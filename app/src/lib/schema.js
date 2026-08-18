import { ROLES_ADMINISTRATION } from "./dossier";

// Schéma déclaratif des formulaires : chaque groupe est une liste de champs.
// FormStep.jsx s'occupe du rendu générique. type: text | textarea | number | date |
// boolean | tristate | readonly | table

export const renseignementsGenerauxSchema = [
  {
    fields: [
      { path: "renseignementsGeneraux.client", labelKey: "client", type: "text" },
      { path: "renseignementsGeneraux.bureauArchitecture", labelKey: "bureau_architecture", type: "text" },
      { path: "renseignementsGeneraux.coordinateurSecurite", labelKey: "coordinateur_securite", type: "text" },
      { path: "renseignementsGeneraux.adresseChantier", labelKey: "adresse_chantier", type: "textarea" },
    ],
  },
];

// §7 : contrôle à 3 états (Interne / Client / N.A.) plutôt qu'une case à cocher +
// texte libre, pour lever l'ambiguïté d'une case décochée (oublié ? absent ?).
export const caracteristiquesSchema = [
  {
    titleKey: "titre_carac_chantier",
    fields: [
      { path: "caracteristiques.refectoire", labelKey: "refectoire", type: "tristate" },
      { path: "caracteristiques.wc", labelKey: "wc", type: "tristate" },
      { path: "caracteristiques.stockage", labelKey: "stockage", type: "tristate" },
      { path: "caracteristiques.zoneCirculation", labelKey: "zone_circulation", type: "tristate" },
      { path: "caracteristiques.zoneTravail", labelKey: "zone_travail", type: "tristate" },
      { path: "caracteristiques.electricite", labelKey: "electricite_alim_terre", type: "tristate" },
      { path: "caracteristiques.eau", labelKey: "eau", type: "tristate" },
      { path: "caracteristiques.gardeCorps", labelKey: "garde_corps", type: "tristate" },
      { path: "caracteristiques.ligneDeVie", labelKey: "ligne_de_vie", type: "tristate" },
      { path: "caracteristiques.filetRetention", labelKey: "filet_retention", type: "tristate" },
      { path: "caracteristiques.particularitesAcces", labelKey: "particularites_acces", type: "textarea" },
    ],
  },
];

export const administratifSchema = [
  {
    fields: [
      { path: "administratif.dateDebutTravaux", labelKey: "date_debut_travaux", type: "date" },
      { path: "administratif.dateFinTravauxEstimee", labelKey: "date_fin_travaux", type: "date" },
    ],
  },
  {
    titleKey: "resp_approbation",
    fields: ROLES_ADMINISTRATION.map((role) => ({
      path: `administratif.responsables.${role}`,
      labelKey: role,
      type: "text",
    })),
  },
  {
    titleKey: "titre_liste_sous_traitants",
    fields: [
      {
        path: "documentsAccompagnants.sousTraitants",
        type: "table",
        columns: [
          { key: "societe", labelKey: "societe", type: "text" },
          { key: "natureTravaux", labelKey: "nature_travaux", type: "text" },
          { key: "responsable", labelKey: "responsable", type: "text" },
        ],
      },
    ],
  },
];

// Branche abrégée : "Infos chantier & usine", orientée intervention en usine client.
export const infosChantierUsineSchema = [
  {
    fields: [
      { path: "infosChantierUsine.seveso", labelKey: "site_seveso", type: "boolean" },
      { path: "infosChantierUsine.coactivite", labelKey: "coactivite", type: "boolean" },
      { path: "infosChantierUsine.accueilSecurite", labelKey: "accueil_securite_requis", type: "boolean" },
      { path: "infosChantierUsine.presenceGaz", labelKey: "presence_gaz", type: "boolean" },
      { path: "infosChantierUsine.matieresPremierresDangereuses", labelKey: "matieres_premieres_dangereuses", type: "textarea" },
      { path: "infosChantierUsine.pressionsTemperatures", labelKey: "pressions_temperatures", type: "textarea" },
    ],
  },
  {
    titleKey: "installations_particulieres",
    fields: [
      { path: "infosChantierUsine.locauxSociaux.refectoire", labelKey: "refectoire", type: "tristate" },
      { path: "infosChantierUsine.locauxSociaux.sanitaires", labelKey: "sanitaires", type: "tristate" },
      { path: "infosChantierUsine.locauxSociaux.vestiaires", labelKey: "vestiaires", type: "tristate" },
      { path: "infosChantierUsine.locauxSociaux.douches", labelKey: "douches", type: "tristate" },
    ],
  },
  {
    fields: [
      { path: "infosChantierUsine.permisFeu", labelKey: "permis_feu", type: "boolean" },
      { path: "infosChantierUsine.permisTravail", labelKey: "permis_travail", type: "boolean" },
    ],
  },
];

export const derogationsColumns = [
  { key: "objet", labelKey: "objet", type: "text" },
  { key: "zoneApplication", labelKey: "zone_application", type: "text" },
  { key: "motivationRaison", labelKey: "motivation_raison", type: "text" },
  { key: "autorisationDonneePar", labelKey: "autorisation_donnee_par", type: "text" },
];

export const enginsSpeciauxColumns = [
  { key: "typeEngin", labelKey: "type_engin", type: "text" },
  { key: "phase", labelKey: "phase", type: "text" },
  { key: "nombre", labelKey: "nombre", type: "number" },
];
