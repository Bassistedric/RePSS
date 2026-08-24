// MOADR (Mode Opératoire avec Analyse de Risque) : troisième type de document de
// l'app, distinct du dossier RePSS (voir CLAUDE.md §13). Structure reprise des 9
// sections fixes de F_0X_VMA_MOADR_Blanco.dotm, section 5.2 ("Tableau d'Analyse de
// Risques") construite en direct par le PM plutôt que pré-remplie depuis un
// catalogue — pas de granularité/regroupement à gérer ici, chaque ligne est unique.

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function defaultMoadrDossier() {
  return {
    meta: {
      reference: null, // attribué seulement à la génération, même principe que meta.repssNumero
      version: 1,
      dateCreation: today(),
    },
    // Rempli automatiquement quand le MOADR est ouvert depuis une demande faite au
    // sein d'un RePSS (`demandesMoadr`) ; laissé vide si créé de façon autonome
    // depuis l'accueil.
    origine: {
      repssNumeroChantier: "",
      repssNomChantier: "",
      demandeMoadrId: null,
    },
    objet: {
      projet: "",
      lieu: "",
      dateDebut: "",
      duree: "",
      responsableOperation: "",
    },
    intervention: {
      contexte: "",
      etapesPrincipales: "",
    },
    equipement: {
      materiel: "",
      outils: "",
      moyensLevage: "",
      epiUtilises: "",
    },
    ressourcesHumaines: {
      nombreOperateurs: "",
      qualificationOperateurs: "",
    },
    // §13 : formulaire d'ajout de ligne, texte libre, pas de catalogue préexistant.
    // { id, tache, danger, situationDangereuse, mesuresExistantes,
    //   initial: { probabilite, exposition, gravite }, residuel: { probabilite, exposition, gravite } }
    analyseRisques: {
      lignes: [],
    },
    mesuresPrevention: {
      epc: "",
      epi: "",
      zonesSecurite: "",
      controleEchafaudages: "",
      formations: "",
    },
    procedureSecours: {
      planSecours: "",
      pointAssemblage: "",
    },
    suiviControles: {
      controleQuotidien: "",
      validationInstallations: "",
    },
    signatures: {
      responsableOperationNom: "",
      operateursNoms: "",
    },
  };
}
