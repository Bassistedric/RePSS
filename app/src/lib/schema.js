import { ROLES_ADMINISTRATION } from "./dossier";

// Schéma déclaratif des formulaires : chaque étape est une liste de groupes,
// chaque groupe une liste de champs. FormStep.jsx s'occupe du rendu générique.
// type: text | textarea | number | date | boolean | table

export const renseignementsGenerauxSchema = [
  {
    titleKey: "titre_rens_gen",
    fields: [
      { path: "renseignementsGeneraux.client", labelKey: "client", type: "text" },
      { path: "renseignementsGeneraux.maitreOeuvre", labelKey: "maitre_oeuvre", type: "text" },
      { path: "renseignementsGeneraux.maitreOuvrage", labelKey: "maitre_ouvrage", type: "text" },
      { path: "renseignementsGeneraux.nomRespTravaux", labelKey: "nom_resp_travaux", type: "text" },
      { path: "renseignementsGeneraux.nomRespPaiements", labelKey: "nom_resp_paiements", type: "text" },
      { path: "renseignementsGeneraux.nomConseillerPrevention", labelKey: "nom_conseiller_prevention", type: "text" },
      { path: "renseignementsGeneraux.bureauArchitecture", labelKey: "bureau_architecture", type: "text" },
      { path: "renseignementsGeneraux.beTechSpeciales", labelKey: "be_tech_speciales", type: "text" },
      { path: "renseignementsGeneraux.coordinateurSecurite", labelKey: "coordinateur_securite", type: "text" },
    ],
  },
  {
    fields: [
      { path: "renseignementsGeneraux.adresseChantier", labelKey: "adresse_chantier", type: "textarea" },
      { path: "renseignementsGeneraux.adresseFacturation", labelKey: "adresse_facturation", type: "textarea" },
      { path: "renseignementsGeneraux.numeroTva", labelKey: "numero_tva", type: "text" },
      { path: "renseignementsGeneraux.tauxTva", labelKey: "taux_tva", type: "text" },
      { path: "renseignementsGeneraux.nbExemplairesFacture", labelKey: "nb_exemplaires_facture", type: "number" },
      { path: "renseignementsGeneraux.etatAvancements", labelKey: "etat_avancements", type: "text" },
      { path: "renseignementsGeneraux.declarationCreance", labelKey: "declaration_creance", type: "text" },
      { path: "renseignementsGeneraux.declarationOnss", labelKey: "declaration_onss", type: "text" },
      { path: "renseignementsGeneraux.formuleRevision", labelKey: "formule_revision", type: "text" },
    ],
  },
];

export const administrationSchema = [
  {
    titleKey: "titre_adm_chantier",
    fields: ROLES_ADMINISTRATION.map((role) => ({
      path: `administration.responsables.${role}`,
      labelKey: role,
      type: "text",
    })),
  },
  {
    titleKey: "titre_revisions_ppss",
    fields: [
      {
        path: "administration.revisionsPPSS",
        type: "table",
        columns: [
          { key: "page", labelKey: "page", type: "text" },
          { key: "changement", labelKey: "changement", type: "text" },
          { key: "date", labelKey: "date", type: "date" },
        ],
      },
    ],
  },
  {
    fields: [
      { path: "administration.descriptionTravaux", labelKey: "description_succinte_travaux", type: "textarea" },
      { path: "administration.dateCommande", labelKey: "date_commande", type: "date" },
      { path: "administration.dateTransfert", labelKey: "date_transfert", type: "date" },
      { path: "administration.dateDebutTravaux", labelKey: "date_debut_travaux", type: "date" },
      { path: "administration.dateFinTravaux", labelKey: "date_fin_travaux", type: "date" },
      { path: "administration.declarationTravauxOnss", labelKey: "declaration_travaux_onss", type: "boolean" },
      { path: "administration.accuseReception", labelKey: "accuse_reception", type: "boolean" },
      { path: "administration.declarationTravauxCnac", labelKey: "declaration_travaux_cnac", type: "boolean" },
      { path: "administration.cautionnement", labelKey: "cautionnement", type: "text" },
      { path: "administration.dureeGarantie", labelKey: "duree_garantie", type: "text" },
      { path: "administration.dateReceptionProvisoire", labelKey: "date_reception_provisoire", type: "date" },
      { path: "administration.dateReceptionDefinitive", labelKey: "date_reception_definitive", type: "date" },
      { path: "administration.dossierAsBuilt", labelKey: "dossier_as_built", type: "text" },
      { path: "administration.dateRemise", labelKey: "date_remise", type: "date" },
      { path: "administration.entretienAPrevoir", labelKey: "entretien_a_prevoir", type: "boolean" },
      { path: "administration.frequence", labelKey: "frequence", type: "text" },
      { path: "administration.reunionChantier", labelKey: "reunion_chantier", type: "boolean" },
      { path: "administration.jourFrequence", labelKey: "jour_frequence", type: "text" },
      { path: "administration.etatDesLieux", labelKey: "etat_des_lieux", type: "boolean" },
      { path: "administration.formationClient", labelKey: "formation_client", type: "boolean" },
      { path: "administration.toutRisqueChantier", labelKey: "tout_risque_chantier", type: "boolean" },
    ],
  },
];

