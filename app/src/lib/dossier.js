// Rôles VARIABLES du tableau "Responsable d'approbation" (Infos admin >
// Administration du chantier) : édités par chantier. Les rôles fixes
// (BU Site Manager, Administrative Officer, CP Niv.1 (x2), Membre SIPPT) sont
// affichés en lecture seule depuis entreprise.json > rolesApprobation.fixes.
export const ROLES_ADMINISTRATION = [
  "role_tender_engineer",
  "role_operations_manager",
  "role_project_manager",
  "role_assistant_pm",
  "role_project_engineer",
  "role_site_supervisor",
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

// Recompose l'adresse du chantier (rue/numéro/code postal/ville, §CLAUDE.md
// scindés en 4 champs) en une seule ligne lisible, pour le PDF.
export function formatAdresseChantier(rg) {
  const ligne1 = [rg.rue, rg.numero].filter(Boolean).join(" ");
  const ligne2 = [rg.codePostal, rg.ville].filter(Boolean).join(" ");
  return [ligne1, ligne2].filter(Boolean).join(", ");
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
      // Image de couverture propre au chantier (data URL), à la place de l'image
      // générique de entreprise.json > branding.photoCouverture. null = image
      // générique. Pas de backend : stockée directement dans le dossier JSON.
      imagePageDeGarde: null,
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
      rue: "",
      numero: "",
      codePostal: "",
      ville: "",
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
