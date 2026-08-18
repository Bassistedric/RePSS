// Rôles du tableau "Responsable d'approbation" (Infos admin > Administration du
// chantier). Mélange de rôles fixes et variables par chantier — tous traités comme
// des champs texte éditables tant qu'aucune donnée fixe n'est fournie par
// entreprise.json (voir CLAUDE.md §5, point encore ouvert).
export const ROLES_ADMINISTRATION = [
  "role_bu_site_manager",
  "role_tender_engineer",
  "role_operations_manager",
  "role_project_manager",
  "role_assistant_pm",
  "role_project_engineer",
  "role_site_supervisor",
  "role_administrative_officer",
  "role_cp_niv1_sippt",
  "role_cp_niv1",
  "role_membre_sippt_niv3",
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function defaultDossier() {
  const date = today();
  return {
    meta: {
      repssNumero: null,
      version: 1,
      statut: "brouillon",
      dateCreation: date,
      dateDerniereModif: date,
      moadrEnAttente: false,
    },
    identification: {
      numeroChantier: "",
      nomChantier: "",
      pmLead: "",
      pmSecondaire: "",
    },
    triage: {
      modeChoisi: "complet", // "abrege" | "complet"
      aideAuChoix: {
        heuresInf1000: false,
        hauteur5mPlus: false,
        hauteTension: false,
        espaceConfine: false,
      },
    },
    caracterisation: {
      corpsMetier: [], // electricite | hvac_froid | photovoltaique
    },

    // --- Branche complet : "Infos admin.", 3 sous-onglets ---
    renseignementsGeneraux: {
      client: "",
      adresseChantier: "",
      bureauArchitecture: "",
      coordinateurSecurite: "",
    },
    administratif: {
      dateDebutTravaux: "",
      dateFinTravauxEstimee: "",
      motifNouvelleVersion: "",
      responsables: Object.fromEntries(ROLES_ADMINISTRATION.map((r) => [r, ""])),
    },
    reglesSpecifiques: {
      serviceIncendieInterne: "",
      codePostalChantier: "",
      hopitalPlusProcheIds: [],
      derogations: { neant: true, items: [] },
    },
    caracteristiques: {
      // contrôle à 3 états : "interne" | "client" | "na" | null (pas encore renseigné)
      refectoire: null,
      wc: null,
      stockage: null,
      zoneCirculation: null,
      zoneTravail: null,
      electricite: null,
      eau: null,
      gardeCorps: null,
      ligneDeVie: null,
      filetRetention: null,
      particularitesAcces: "",
    },

    // --- Branche abrégé : "Infos chantier & usine" ---
    infosChantierUsine: {
      seveso: false,
      coactivite: false,
      accueilSecurite: false,
      matieresPremierresDangereuses: "",
      pressionsTemperatures: "",
      presenceGaz: false,
      locauxSociaux: { refectoire: null, sanitaires: null, vestiaires: null, douches: null },
      permisFeu: false,
      permisTravail: false,
    },

    // --- Analyse de risques : la ligne de risque est l'unité cochée (§6) ---
    analyseRisques: {
      itemsCoches: [], // [{ risqueId, remarques }]
    },

    documentsAccompagnants: {
      sousTraitants: [], // liste ouverte, non bloquante
      planParticulier: { fichier: null, notes: "" },
      listeEnginsSpeciaux: [],
    },

    demandesMoadr: [], // [{ id, descriptionSituation, dateAjout, statut, mentionDocument, fichierAnnexe }]

    historiqueVersions: [{ version: 1, date, motif: "Création initiale" }],
  };
}
