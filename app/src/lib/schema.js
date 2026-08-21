import { ROLES_ADMINISTRATION } from "./dossier";

// Schéma déclaratif des formulaires : chaque groupe est une liste de champs.
// FormStep.jsx s'occupe du rendu générique. type: text | textarea | number | date |
// boolean | tristate | readonly | table

export const renseignementsGenerauxSchema = [
  {
    titleKey: "renseignements_titre",
    fields: [
      { path: "renseignementsGeneraux.client", labelKey: "client", type: "text" },
      { path: "renseignementsGeneraux.bureauArchitecture", labelKey: "bureau_architecture", type: "text" },
      { path: "renseignementsGeneraux.coordinateurSecurite", labelKey: "coordinateur_securite", type: "text" },
    ],
  },
  {
    titleKey: "adresse_chantier_titre",
    fields: [
      { path: "renseignementsGeneraux.rue", labelKey: "adresse_rue", type: "text", wide: true },
      { path: "renseignementsGeneraux.numero", labelKey: "adresse_numero", type: "text" },
      { path: "renseignementsGeneraux.codePostal", labelKey: "adresse_code_postal", type: "text" },
      { path: "renseignementsGeneraux.ville", labelKey: "adresse_ville", type: "text", wide: true },
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
    fields: [{
      path: "administratif.responsables",
      type: "approvalRoles",
      roles: ROLES_ADMINISTRATION,
    }],
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

// Bloc "Client" de l'abrégé : la colonne "vma sud" du document de référence est
// supprimée (fixe, déjà connue via entreprise.json), seule la colonne Client reste,
// réduite à 5 champs (pas de "Téléphone" fixe séparé, pas de "Fonction").
export const infosChantierUsineClientSchema = [
  {
    titleKey: "icu_client_titre",
    fields: [
      { path: "infosChantierUsine.client.nomEntreprise", labelKey: "icu_nom_entreprise", type: "text", wide: true },
      { path: "infosChantierUsine.client.representantEmployeur", labelKey: "icu_representant_employeur", type: "text", wide: true },
      { path: "infosChantierUsine.client.adresse", labelKey: "adresse", type: "text", wide: true },
      { path: "infosChantierUsine.client.gsm", labelKey: "gsm", type: "text" },
      { path: "infosChantierUsine.client.email", labelKey: "email", type: "text" },
    ],
  },
];

// Branche abrégée : "Infos chantier & usine", reprise champ par champ du document de
// référence E_F_04_VMA_RePSS_abrégé (cahier des charges détaillé, CLAUDE.md). Les
// blocs à structure propre (Client, habilitations, sous-traitants, EPI,
// organisation des secours, approbation) sont construits à la main dans
// InfosChantierUsine.jsx plutôt que via ce schéma générique.
export const infosChantierUsineSchema = [
  {
    titleKey: "icu_lieu_execution_titre",
    fields: [
      { path: "infosChantierUsine.seveso", labelKey: "site_seveso", type: "boolean" },
      { path: "infosChantierUsine.accueilSecurite", labelKey: "accueil_securite_requis", type: "boolean" },
    ],
  },
  {
    titleKey: "icu_installation_titre",
    fields: [
      { path: "infosChantierUsine.matieresPremieres", labelKey: "icu_matieres_premieres", type: "textarea" },
      { path: "infosChantierUsine.produitsDangereux", labelKey: "icu_produits_dangereux", type: "textarea" },
      { path: "infosChantierUsine.descriptionProcess", labelKey: "icu_description_process", type: "textarea" },
      { path: "infosChantierUsine.pressionsTemperatures", labelKey: "pressions_temperatures", type: "text" },
      { path: "infosChantierUsine.presenceGaz", labelKey: "presence_gaz", type: "boolean" },
      { path: "infosChantierUsine.presenceGazDetail", labelKey: "icu_presence_gaz_detail", type: "text" },
    ],
  },
  {
    titleKey: "icu_renseignements_generaux_titre",
    fields: [
      { path: "infosChantierUsine.lieuExecutionSpecifique", labelKey: "icu_lieu_execution_specifique", type: "text", wide: true },
      { path: "infosChantierUsine.modeOperatoireAbrege", labelKey: "icu_mode_operatoire", type: "textarea", wide: true, rows: 5 },
      { path: "infosChantierUsine.dateDebutTravaux", labelKey: "date_debut_travaux", type: "date" },
      { path: "infosChantierUsine.dateFinTravauxPresumee", labelKey: "icu_date_fin_travaux_presumee", type: "date" },
      { path: "infosChantierUsine.representantVmaNom", labelKey: "icu_representant_vma_nom", type: "text" },
      { path: "infosChantierUsine.representantVmaFonction", labelKey: "fonction", type: "text" },
      { path: "infosChantierUsine.effectifMoyenParPoste", labelKey: "icu_effectif_moyen", type: "number" },
    ],
  },
  {
    titleKey: "icu_sous_traitants_titre",
    fields: [
      {
        path: "infosChantierUsine.sousTraitants",
        type: "table",
        columns: [
          { key: "nom", labelKey: "icu_nom_sous_traitant", type: "text" },
          { key: "activites", labelKey: "icu_activites_sous_traitant", type: "text" },
        ],
      },
    ],
  },
  {
    fields: [{ path: "infosChantierUsine.ouvertureChantierParClient", labelKey: "icu_ouverture_chantier", type: "boolean" }],
  },
  {
    titleKey: "icu_locaux_sociaux_titre",
    fields: [
      { path: "infosChantierUsine.locauxSociaux.refectoire", labelKey: "refectoire", type: "tristate" },
      { path: "infosChantierUsine.locauxSociaux.sanitaires", labelKey: "sanitaires", type: "tristate" },
      { path: "infosChantierUsine.locauxSociaux.vestiaires", labelKey: "vestiaires", type: "tristate" },
      { path: "infosChantierUsine.locauxSociaux.douches", labelKey: "douches", type: "tristate" },
    ],
  },
  {
    fields: [
      { path: "infosChantierUsine.enginsMisADisposition", labelKey: "icu_engins_disposition", type: "boolean" },
      { path: "infosChantierUsine.enginsMisADispositionDetail", labelKey: "icu_engins_disposition_detail", type: "text" },
    ],
  },
  {
    titleKey: "icu_protection_env_titre",
    fields: [
      { path: "infosChantierUsine.protectionEnvironnement.evacuationDechets", labelKey: "icu_evacuation_dechets", type: "tristate" },
      { path: "infosChantierUsine.protectionEnvironnement.evacuationGazFrigorifiques", labelKey: "icu_evacuation_gaz", type: "tristate" },
    ],
  },
  {
    titleKey: "icu_permis_titre",
    fields: [
      { path: "infosChantierUsine.permisTravail.permisTravailObligatoire", labelKey: "icu_permis_travail_obligatoire", type: "tristate" },
      { path: "infosChantierUsine.permisTravail.consignationInstallations", labelKey: "icu_consignation_installations", type: "tristate" },
      { path: "infosChantierUsine.permisTravail.permisEspaceRestreint", labelKey: "icu_permis_espace_restreint", type: "tristate" },
      { path: "infosChantierUsine.permisTravail.permisFouille", labelKey: "icu_permis_fouille", type: "tristate" },
      { path: "infosChantierUsine.permisTravail.permisFeu", labelKey: "icu_permis_feu", type: "tristate" },
      { path: "infosChantierUsine.permisTravail.modeOperatoireExecution", labelKey: "icu_mode_operatoire_execution", type: "tristate" },
    ],
  },
  {
    titleKey: "icu_approbation_titre",
    fields: [
      { path: "infosChantierUsine.approbation.vmaResponsableNom", labelKey: "icu_approbation_vma_responsable", type: "text" },
      { path: "infosChantierUsine.approbation.vmaConseillerPreventionNom", labelKey: "icu_approbation_vma_conseiller", type: "text" },
      { path: "infosChantierUsine.approbation.clientResponsableNom", labelKey: "icu_approbation_client_responsable", type: "text" },
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
