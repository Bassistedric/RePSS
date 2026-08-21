// Rôles VARIABLES du tableau "Responsable d'approbation" (Infos admin >
// Administration du chantier) : édités par chantier. Les rôles fixes
// (BU Site Manager, Administrative Officer, CP Niv.1 (x2), Membre SIPPT) sont
// affichés en lecture seule depuis entreprise.json > rolesApprobation.fixes.
export const ROLES_ADMINISTRATION = [
  "role_operations_manager",
  "role_project_manager",
  "role_assistant_pm",
  "role_site_supervisor",
  "role_project_engineer",
  "role_tender_engineer",
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
      responsables: Object.fromEntries(
        ROLES_ADMINISTRATION.map((r) => [r, { nom: "", email: "", gsm: "" }])
      ),
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
    // Reprend champ par champ E_F_04_VMA_RePSS_abrégé (cahier des charges détaillé,
    // voir CLAUDE.md). La colonne "vma sud" du document de référence est supprimée
    // (fixe, déjà connue via entreprise.json) : seule la colonne Client subsiste.
    infosChantierUsine: {
      client: {
        nomEntreprise: "",
        representantEmployeur: "",
        adresse: "",
        gsm: "",
        email: "",
      },
      // Nouveau critère bloquant (comme les 4 critères de l'aide au choix en
      // Caractérisation) : Oui force modeChoisi = "complet" et verrouille "Abrégé".
      coactivite: false,
      seveso: false,
      accueilSecurite: false,
      // Pas de "NA" pré-rempli par défaut : au PM de le taper s'il y a lieu.
      matieresPremierres: "",
      produitsDangereux: "",
      descriptionProcess: "",
      pressionsTemperatures: "",
      presenceGaz: false,
      presenceGazDetail: "",
      lieuExecutionSpecifique: "",
      modeOperatoireAbrege: "",
      dateDebutTravaux: "",
      dateFinTravauxPresumee: "",
      representantVmaNom: "",
      representantVmaFonction: "",
      regimeTravail: "", // "1_poste" | "2_postes"
      effectifMoyenParPoste: "",
      sousTraitants: [], // [{ nom, activites }]
      ouvertureChantierParClient: false,
      habilitations: {
        chariotElevateur: false,
        nacelle: false,
        pontier: false,
        levageTelescopique: false,
        ba4: false,
        ba5: false,
        soudeur: false,
        frigoriste: false,
        autres: [], // lignes libres, non limitées à une seule
      },
      // §7 : contrôle à 3 états (Interne/Client/N.A.), pas une case vma sud/Client.
      locauxSociaux: { refectoire: null, sanitaires: null, vestiaires: null, douches: null },
      enginsMisADisposition: false,
      enginsMisADispositionDetail: "",
      epi: {
        casque: false,
        chaussures: false,
        lunettes: false,
        gantsCombinaison: false,
        protectionAuditive: false,
        masqueAntiPoussiere: false,
        protectionFaciale: false,
        harnaisSecurite: false,
        autres: "",
      },
      protectionEnvironnement: {
        evacuationDechets: null,
        evacuationGazFrigorifiques: null,
      },
      permisTravail: {
        permisTravailObligatoire: null,
        consignationInstallations: null,
        permisEspaceRestreint: null,
        permisFouille: null,
        permisFeu: null,
        modeOperatoireExecution: null,
      },
      organisationSecours: {
        numeroUrgenceInterne: "",
        infirmerie: { actif: false, numero: "" },
        serviceSecurite: { actif: false, numero: "" },
        pompiers: { actif: false, numero: "" },
        gardiennage: { actif: false, numero: "" },
      },
      approbation: {
        vmaResponsableNom: "",
        vmaConseillerPreventionNom: "",
        clientResponsableNom: "",
      },
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
