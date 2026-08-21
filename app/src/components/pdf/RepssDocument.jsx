import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { ROLES_ADMINISTRATION, formatAdresseChantier } from "../../lib/dossier";
import { colors } from "../../lib/colors";
import { couleurNiveau, legendeKinney, formatNombre } from "../../lib/kinney";
import { RAPPEL_ACCIDENT_KEYS, APPEL_SECOURS_KEYS } from "../../lib/rappelAccident";

// §12 : structure complète du PDF, spécifiée dans CLAUDE.md — couverture, page
// d'explication, table des matières, renseignements/administration/caractéristiques/
// règles spécifiques, Annexe 1 (légende Kinney), analyse de risques (vrai tableau
// paysage), émargement, Annexe 2/3/4.
const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 9, fontFamily: "Helvetica", color: colors.neutralTextStrong },
  pageLandscape: { padding: 24, fontSize: 8, fontFamily: "Helvetica", color: colors.neutralTextStrong },

  footer: { position: "absolute", bottom: 14, left: 32, right: 32, fontSize: 7, color: colors.neutralText, textAlign: "center" },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  logo: { height: 30, objectFit: "contain" },
  title: { fontSize: 16, fontWeight: 700 },
  subtitle: { fontSize: 10, color: colors.neutralText, marginTop: 2 },
  section: { marginBottom: 14, breakInside: "avoid" },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginBottom: 6, paddingBottom: 3, borderBottom: `1pt solid ${colors.neutralBorderStrong}` },
  sectionBoxed: {
    padding: 14,
    borderRadius: 4,
    border: `1pt solid ${colors.neutralBorder}`,
    backgroundColor: colors.neutralBgSubtle,
  },
  sectionBoxedTitle: { fontSize: 11, fontWeight: 700, color: colors.navy, marginBottom: 8 },
  row: { flexDirection: "row", marginBottom: 3 },
  kvKey: { width: 160, color: colors.neutralText },
  kvVal: { flex: 1, fontWeight: 500 },
  bullet: { flexDirection: "row", marginBottom: 2 },
  bulletDot: { width: 10 },

  tableHeader: { flexDirection: "row", borderBottom: `1pt solid ${colors.navy}`, paddingBottom: 3, marginBottom: 3 },
  tableRow: { flexDirection: "row", borderBottom: `0.5pt solid ${colors.neutralBorder}`, paddingVertical: 2 },
  th: { fontWeight: 700, fontSize: 8 },
  td: { fontSize: 8 },

  contactCard: { width: "31%", marginBottom: 8, marginRight: "2%", fontSize: 7.5, border: `0.5pt solid ${colors.neutralBorder}`, padding: 6 },
  contactLogo: { height: 16, objectFit: "contain", marginBottom: 4 },
  logosRow: { flexDirection: "row", flexWrap: "wrap" },

  // Règles spécifiques : contacts d'urgence, logos plus grands que ceux des
  // contacts de référence (§12) pour rester lisibles dans un contexte d'urgence.
  contactCardUrgence: { width: "31%", marginBottom: 8, marginRight: "2%", fontSize: 7.5, border: `0.5pt solid ${colors.neutralBorder}`, padding: 8 },
  contactLogoUrgence: { height: 32, objectFit: "contain", marginBottom: 5 },

  // --- Couverture ---
  coverPage: { padding: 0, fontFamily: "Helvetica" },
  coverContent: { flex: 1, padding: 40, flexDirection: "column" },
  coverLogo: { height: 46, objectFit: "contain", marginBottom: 40, alignSelf: "center" },
  coverTitle: { fontSize: 26, fontWeight: 700, color: colors.navy, textAlign: "center" },
  coverModeLabel: { fontSize: 13, color: colors.neutralText, marginTop: 6, textAlign: "center" },
  coverBox: { marginTop: 40, padding: 16, borderRadius: 4, border: `1.5pt solid ${colors.navy}`, backgroundColor: colors.navyTint, alignItems: "center" },
  coverBoxLabel: { fontSize: 8, color: colors.navy, textTransform: "uppercase", letterSpacing: 1, textAlign: "center" },
  coverBoxValue: { fontSize: 15, fontWeight: 700, color: colors.navy, marginTop: 3, textAlign: "center" },
  coverPhoto: { width: "100%", height: 240, objectFit: "cover", marginTop: 24, borderRadius: 4 },
  coverSpacer: { flexGrow: 1 },
  coverMetaRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 14, borderTop: `0.5pt solid ${colors.neutralBorder}` },
  coverMetaItem: { fontSize: 9, color: colors.neutralText },

  // --- Page d'explication ---
  explicationContent: { flex: 1, flexDirection: "column" },
  explicationBloc: {
    marginTop: 16,
    padding: 14,
    borderRadius: 4,
    border: `1pt solid ${colors.neutralBorder}`,
    backgroundColor: colors.neutralBgSubtle,
  },
  explicationBlocTitre: { fontSize: 11, fontWeight: 700, color: colors.navy, marginBottom: 6 },
  explicationBlocTexte: { lineHeight: 1.5 },
  explicationSpacer: { flexGrow: 1 },
  explicationLogo: { height: 100, objectFit: "contain", alignSelf: "center", opacity: 0.22, marginBottom: 4 },

  // --- Table des matières ---
  tocEntry: { flexDirection: "row", alignItems: "flex-end", marginBottom: 8 },
  tocLabel: { fontSize: 10.5 },
  tocDots: { flex: 1, borderBottom: `0.75pt dotted ${colors.neutralBorderStrong}`, marginHorizontal: 4, marginBottom: 2 },
  tocIndexBadge: { width: 18, fontSize: 9, color: colors.neutralText },

  // --- Catégorie/sous-catégorie/activité (hiérarchie de titres) ---
  catTitle: { fontSize: 10, fontWeight: 700, color: colors.navy, marginTop: 8, marginBottom: 3, paddingBottom: 2, borderBottom: `1pt solid ${colors.neutralBorder}` },
  subTitle: { fontSize: 9.5, fontWeight: 700, color: colors.navy, marginTop: 5, marginBottom: 2, paddingBottom: 2, borderBottom: `1.25pt solid ${colors.turquoise}` },
  actTitle: { fontSize: 9, fontWeight: 500, color: colors.neutralTextStrong, marginTop: 3, marginBottom: 1, marginLeft: 6 },
  ligneRisque: { marginLeft: 12, marginTop: 1, marginBottom: 1 },

  // --- Annexe 1 : légende Kinney ---
  kinneyFormule: { fontSize: 11, fontWeight: 700, color: colors.navy, textAlign: "center", marginVertical: 10 },
  kinneyGrids: { flexDirection: "row", gap: 10 },
  kinneyGrid: { flex: 1 },
  kinneyGridTitle: { fontSize: 9, fontWeight: 700, color: colors.navy, marginBottom: 3, paddingBottom: 2, borderBottom: `1pt solid ${colors.neutralBorder}` },
  kinneyGridRow: { flexDirection: "row", borderBottom: `0.5pt solid ${colors.neutralBorder}`, paddingVertical: 2.5 },
  kinneyGridValeur: { width: 26, fontWeight: 700 },
  kinneyNiveauRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  kinneyNiveauSwatch: { width: 14, height: 10, marginRight: 6, borderRadius: 2 },

  // --- Tableau d'analyse de risques (paysage) ---
  rtHeaderGroup: { flexDirection: "row", borderTop: `1pt solid ${colors.navy}` },
  rtHeaderSub: { flexDirection: "row", borderBottom: `1pt solid ${colors.navy}`, paddingBottom: 3, marginBottom: 2 },
  rtHeaderCell: { fontWeight: 700, fontSize: 7, color: colors.navy, textAlign: "center", paddingHorizontal: 2 },
  rtHeaderCellGroup: { fontWeight: 700, fontSize: 7, color: colors.navy, textAlign: "center", paddingVertical: 2, backgroundColor: colors.navyTint },
  rtBanner: { paddingVertical: 3, marginTop: 3, marginBottom: 1 },
  rtBannerCategorie: { backgroundColor: colors.navy },
  rtBannerCategorieText: { color: "white", fontSize: 9, fontWeight: 700, textAlign: "center" },
  rtBannerSousCategorie: { backgroundColor: colors.navyTint },
  rtBannerSousCategorieText: { color: colors.navy, fontSize: 8.5, fontWeight: 700, textAlign: "center" },
  rtBannerActivite: { backgroundColor: colors.neutralBgSubtle },
  rtBannerActiviteText: { color: colors.neutralTextStrong, fontSize: 8, fontWeight: 500, textAlign: "center" },
  rtRow: { flexDirection: "row", borderBottom: `0.5pt solid ${colors.neutralBorder}`, paddingVertical: 3, minHeight: 16 },
  rtCell: { fontSize: 7, paddingHorizontal: 2 },
  rtEvalCell: { fontSize: 7, fontWeight: 700, textAlign: "center", paddingVertical: 2, borderRadius: 2, marginHorizontal: 1 },

  // --- Émargement ---
  emargeRow: { flexDirection: "row", borderBottom: `0.5pt solid ${colors.neutralBorder}`, minHeight: 22 },
  emargeHeaderCell: { fontWeight: 700, fontSize: 8, paddingVertical: 4, paddingHorizontal: 3 },
  emargeCell: { fontSize: 8, paddingVertical: 4, paddingHorizontal: 3 },

  // --- Annexe 4 : signature (Operations Manager/Project Manager/Responsable SIPPT) ---
  signatureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `0.5pt solid ${colors.neutralBorder}`,
    paddingVertical: 10,
  },
  signatureRole: { fontSize: 9, fontWeight: 500 },
  signatureBox: { width: 220, height: 42, border: `0.75pt solid ${colors.neutralBorderStrong}` },
  signatureChantier: { fontSize: 8, color: colors.neutralText, marginBottom: 8 },

  // --- Caractéristiques du chantier : contrôle à 3 états, même forme que le web
  // (FormStep.jsx TriStateField) plutôt qu'un simple texte, §CLAUDE.md §7.
  tristateRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  tristateLabel: { width: 160, color: colors.neutralText },
  tristateOptions: { flexDirection: "row" },
  tristateBox: { paddingVertical: 3, paddingHorizontal: 8, border: `0.75pt solid ${colors.neutralBorderStrong}`, marginRight: 4, borderRadius: 2 },
  tristateBoxActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  tristateBoxTextActive: { color: "white", fontWeight: 700 },
  tristateBoxTextInactive: { color: colors.neutralText },
});

