// Schéma déclaratif des sections fixes du MOADR (F_0X_VMA_MOADR_Blanco.dotm),
// consommé par FormStep.jsx comme le reste de l'app. La section 5 (Analyse de
// Risque) n'est pas ici : elle a sa propre UI (formulaire d'ajout de ligne, voir
// MoadrAnalyseRisques.jsx), pas un simple schéma de champs.

export const moadrObjetSchema = [
  {
    titleKey: "moadr_s1_titre",
    fields: [
      { path: "objet.projet", labelKey: "moadr_projet", type: "text", wide: true },
      { path: "objet.lieu", labelKey: "moadr_lieu", type: "text", wide: true },
      { path: "objet.dateDebut", labelKey: "moadr_date_debut", type: "date" },
      { path: "objet.duree", labelKey: "moadr_duree", type: "text" },
      { path: "objet.responsableOperation", labelKey: "moadr_responsable_operation", type: "text", wide: true },
    ],
  },
];

export const moadrInterventionSchema = [
  {
    titleKey: "moadr_s2_titre",
    fields: [
      { path: "intervention.contexte", labelKey: "moadr_contexte", type: "textarea", wide: true },
      { path: "intervention.etapesPrincipales", labelKey: "moadr_etapes_principales", type: "textarea", wide: true, rows: 5 },
    ],
  },
];

export const moadrEquipementSchema = [
  {
    titleKey: "moadr_s3_titre",
    fields: [
      { path: "equipement.materiel", labelKey: "moadr_materiel", type: "textarea" },
      { path: "equipement.outils", labelKey: "moadr_outils", type: "textarea" },
      { path: "equipement.moyensLevage", labelKey: "moadr_moyens_levage", type: "textarea" },
      { path: "equipement.epiUtilises", labelKey: "moadr_epi_utilises", type: "textarea" },
    ],
  },
];

export const moadrRessourcesHumainesSchema = [
  {
    titleKey: "moadr_s4_titre",
    fields: [
      { path: "ressourcesHumaines.nombreOperateurs", labelKey: "moadr_nombre_operateurs", type: "number" },
      { path: "ressourcesHumaines.qualificationOperateurs", labelKey: "moadr_qualification_operateurs", type: "textarea" },
    ],
  },
];

export const moadrMesuresPreventionSchema = [
  {
    titleKey: "moadr_s6_titre",
    fields: [
      { path: "mesuresPrevention.epc", labelKey: "moadr_epc", type: "textarea" },
      { path: "mesuresPrevention.epi", labelKey: "moadr_epi_mesures", type: "textarea" },
      { path: "mesuresPrevention.zonesSecurite", labelKey: "moadr_zones_securite", type: "textarea" },
      { path: "mesuresPrevention.controleEchafaudages", labelKey: "moadr_controle_echafaudages", type: "textarea" },
      { path: "mesuresPrevention.formations", labelKey: "moadr_formations", type: "textarea" },
    ],
  },
];

export const moadrProcedureSecoursSchema = [
  {
    titleKey: "moadr_s7_titre",
    fields: [
      { path: "procedureSecours.planSecours", labelKey: "moadr_plan_secours", type: "textarea", wide: true },
      { path: "procedureSecours.pointAssemblage", labelKey: "moadr_point_assemblage", type: "text", wide: true },
    ],
  },
];

export const moadrSuiviControlesSchema = [
  {
    titleKey: "moadr_s8_titre",
    fields: [
      { path: "suiviControles.controleQuotidien", labelKey: "moadr_controle_quotidien", type: "textarea" },
      { path: "suiviControles.validationInstallations", labelKey: "moadr_validation_installations", type: "textarea" },
    ],
  },
];

export const moadrSignaturesSchema = [
  {
    titleKey: "moadr_s9_titre",
    fields: [
      { path: "signatures.responsableOperationNom", labelKey: "moadr_signature_responsable_operation", type: "text" },
      { path: "signatures.operateursNoms", labelKey: "moadr_signature_operateurs", type: "textarea", wide: true },
    ],
  },
];