export const sousTraitantsSchema = [
  {
    titleKey: "titre_liste_sous_traitants",
    fields: [
      {
        path: "sousTraitants",
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

export const caracteristiquesSchema = [
  {
    titleKey: "acces_amenagement",
    fields: [
      { path: "caracteristiques.planEnAnnexe", labelKey: "plan_en_annexe", type: "boolean" },
      { path: "caracteristiques.particularitesAcces", labelKey: "particularites_acces", type: "textarea" },
      { path: "caracteristiques.autresPointRassemblement", labelKey: "autres_point_rassemblement", type: "textarea" },
    ],
  },
  {
    titleKey: "installations_particulieres",
    fields: [
      { path: "caracteristiques.refectoire", labelKey: "refectoire", type: "boolean" },
      { path: "caracteristiques.wc", labelKey: "wc", type: "boolean" },
      { path: "caracteristiques.stockage", labelKey: "stockage", type: "boolean" },
      { path: "caracteristiques.evacuationDechets", labelKey: "evacuation_dechets", type: "boolean" },
      {
        path: "caracteristiques.nettoyageInstallationsSanitaires",
        labelKey: "nettoyage_installations_sanitaires",
        type: "boolean",
      },
      { path: "caracteristiques.eclairage", labelKey: "eclairage", type: "boolean" },
      { path: "caracteristiques.zoneCirculation", labelKey: "zone_circulation", type: "text" },
      { path: "caracteristiques.zoneTravail", labelKey: "zone_travail", type: "text" },
    ],
  },
  {
    titleKey: "raccordement_chantier",
    fields: [
      { path: "caracteristiques.electriciteAlimTerre", labelKey: "electricite_alim_terre", type: "boolean" },
      { path: "caracteristiques.eau", labelKey: "eau", type: "boolean" },
    ],
  },
  {
    titleKey: "signalisation_balisage",
    fields: [
      { path: "caracteristiques.panneauSignalisation", labelKey: "panneau_signalisation", type: "boolean" },
      { path: "caracteristiques.barrieres", labelKey: "barrieres", type: "boolean" },
      { path: "caracteristiques.autorisationsParticulieres", labelKey: "autorisations_particulieres", type: "textarea" },
      { path: "caracteristiques.materielSpecifique", labelKey: "materiel_specifique", type: "textarea" },
    ],
  },
  {
    titleKey: "protections_collectives",
    fields: [
      { path: "caracteristiques.gardeCorps", labelKey: "garde_corps", type: "boolean" },
      { path: "caracteristiques.ligneDeVie", labelKey: "ligne_de_vie", type: "boolean" },
      { path: "caracteristiques.filetRetention", labelKey: "filet_retention", type: "boolean" },
      { path: "caracteristiques.produitsDangereux", labelKey: "produits_dangereux", type: "textarea" },
    ],
  },
  {
    titleKey: "divers",
    fields: [
      { path: "caracteristiques.presenceSecouristes", labelKey: "presence_secouristes", type: "boolean" },
      { path: "caracteristiques.permisFeu", labelKey: "permis_feu", type: "boolean" },
      { path: "caracteristiques.permisTravail", labelKey: "permis_travail", type: "boolean" },
    ],
  },
];

export const complementsSchema = [
  {
    titleKey: "titre_regles_speciales",
    fields: [
      { path: "reglesSpecifiques.conseillerPrevention", labelKey: "conseiller_prevention", type: "text" },
      { path: "reglesSpecifiques.serviceIncendie", labelKey: "service_incendie", type: "text" },
      { path: "reglesSpecifiques.serviceIncendieInterne", labelKey: "service_incendie_interne", type: "text" },
      { path: "reglesSpecifiques.infirmerieClient", labelKey: "infirmerie_client", type: "text" },
    ],
  },
  {
    titleKey: "titre_derogations_pss",
    fields: [
      { path: "derogationsPSS.neant", labelKey: "neant", type: "boolean" },
      {
        path: "derogationsPSS.items",
        type: "table",
        columns: [
          { key: "objet", labelKey: "objet", type: "text" },
          { key: "zoneApplication", labelKey: "zone_application", type: "text" },
          { key: "motivationRaison", labelKey: "motivation_raison", type: "text" },
          { key: "autorisationDonneePar", labelKey: "autorisation_donnee_par", type: "text" },
        ],
      },
    ],
  },
  {
    titleKey: "titre_questions_coordination",
    fields: [
      {
        path: "questionsCoordination",
        type: "table",
        columns: [
          { key: "question", labelKey: "question", type: "text" },
          { key: "reponse", labelKey: "reponse", type: "text" },
        ],
      },
    ],
  },
  {
    titleKey: "titre_accords_obligations",
    fields: [
      { path: "accordsObligations.accueilEnLigne", labelKey: "accueil_en_ligne", type: "text" },
      { path: "accordsObligations.lienVideo", labelKey: "lien_video", type: "text" },
      { path: "accordsObligations.lienQuestionnaire", labelKey: "lien_questionnaire", type: "text" },
    ],
  },
  {
    titleKey: "titre_plan_particulier",
    fields: [{ path: "planParticulier.notes", type: "textarea" }],
  },
  {
    titleKey: "titre_liste_engins_speciaux",
    fields: [
      {
        path: "planParticulier.enginsSpeciaux",
        type: "table",
        columns: [
          { key: "typeEngin", labelKey: "type_engin", type: "text" },
          { key: "phase", labelKey: "phase", type: "text" },
          { key: "nombre", labelKey: "nombre", type: "number" },
        ],
      },
    ],
  },
];