// Largeurs de colonnes du tableau d'analyse de risques (somme = 100%).
const RT_COLS = {
  ref: 4,
  sourceDanger: 15,
  risques: 15,
  p: 5,
  e: 5,
  g: 5,
  eval: 7,
  mesures: 22,
  pRes: 5,
  eRes: 5,
  gRes: 5,
  evalRes: 7,
};

function PageFooter({ t }) {
  return (
    <Text
      style={styles.footer}
      fixed
      render={({ pageNumber, totalPages }) => `${t("page")} ${pageNumber} / ${totalPages}`}
    />
  );
}

// `boxed` : principe de zone encadrée de la page d'explication (§CLAUDE.md),
// généralisé aux autres sections du document. `wrap={false}` empêche la zone
// d'être coupée par un saut de page automatique : si elle ne tient pas dans
// l'espace restant, elle bascule entière sur la page suivante plutôt que
// d'être scindée en deux.
function Section({ title, children, boxed }) {
  if (boxed) {
    return (
      <View style={[styles.section, styles.sectionBoxed]} wrap={false}>
        {title && <Text style={styles.sectionBoxedTitle}>{title}</Text>}
        {children}
      </View>
    );
  }
  return (
    <View style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );
}

function KV({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.kvKey}>{label}</Text>
      <Text style={styles.kvVal}>{String(value)}</Text>
    </View>
  );
}

function TriStateRow({ label, value, t }) {
  if (!value) return null;
  const tristateLabel = { interne: t("tristate_interne"), client: t("tristate_client"), na: t("tristate_na") };
  return <KV label={label} value={tristateLabel[value] || value} />;
}

// Caractéristiques du chantier : même forme que le contrôle à 3 états du web
// (FormStep.jsx TriStateField) — la case correspondant à la valeur choisie est
// colorée, les 2 autres restent neutres, plutôt qu'un simple texte.
const TRISTATE_PDF_OPTIONS = [
  { value: "interne", labelKey: "tristate_interne" },
  { value: "client", labelKey: "tristate_client" },
  { value: "na", labelKey: "tristate_na" },
];

function TriStateBoxRow({ label, value, t }) {
  if (!value) return null;
  return (
    <View style={styles.tristateRow}>
      <Text style={styles.tristateLabel}>{label}</Text>
      <View style={styles.tristateOptions}>
        {TRISTATE_PDF_OPTIONS.map((o) => {
          const active = value === o.value;
          return (
            <View key={o.value} style={[styles.tristateBox, active && styles.tristateBoxActive]}>
              <Text style={active ? styles.tristateBoxTextActive : styles.tristateBoxTextInactive}>{t(o.labelKey)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// Ordre identique à caracteristiquesSchema (lib/schema.js).
const CARACTERISTIQUES_FIELDS = [
  { key: "refectoire", labelKey: "refectoire" },
  { key: "wc", labelKey: "wc" },
  { key: "stockage", labelKey: "stockage" },
  { key: "zoneCirculation", labelKey: "zone_circulation" },
  { key: "zoneTravail", labelKey: "zone_travail" },
  { key: "electricite", labelKey: "electricite_alim_terre" },
  { key: "eau", labelKey: "eau" },
  { key: "gardeCorps", labelKey: "garde_corps" },
  { key: "ligneDeVie", labelKey: "ligne_de_vie" },
  { key: "filetRetention", labelKey: "filet_retention" },
];

// Annexe 4 : bloc "Signature" (remplace l'intitulé "Avis" du document de
// référence, §12) — 3 rôles fixes, jamais de donnée chantier, sur le même
// principe que RAPPEL_ACCIDENT_KEYS/APPEL_SECOURS_KEYS (lib/rappelAccident.js).
const ANNEXE4_SIGNATAIRES = ["role_operations_manager", "role_project_manager", "role_cp_niv1_sippt"];

function SignatureRow({ label }) {
  return (
    <View style={styles.signatureRow}>
      <Text style={styles.signatureRole}>{label}</Text>
      <View style={styles.signatureBox} />
    </View>
  );
}

function Bullets({ items }) {
  const present = items.filter((i) => i.value);
  if (present.length === 0) return null;
  return (
    <View>
      {present.map((i) => (
        <View key={i.label} style={styles.bullet}>
          <Text style={styles.bulletDot}>•</Text>
          <Text>{i.label}</Text>
        </View>
      ))}
    </View>
  );
}

function Table({ columns, rows }) {
  if (!rows?.length) return null;
  return (
    <View>
      <View style={styles.tableHeader}>
        {columns.map((c) => (
          <Text key={c.key} style={[styles.th, { flex: c.flex || 1 }]}>
            {c.label}
          </Text>
        ))}
      </View>
      {rows.map((r, i) => (
        <View key={i} style={styles.tableRow}>
          {columns.map((c) => (
            <Text key={c.key} style={[styles.td, { flex: c.flex || 1 }]}>
              {r[c.key] || "-"}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function titreReglesGenerales(t, entreprise) {
  return t("titre_regles_generales_entreprise").replace(/\[.*?\]/, entreprise?.identite?.nomAffichage || "");
}

// Annexe 4 : texte légal traduit dans entreprise.json (texte/texte_en/texte_nl,
// RePSS_Entreprise_Reference.xlsx > Annexe4_Statut) — replie sur le français si la
// traduction manque, plutôt que d'afficher un bloc vide.
function texteReglesGeneralesAnnexe4(lang, entreprise) {
  const annexe4 = entreprise?.reglesGeneralesAnnexe4 || {};
  const parLangue = { en: annexe4.texte_en, nl: annexe4.texte_nl };
  return parLangue[lang] || annexe4.texte;
}

function ContactCardPdf({ c, logoSrc }) {
  if (!c) return null;
  return (
    <View style={styles.contactCard}>
      {c.logo && <Image src={logoSrc(c.logo)} style={styles.contactLogo} />}
      <Text style={{ fontWeight: 700 }}>{c.nom}</Text>
      {c.adresse ? <Text>{c.adresse}</Text> : null}
      {(c.tel || c.email) && (
        <Text>{[c.tel, c.email].filter(Boolean).join(" · ")}</Text>
      )}
      {c.site_web ? <Text>{c.site_web}</Text> : null}
    </View>
  );
}

// ============================================================
// Page 1 — Couverture
// ============================================================
function CouverturePage({ dossier, entreprise, t, logoAbsoluteUrl, photoCouvertureAbsoluteUrl }) {
  const { identification, meta, triage } = dossier;
  const isAbrege = triage.modeChoisi === "abrege";
  return (
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.coverContent}>
        {logoAbsoluteUrl && <Image src={logoAbsoluteUrl} style={styles.coverLogo} />}
        <Text style={styles.coverTitle}>{t("reponse_au_pss")}</Text>
        <Text style={styles.coverModeLabel}>{isAbrege ? t("repss_abrege_label") : t("repss_complet_label")}</Text>

        <View style={styles.coverBox}>
          <Text style={styles.coverBoxLabel}>{t("identification_numero_chantier")}</Text>
          <Text style={styles.coverBoxValue}>{identification.numeroChantier || "-"}</Text>
        </View>
        <View style={[styles.coverBox, { marginTop: 10 }]}>
          <Text style={styles.coverBoxLabel}>{t("nom_chantier")}</Text>
          <Text style={styles.coverBoxValue}>{identification.nomChantier || "-"}</Text>
        </View>

        {photoCouvertureAbsoluteUrl && <Image src={photoCouvertureAbsoluteUrl} style={styles.coverPhoto} />}

        <View style={styles.coverSpacer} />

        <View style={styles.coverMetaRow}>
          <Text style={styles.coverMetaItem}>{meta.dateDerniereModif}</Text>
          {meta.repssNumero && <Text style={styles.coverMetaItem}>{meta.repssNumero}</Text>}
          <Text style={styles.coverMetaItem}>{entreprise?.identite?.nomAffichage}</Text>
        </View>
      </View>
    </Page>
  );
}

// ============================================================
// Page 2 — Page d'explication
// ============================================================
function ExplicationBloc({ titre, texte }) {
  return (
    <View style={styles.explicationBloc}>
      <Text style={styles.explicationBlocTitre}>{titre}</Text>
      <Text style={styles.explicationBlocTexte}>{texte}</Text>
    </View>
  );
}

function ExplicationPage({ t, logoAbsoluteUrl }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.explicationContent}>
        <Text style={styles.title}>{t("page_explication_titre")}</Text>

        <ExplicationBloc titre={t("explication_bloc1_titre")} texte={t("page_explication_texte")} />
        <ExplicationBloc titre={t("explication_bloc2_titre")} texte={t("explication_bloc2_texte")} />
        <ExplicationBloc titre={t("explication_bloc3_titre")} texte={t("explication_bloc3_texte")} />

        <View style={styles.explicationSpacer} />
        {logoAbsoluteUrl && <Image src={logoAbsoluteUrl} style={styles.explicationLogo} />}
      </View>
      <PageFooter t={t} />
    </Page>
  );
}

// ============================================================
// Page 3 — Table des matières
// ============================================================
// Note technique : react-pdf ne permet pas de connaître à l'avance le numéro de
// page final d'une section dont la longueur dépend du contenu du dossier (ex.
// l'analyse de risques peut faire 1 page comme 6) sans un rendu en deux passes.
// Cette table des matières liste donc les sections dans l'ordre, sans numéro de
// page — à améliorer dans une itération dédiée si un vrai renvoi de page est requis.
function TableMatieresPage({ t, isAbrege, entreprise }) {
  const entries = isAbrege
    ? [t("titre_infos_chantier_usine"), t("analyse_titre_abrege"), t("emargement_label"), titreReglesGenerales(t, entreprise)]
    : [
        t("titre_rens_gen"),
        t("titre_adm_chantier"),
        t("titre_carac_chantier"),
        t("titre_regles_speciales"),
        `${t("annexe_label")} 1 — ${t("annexe1_legende_kinney_titre")}`,
        t("titre_analyse_risques_chantier"),
        t("emargement_label"),
        `${t("annexe_label")} 2 — ${t("titre_plan_particulier")}`,
        `${t("annexe_label")} 3 — ${t("titre_liste_engins_speciaux")}`,
        `${t("annexe_label")} 4 — ${titreReglesGenerales(t, entreprise)}`,
      ];
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{t("table_matieres_titre")}</Text>
      <View style={{ marginTop: 18 }}>
        {entries.map((label, i) => (
          <View key={i} style={styles.tocEntry}>
            <Text style={styles.tocIndexBadge}>{i + 1}.</Text>
            <Text style={styles.tocLabel}>{label}</Text>
            <View style={styles.tocDots} />
          </View>
        ))}
      </View>
      <PageFooter t={t} />
    </Page>
  );
}

// ============================================================
// Annexe 1 — Légende Kinney
// ============================================================
function KinneyGrid({ title, rows }) {
  return (
    <View style={styles.kinneyGrid}>
      <Text style={styles.kinneyGridTitle}>{title}</Text>
      {rows.map((r) => (
        <View key={r.texte} style={styles.kinneyGridRow}>
          <Text style={styles.kinneyGridValeur}>{formatNombre(r.valeur)}</Text>
          <Text style={{ flex: 1 }}>{r.texte}</Text>
        </View>
      ))}
    </View>
  );
}

const NIVEAUX_LEGENDE = [
  { code: "acceptable", labelKey: "niveau_acceptable" },
  { code: "attention", labelKey: "niveau_attention" },
  { code: "correction", labelKey: "niveau_correction" },
  { code: "immediate", labelKey: "niveau_immediate" },
  { code: "arret", labelKey: "niveau_arret" },
];

function Annexe1KinneyPage({ catalogue, t }) {
  const legende = legendeKinney(catalogue, t);
  return (
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.title}>
        {t("annexe_label")} 1 — {t("annexe1_legende_kinney_titre")}
      </Text>
      <Text style={{ marginTop: 10, color: colors.neutralText, lineHeight: 1.4 }}>{t("kinney_legende_intro")}</Text>
      <Text style={styles.kinneyFormule}>{t("kinney_formule")}</Text>

      <View style={styles.kinneyGrids}>
        <KinneyGrid title={t("kinney_probabilite")} rows={legende.probabilite} />
        <KinneyGrid title={t("kinney_exposition")} rows={legende.exposition} />
        <KinneyGrid title={t("kinney_gravite")} rows={legende.gravite} />
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.kinneyGridTitle}>{t("niveau_risque_label")}</Text>
        {NIVEAUX_LEGENDE.map((n) => {
          const c = couleurNiveau(n.code);
          return (
            <View key={n.code} style={styles.kinneyNiveauRow}>
              <View style={[styles.kinneyNiveauSwatch, { backgroundColor: c.bg }]} />
              <Text>{t(n.labelKey)}</Text>
            </View>
          );
        })}
      </View>
      <PageFooter t={t} />
    </Page>
  );
}

// ============================================================
// Analyse de risques — vrai tableau paysage (§12, le plus urgent)
// ============================================================

// La hiérarchie n'a pas une profondeur fixe (§6) : à chaque niveau on résout
// d'abord des sous-catégories, sinon des activités, sinon des lignes de risque
// directement rattachées. Construit une liste plate de "lignes de tableau"
// (bandeaux de titre + lignes de données) dans l'ordre d'affichage.
function construireLignesTableau(catalogue, corpsMetier, cochesById) {
  const lignes = [];

  function pousserActivitesOuRisques(parentId) {
    const acts = catalogue.activites.filter((a) => a.parent === parentId);
    if (acts.length > 0) {
      for (const act of acts) {
        lignes.push({ type: "activite", label: act.fr });
        const risques = catalogue.lignesRisque.filter((r) => r.parent === act.id && cochesById[r.id]);
        for (const r of risques) lignes.push({ type: "risque", ligne: r, coche: cochesById[r.id] });
      }
      return;
    }
    const risquesDirects = catalogue.lignesRisque.filter((r) => r.parent === parentId && cochesById[r.id]);
    for (const r of risquesDirects) lignes.push({ type: "risque", ligne: r, coche: cochesById[r.id] });
  }

  const visibleCats = catalogue.categories.filter((c) => c.corps_metier === "universel" || corpsMetier.includes(c.corps_metier));
  for (const cat of visibleCats) {
    lignes.push({ type: "categorie", label: cat.fr });
    const subs = catalogue.sousCategories.filter((s) => s.parent === cat.id);
    if (subs.length > 0) {
      for (const sub of subs) {
        lignes.push({ type: "sousCategorie", label: sub.fr });
        pousserActivitesOuRisques(sub.id);
      }
    } else {
      pousserActivitesOuRisques(cat.id);
    }
  }
  return lignes;
}

function EvalCell({ score, niveauCode, width }) {
  const c = couleurNiveau(niveauCode);
  return (
    <View style={{ width: `${width}%` }}>
      <View style={[styles.rtEvalCell, { backgroundColor: c.bg }]}>
        <Text style={{ color: c.texte }}>{formatNombre(score)}</Text>
      </View>
    </View>
  );
}

function RisqueDataRow({ ref: refNum, ligne, remarques, t }) {
  return (
    <View style={styles.rtRow} wrap={false}>
      <Text style={[styles.rtCell, { width: `${RT_COLS.ref}%` }]}>{refNum}</Text>
      <Text style={[styles.rtCell, { width: `${RT_COLS.sourceDanger}%` }]}>{ligne.sourceDanger}</Text>
      <View style={{ width: `${RT_COLS.risques}%` }}>
        <Text style={styles.rtCell}>{ligne.risques}</Text>
        {remarques ? (
          <Text style={[styles.rtCell, { color: colors.neutralText, fontStyle: "italic" }]}>
            {t("remarques_descriptifs")} {remarques}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.rtCell, { width: `${RT_COLS.p}%`, textAlign: "center" }]}>{formatNombre(ligne.evaluationInitiale.probabilite.valeur)}</Text>
      <Text style={[styles.rtCell, { width: `${RT_COLS.e}%`, textAlign: "center" }]}>{formatNombre(ligne.evaluationInitiale.exposition.valeur)}</Text>
      <Text style={[styles.rtCell, { width: `${RT_COLS.g}%`, textAlign: "center" }]}>{formatNombre(ligne.evaluationInitiale.gravite.valeur)}</Text>
      <EvalCell score={ligne.evaluationInitiale.score} niveauCode={ligne.evaluationInitiale.niveauCode} width={RT_COLS.eval} />
      <Text style={[styles.rtCell, { width: `${RT_COLS.mesures}%` }]}>{ligne.mesuresPrevention}</Text>
      <Text style={[styles.rtCell, { width: `${RT_COLS.pRes}%`, textAlign: "center" }]}>{formatNombre(ligne.evaluationResiduelle.probabilite.valeur)}</Text>
      <Text style={[styles.rtCell, { width: `${RT_COLS.eRes}%`, textAlign: "center" }]}>{formatNombre(ligne.evaluationResiduelle.exposition.valeur)}</Text>
      <Text style={[styles.rtCell, { width: `${RT_COLS.gRes}%`, textAlign: "center" }]}>{formatNombre(ligne.evaluationResiduelle.gravite.valeur)}</Text>
      <EvalCell score={ligne.evaluationResiduelle.score} niveauCode={ligne.evaluationResiduelle.niveauCode} width={RT_COLS.evalRes} />
    </View>
  );
}

function AnalyseRisquesTablePage({ catalogue, corpsMetier, itemsCoches, t }) {
  const cochesById = Object.fromEntries(itemsCoches.map((i) => [i.risqueId, i]));
  const lignes = construireLignesTableau(catalogue, corpsMetier, cochesById);
  let refCounter = 0;

  return (
    <Page size="A4" orientation="landscape" style={styles.pageLandscape} wrap>
      <Text style={{ fontSize: 12, fontWeight: 700, color: colors.navy, marginBottom: 8 }}>
        {t("titre_analyse_risques_chantier")}
      </Text>

      <View fixed>
        <View style={styles.rtHeaderGroup}>
          <Text style={{ width: `${RT_COLS.ref + RT_COLS.sourceDanger + RT_COLS.risques}%` }} />
          <Text style={[styles.rtHeaderCellGroup, { width: `${RT_COLS.p + RT_COLS.e + RT_COLS.g + RT_COLS.eval}%` }]}>
            {t("evaluation_initiale_label")}
          </Text>
          <Text style={{ width: `${RT_COLS.mesures}%` }} />
          <Text style={[styles.rtHeaderCellGroup, { width: `${RT_COLS.pRes + RT_COLS.eRes + RT_COLS.gRes + RT_COLS.evalRes}%` }]}>
            {t("evaluation_residuelle_label")}
          </Text>
        </View>
        <View style={styles.rtHeaderSub}>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.ref}%` }]}>{t("risque_col_ref")}</Text>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.sourceDanger}%` }]}>{t("risque_col_source_danger")}</Text>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.risques}%` }]}>{t("risque_col_risques")}</Text>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.p}%` }]}>{t("kinney_probabilite")}</Text>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.e}%` }]}>{t("kinney_exposition")}</Text>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.g}%` }]}>{t("kinney_gravite")}</Text>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.eval}%` }]}>{t("evaluation_label")}</Text>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.mesures}%` }]}>{t("mesures_prevention_label")}</Text>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.pRes}%` }]}>{t("kinney_probabilite")}</Text>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.eRes}%` }]}>{t("kinney_exposition")}</Text>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.gRes}%` }]}>{t("kinney_gravite")}</Text>
          <Text style={[styles.rtHeaderCell, { width: `${RT_COLS.evalRes}%` }]}>{t("evaluation_label")}</Text>
        </View>
      </View>

      {lignes.map((l, i) => {
        if (l.type === "categorie") {
          return (
            <View key={i} style={[styles.rtBanner, styles.rtBannerCategorie]} wrap={false}>
              <Text style={styles.rtBannerCategorieText}>{l.label}</Text>
            </View>
          );
        }
        if (l.type === "sousCategorie") {
          return (
            <View key={i} style={[styles.rtBanner, styles.rtBannerSousCategorie]} wrap={false}>
              <Text style={styles.rtBannerSousCategorieText}>{l.label}</Text>
            </View>
          );
        }
        if (l.type === "activite") {
          return (
            <View key={i} style={[styles.rtBanner, styles.rtBannerActivite]} wrap={false}>
              <Text style={styles.rtBannerActiviteText}>{l.label}</Text>
            </View>
          );
        }
        refCounter += 1;
        return <RisqueDataRow key={l.ligne.id} ref={refCounter} ligne={l.ligne} remarques={l.coche.remarques} t={t} />;
      })}

      <PageFooter t={t} />
    </Page>
  );
}

// ============================================================
// Analyse de risques — format abrégé (pas de Kinney, §5)
// ============================================================
function AnalyseRisquesAbregePage({ catalogue, itemsCoches, t }) {
  const cochesById = Object.fromEntries(itemsCoches.map((i) => [i.risqueId, i]));
  return (
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.title}>{t("analyse_titre_abrege")}</Text>
      <View style={{ marginTop: 10 }}>
        {catalogue.categories.map((cat) => {
          const items = catalogue.risques.filter((r) => r.categorieId === cat.id && cochesById[r.id]);
          if (items.length === 0) return null;
          return (
            <View key={cat.id} wrap={false}>
              <Text style={styles.subTitle}>{cat.fr}</Text>
              {items.map((r) => (
                <View key={r.id} style={styles.ligneRisque}>
                  <Text style={{ fontWeight: 500 }}>{r.sourceDanger}</Text>
                  <Text>{r.mesure}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>
      <PageFooter t={t} />
    </Page>
  );
}

// ============================================================
// Émargement
// ============================================================
function EmargementPage({ t }) {
  const lignesVides = Array.from({ length: 18 });
  return (
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.title}>{t("emargement_label")}</Text>
      <View style={{ marginTop: 14 }}>
        <View style={[styles.emargeRow, { borderBottom: `1pt solid ${colors.navy}` }]}>
          <Text style={[styles.emargeHeaderCell, { width: "22%" }]}>{t("tbl_nom")}</Text>
          <Text style={[styles.emargeHeaderCell, { width: "18%" }]}>{t("prenom")}</Text>
          <Text style={[styles.emargeHeaderCell, { width: "26%" }]}>{t("entreprise")}</Text>
          <Text style={[styles.emargeHeaderCell, { width: "14%" }]}>{t("date")}</Text>
          <Text style={[styles.emargeHeaderCell, { width: "20%" }]}>{t("signature")}</Text>
        </View>
        {lignesVides.map((_, i) => (
          <View key={i} style={styles.emargeRow}>
            <Text style={[styles.emargeCell, { width: "22%" }]} />
            <Text style={[styles.emargeCell, { width: "18%" }]} />
            <Text style={[styles.emargeCell, { width: "26%" }]} />
            <Text style={[styles.emargeCell, { width: "14%" }]} />
            <Text style={[styles.emargeCell, { width: "20%" }]} />
          </View>
        ))}
      </View>
      <PageFooter t={t} />
    </Page>
  );
}

// ============================================================
// Document principal
// ============================================================
export default function RepssDocument({ dossier, entreprise, catalogueComplet, catalogueAbrege, hopitaux, t, lang, logoAbsoluteUrl, logosBaseUrl, photoCouvertureAbsoluteUrl }) {
  const {
    identification,
    renseignementsGeneraux: rg,
    administratif: adm,
    triage,
    caracterisation,
    caracteristiques,
    reglesSpecifiques: rs,
    documentsAccompagnants: da,
    infosChantierUsine: icu,
    historiqueVersions,
  } = dossier;
  const isAbrege = triage.modeChoisi === "abrege";

  const hopitauxSelectionnes = rs.hopitalPlusProcheIds.map((id) => hopitaux.find((h) => h.id === id)).filter(Boolean);
  const contacts = entreprise?.contactsReference || {};
  const icones = entreprise?.iconesUrgence || {};
  const logoSrc = (filename) => (filename ? `${logosBaseUrl}${filename}` : null);

  const responsablesFixes = entreprise?.rolesApprobation?.fixes || [];
  const responsablesVariables = ROLES_ADMINISTRATION.map((role) => {
    const saved = adm.responsables?.[role];
    const contact = typeof saved === "string" ? { nom: saved } : (saved || {});
    return { fonction: t(role), nom: contact.nom, email: contact.email, tel: contact.gsm };
  }).filter((contact) => contact.nom || contact.email || contact.tel);

  return (
    <Document>
      <CouverturePage
        dossier={dossier}
        entreprise={entreprise}
        t={t}
        logoAbsoluteUrl={logoAbsoluteUrl}
        photoCouvertureAbsoluteUrl={photoCouvertureAbsoluteUrl}
      />
      <ExplicationPage t={t} logoAbsoluteUrl={logoAbsoluteUrl} />
      <TableMatieresPage t={t} isAbrege={isAbrege} entreprise={entreprise} />

      <Page size="A4" style={styles.page} wrap>
        {!isAbrege && (
          <Section title={t("titre_rens_gen")} boxed>
            <KV label={t("client")} value={rg.client} />
            <KV label={t("bureau_architecture")} value={rg.bureauArchitecture} />
            <KV label={t("coordinateur_securite")} value={rg.coordinateurSecurite} />
            <KV label={t("adresse_chantier")} value={formatAdresseChantier(rg)} />

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>{t("contacts_reference_titre")}</Text>
            <View style={styles.logosRow}>
              {Object.entries(contacts)
                .filter(([key]) => !["controleTechnique", "dgBienEtre"].includes(key))
                .map(([key, c]) => (
                  <ContactCardPdf key={key} c={c} logoSrc={logoSrc} />
                ))}
              {Object.entries(contacts.controleTechnique || {}).map(([key, c]) => (
                <ContactCardPdf key={key} c={c} logoSrc={logoSrc} />
              ))}
              {Object.entries(contacts.dgBienEtre || {}).map(([key, c]) => (
                <ContactCardPdf key={key} c={c} logoSrc={logoSrc} />
              ))}
            </View>
          </Section>
        )}

        {!isAbrege && (
          <Section title={t("titre_adm_chantier")} boxed>
            <KV label={t("date_debut_travaux")} value={adm.dateDebutTravaux} />
            <KV label={t("date_fin_travaux")} value={adm.dateFinTravauxEstimee} />

            <Text style={{ fontWeight: 700, marginTop: 6, marginBottom: 3 }}>{t("resp_approbation")}</Text>
            <Table
              columns={[
                { key: "fonction", label: t("fonction"), flex: 2 },
                { key: "nom", label: t("tbl_nom"), flex: 1.5 },
                { key: "email", label: t("tbl_email"), flex: 1.5 },
                { key: "tel", label: t("tbl_tel"), flex: 1 },
              ]}
              rows={[
                ...responsablesFixes.map((r) => ({ fonction: r.fonction, nom: r.nom, email: r.email, tel: r.tel })),
                ...responsablesVariables,
              ]}
            />

            {historiqueVersions?.length > 0 && (
              <>
                <Text style={{ fontWeight: 700, marginTop: 8, marginBottom: 3 }}>{t("label_version")}</Text>
                <Table
                  columns={[
                    { key: "version", label: t("label_version"), flex: 1 },
                    { key: "date", label: t("date"), flex: 1 },
                    { key: "motif", label: t("motif_nouvelle_version"), flex: 3 },
                  ]}
                  rows={historiqueVersions}
                />
              </>
            )}

            <Text style={{ fontWeight: 700, marginTop: 8, marginBottom: 3 }}>{t("titre_liste_sous_traitants")}</Text>
            {da.sousTraitants?.length > 0 ? (
              <Table
                columns={[
                  { key: "societe", label: t("societe") },
                  { key: "natureTravaux", label: t("nature_travaux"), flex: 2 },
                  { key: "responsable", label: t("responsable") },
                ]}
                rows={da.sousTraitants}
              />
            ) : (
              <Text>{t("neant")}</Text>
            )}
          </Section>
        )}

        {!isAbrege && (
          <Section title={t("titre_carac_chantier")} boxed>
            <Bullets
              items={[
                { label: t("carac_chantier_plan_installation"), value: true },
                { label: t("carac_chantier_point_rassemblement"), value: true },
              ]}
            />
            <View style={{ marginTop: 8 }}>
              {CARACTERISTIQUES_FIELDS.map((f) => (
                <TriStateBoxRow key={f.key} label={t(f.labelKey)} value={caracteristiques[f.key]} t={t} />
              ))}
            </View>
            <KV label={t("particularites_acces")} value={caracteristiques.particularitesAcces || "/"} />
          </Section>
        )}

        {isAbrege && (
          <Section title={t("titre_infos_chantier_usine")} boxed>
            <Bullets
              items={[
                { label: t("site_seveso"), value: icu.seveso },
                { label: t("coactivite"), value: icu.coactivite },
                { label: t("accueil_securite_requis"), value: icu.accueilSecurite },
                { label: t("presence_gaz"), value: icu.presenceGaz },
                { label: t("permis_feu"), value: icu.permisFeu },
                { label: t("permis_travail"), value: icu.permisTravail },
              ]}
            />
            <KV label={t("matieres_premieres_dangereuses")} value={icu.matieresPremierresDangereuses} />
            <KV label={t("pressions_temperatures")} value={icu.pressionsTemperatures} />
            <TriStateRow label={t("refectoire")} value={icu.locauxSociaux.refectoire} t={t} />
            <TriStateRow label={t("sanitaires")} value={icu.locauxSociaux.sanitaires} t={t} />
            <TriStateRow label={t("vestiaires")} value={icu.locauxSociaux.vestiaires} t={t} />
            <TriStateRow label={t("douches")} value={icu.locauxSociaux.douches} t={t} />
          </Section>
        )}

        {!isAbrege && (
          <Section title={t("titre_regles_speciales")} boxed>
            <Text style={{ fontWeight: 700, marginBottom: 3 }}>{t("titre_rappel_accident")}</Text>
            <Bullets items={RAPPEL_ACCIDENT_KEYS.map((k) => ({ label: t(k), value: true }))} />

            <Text style={{ fontWeight: 700, marginTop: 8, marginBottom: 3 }}>{t("titre_appel_secours")}</Text>
            <Bullets items={APPEL_SECOURS_KEYS.map((k) => ({ label: t(k), value: true }))} />

            <View style={[styles.logosRow, { marginTop: 8 }]}>
              <View style={styles.contactCardUrgence}>
                {icones.pompier?.logo && <Image src={logoSrc(icones.pompier.logo)} style={styles.contactLogoUrgence} />}
                <Text style={{ fontWeight: 700 }}>{t("service_incendie")}</Text>
                <Text>112</Text>
                {rs.serviceIncendieInterne && <Text>{rs.serviceIncendieInterne}</Text>}
              </View>
              <View style={styles.contactCardUrgence}>
                {icones.antipoison?.logo && <Image src={logoSrc(icones.antipoison.logo)} style={styles.contactLogoUrgence} />}
                <Text style={{ fontWeight: 700 }}>{t("centre_antipoison_label")}</Text>
                <Text>070/245.245</Text>
              </View>
              <View style={styles.contactCardUrgence}>
                {icones.police?.logo && <Image src={logoSrc(icones.police.logo)} style={styles.contactLogoUrgence} />}
                <Text style={{ fontWeight: 700 }}>{t("police_label")}</Text>
                <Text>{contacts.police?.tel || "101"}</Text>
                {contacts.police?.site_web && <Text>{contacts.police.site_web}</Text>}
              </View>
              {hopitauxSelectionnes.map((h) => (
                <View key={h.id} style={styles.contactCardUrgence}>
                  {icones.hopital?.logo && <Image src={logoSrc(icones.hopital.logo)} style={styles.contactLogoUrgence} />}
                  <Text style={{ fontWeight: 700 }}>{t("hopital_plus_proche")}</Text>
                  <Text>
                    {h.nom_hopital}
                    {h.nom_site ? ` (${h.nom_site})` : ""}
                  </Text>
                  <Text>
                    {h.adresse}, {h.code_postal} {h.commune}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>{t("titre_derogations_pss")}</Text>
            {rs.derogations.neant ? (
              <Text>{t("neant")}</Text>
            ) : (
              <Table
                columns={[
                  { key: "objet", label: t("objet") },
                  { key: "zoneApplication", label: t("zone_application") },
                  { key: "motivationRaison", label: t("motivation_raison"), flex: 2 },
                  { key: "autorisationDonneePar", label: t("autorisation_donnee_par") },
                ]}
                rows={rs.derogations.items}
              />
            )}
          </Section>
        )}

        {dossier.demandesMoadr.length > 0 && (
          <Section title={t("moadr_section_titre_pdf")} boxed>
            {dossier.demandesMoadr.map((m) => (
              <View key={m.id} style={{ marginBottom: 4 }}>
                <Text>{m.descriptionSituation}</Text>
                <Text style={{ color: colors.neutralText }}>{m.mentionDocument}</Text>
              </View>
            ))}
          </Section>
        )}
        <PageFooter t={t} />
      </Page>

      {!isAbrege && <Annexe1KinneyPage catalogue={catalogueComplet} t={t} />}

      {isAbrege ? (
        <AnalyseRisquesAbregePage catalogue={catalogueAbrege} itemsCoches={dossier.analyseRisques.itemsCoches} t={t} />
      ) : (
        <AnalyseRisquesTablePage
          catalogue={catalogueComplet}
          corpsMetier={caracterisation.corpsMetier}
          itemsCoches={dossier.analyseRisques.itemsCoches}
          t={t}
        />
      )}

      <EmargementPage t={t} />

      {!isAbrege && (da.planParticulier.notes || da.planParticulier.fichier || da.listeEnginsSpeciaux.length > 0) && (
        <Page size="A4" style={styles.page} wrap>
          <Section title={`${t("annexe_label")} 2 — ${t("titre_plan_particulier")}`} boxed>
            <KV label={t("fichier_joint")} value={da.planParticulier.fichier} />
            <Text>{da.planParticulier.notes}</Text>
          </Section>
          {da.listeEnginsSpeciaux.length > 0 && (
            <Section title={`${t("annexe_label")} 3 — ${t("titre_liste_engins_speciaux")}`} boxed>
              <Table
                columns={[
                  { key: "typeEngin", label: t("type_engin") },
                  { key: "phase", label: t("phase") },
                  { key: "nombre", label: t("nombre") },
                ]}
                rows={da.listeEnginsSpeciaux}
              />
            </Section>
          )}
          <PageFooter t={t} />
        </Page>
      )}

      <Page size="A4" style={styles.page} wrap>
        <Section title={`${t("annexe_label")} 4 — ${titreReglesGenerales(t, entreprise)}`} boxed>
          <Text style={{ lineHeight: 1.4 }}>{texteReglesGeneralesAnnexe4(lang, entreprise)}</Text>
        </Section>
        <Section title={t("annexe4_signature_titre")} boxed>
          {/* Nom + n° de chantier rappelés ici (anti-fraude) : cette feuille signée
              ne doit pas pouvoir être réutilisée telle quelle pour un autre chantier. */}
          <Text style={styles.signatureChantier}>
            {t("identification_numero_chantier")} {identification.numeroChantier || "-"} — {identification.nomChantier || "-"}
          </Text>
          {ANNEXE4_SIGNATAIRES.map((key) => (
            <SignatureRow key={key} label={t(key)} />
          ))}
        </Section>
        <PageFooter t={t} />
      </Page>
    </Document>
  );
}
