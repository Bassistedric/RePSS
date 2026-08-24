import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors } from "../../lib/colors";
import { couleurNiveau, niveauDepuisScore, formatNombre } from "../../lib/kinney";

// Document MOADR (§13) : plus court que le RePSS (pas de couverture/TOC séparées,
// pas de branche complet/abrégé), mais même langage visuel — bandeaux de titre
// bleu marine, sections encadrées, tableau réel pour l'analyse de risques.
// Feuille de styles volontairement autonome (pas de partage avec RepssDocument.jsx) :
// éviter de toucher au PDF RePSS déjà en production pour un document plus petit et
// structurellement différent (pas de branche complet/abrégé à gérer ici).
const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 9, fontFamily: "Helvetica", color: colors.neutralTextStrong },
  pageLandscape: { padding: 24, fontSize: 8, fontFamily: "Helvetica", color: colors.neutralTextStrong },
  footer: { position: "absolute", bottom: 14, left: 32, right: 32, fontSize: 7, color: colors.neutralText, textAlign: "center" },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  logo: { height: 34, objectFit: "contain" },
  title: { fontSize: 20, fontWeight: 700, color: colors.navy },
  subtitle: { fontSize: 10, color: colors.neutralText, marginTop: 2 },
  refBox: { alignItems: "flex-end" },
  refLabel: { fontSize: 8, color: colors.neutralText, textTransform: "uppercase", letterSpacing: 0.5 },
  refValue: { fontSize: 12, fontWeight: 700, color: colors.navy, marginTop: 2 },

  banner: { backgroundColor: colors.navy, paddingVertical: 4, paddingHorizontal: 6, marginTop: 12, marginBottom: 6 },
  bannerText: { color: "white", fontSize: 9.5, fontWeight: 700 },

  row: { flexDirection: "row", marginBottom: 3 },
  kvKey: { width: 160, color: colors.neutralText },
  kvVal: { flex: 1, fontWeight: 500 },

  boxed: { padding: 12, borderRadius: 4, border: `1pt solid ${colors.neutralBorder}`, backgroundColor: colors.neutralBgSubtle, marginBottom: 4 },

  tableHeader: { flexDirection: "row", borderBottom: `1pt solid ${colors.navy}`, paddingBottom: 3, marginBottom: 3 },
  tableRow: { flexDirection: "row", borderBottom: `0.5pt solid ${colors.neutralBorder}`, paddingVertical: 3 },
  th: { fontWeight: 700, fontSize: 7 },
  td: { fontSize: 7 },
  evalCell: { fontSize: 7, fontWeight: 700, textAlign: "center", paddingVertical: 2, borderRadius: 2 },

  signatureRow: { flexDirection: "row", justifyContent: "space-between", borderBottom: `0.5pt solid ${colors.neutralBorder}`, paddingVertical: 10 },
  signatureRole: { fontSize: 9, fontWeight: 500 },
  signatureBox: { width: 200, height: 40, border: `0.75pt solid ${colors.neutralBorderStrong}` },
});

function PageFooter({ t }) {
  return <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) => `${t("page")} ${pageNumber} / ${totalPages}`} />;
}

function Banner({ label }) {
  return (
    <View style={styles.banner} wrap={false}>
      <Text style={styles.bannerText}>{label}</Text>
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

const RT_COLS = { ref: 4, tache: 13, danger: 13, situation: 13, mesures: 15, p: 5, e: 5, g: 5, score: 8, niveau: 12, pRes: 5, eRes: 5, gRes: 5 };

function EvalCell({ score, niveauCode, width }) {
  const c = couleurNiveau(niveauCode);
  return (
    <View style={{ width: `${width}%`, paddingHorizontal: 1 }}>
      <View style={[styles.evalCell, { backgroundColor: c.bg }]}>
        <Text style={{ color: c.texte }}>{formatNombre(score)}</Text>
      </View>
    </View>
  );
}

function niveauLabel(t, code) {
  const KEYS = { acceptable: "niveau_acceptable", attention: "niveau_attention", correction: "niveau_correction", immediate: "niveau_immediate", arret: "niveau_arret" };
  return t(KEYS[code] || code);
}

// Tableau réel de la section 5.2 (§12 : même principe que l'analyse de risques du
// RePSS, orientation paysage), construit ligne par ligne — pas de catalogue, pas de
// bandeaux de catégorie ici (chaque ligne du MOADR est indépendante).
function AnalyseRisquesPage({ moadr, t }) {
  const lignes = moadr.analyseRisques.lignes;
  return (
    <Page size="A4" orientation="landscape" style={styles.pageLandscape} wrap>
      <Text style={{ fontSize: 12, fontWeight: 700, color: colors.navy, marginBottom: 8 }}>{t("moadr_s5_2_titre")}</Text>
      <View fixed>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { width: `${RT_COLS.ref}%` }]}>{t("moadr_ref_ligne")}</Text>
          <Text style={[styles.th, { width: `${RT_COLS.tache}%` }]}>{t("moadr_ligne_tache")}</Text>
          <Text style={[styles.th, { width: `${RT_COLS.danger}%` }]}>{t("moadr_ligne_danger")}</Text>
          <Text style={[styles.th, { width: `${RT_COLS.situation}%` }]}>{t("moadr_ligne_situation")}</Text>
          <Text style={[styles.th, { width: `${RT_COLS.mesures}%` }]}>{t("moadr_ligne_mesures_existantes")}</Text>
          <Text style={[styles.th, { width: `${RT_COLS.p}%`, textAlign: "center" }]}>P</Text>
          <Text style={[styles.th, { width: `${RT_COLS.e}%`, textAlign: "center" }]}>E</Text>
          <Text style={[styles.th, { width: `${RT_COLS.g}%`, textAlign: "center" }]}>G</Text>
          <Text style={[styles.th, { width: `${RT_COLS.score}%`, textAlign: "center" }]}>R</Text>
          <Text style={[styles.th, { width: `${RT_COLS.niveau}%`, textAlign: "center" }]}>{t("niveau_risque_label")}</Text>
        </View>
      </View>
      {lignes.length === 0 && <Text style={{ color: colors.neutralText, marginTop: 6 }}>{t("moadr_aucune_ligne")}</Text>}
      {lignes.map((l, i) => {
        const ini = { probabilite: parseFloat(l.initial.probabilite), exposition: parseFloat(l.initial.exposition), gravite: parseFloat(l.initial.gravite) };
        const scoreIni = ini.probabilite * ini.exposition * ini.gravite;
        const res = { probabilite: parseFloat(l.residuel.probabilite), exposition: parseFloat(l.residuel.exposition), gravite: parseFloat(l.residuel.gravite) };
        const scoreRes = res.probabilite * res.exposition * res.gravite;
        return (
          <View key={l.id}>
            <View style={styles.tableRow} wrap={false}>
              <Text style={[styles.td, { width: `${RT_COLS.ref}%` }]}>{i + 1}</Text>
              <Text style={[styles.td, { width: `${RT_COLS.tache}%` }]}>{l.tache}</Text>
              <Text style={[styles.td, { width: `${RT_COLS.danger}%` }]}>{l.danger}</Text>
              <Text style={[styles.td, { width: `${RT_COLS.situation}%` }]}>{l.situationDangereuse}</Text>
              <Text style={[styles.td, { width: `${RT_COLS.mesures}%` }]}>{l.mesuresExistantes}</Text>
              <Text style={[styles.td, { width: `${RT_COLS.p}%`, textAlign: "center" }]}>{formatNombre(ini.probabilite)}</Text>
              <Text style={[styles.td, { width: `${RT_COLS.e}%`, textAlign: "center" }]}>{formatNombre(ini.exposition)}</Text>
              <Text style={[styles.td, { width: `${RT_COLS.g}%`, textAlign: "center" }]}>{formatNombre(ini.gravite)}</Text>
              <EvalCell score={scoreIni} niveauCode={niveauDepuisScore(scoreIni)} width={RT_COLS.score} />
              <Text style={[styles.td, { width: `${RT_COLS.niveau}%`, textAlign: "center", fontWeight: 700 }]}>{niveauLabel(t, niveauDepuisScore(scoreIni))}</Text>
            </View>
            <View style={[styles.tableRow, { paddingTop: 0 }]} wrap={false}>
              <Text style={[styles.td, { width: `${RT_COLS.ref}%` }]} />
              <Text style={[styles.td, { width: `${RT_COLS.tache}%` }]} />
              <Text style={[styles.td, { width: `${RT_COLS.danger}%` }]} />
              <Text style={[styles.td, { width: `${RT_COLS.situation}%` }]} />
              <Text style={[styles.td, { width: `${RT_COLS.mesures}%`, color: colors.neutralText, fontStyle: "italic" }]}>{t("moadr_risque_residuel")}</Text>
              <Text style={[styles.td, { width: `${RT_COLS.p}%`, textAlign: "center" }]}>{formatNombre(res.probabilite)}</Text>
              <Text style={[styles.td, { width: `${RT_COLS.e}%`, textAlign: "center" }]}>{formatNombre(res.exposition)}</Text>
              <Text style={[styles.td, { width: `${RT_COLS.g}%`, textAlign: "center" }]}>{formatNombre(res.gravite)}</Text>
              <EvalCell score={scoreRes} niveauCode={niveauDepuisScore(scoreRes)} width={RT_COLS.score} />
              <Text style={[styles.td, { width: `${RT_COLS.niveau}%`, textAlign: "center", fontWeight: 700 }]}>{niveauLabel(t, niveauDepuisScore(scoreRes))}</Text>
            </View>
          </View>
        );
      })}
      <PageFooter t={t} />
    </Page>
  );
}

export default function MoadrDocument({ moadr, entreprise, t, logoAbsoluteUrl }) {
  const responsableSippt = entreprise?.rolesApprobation?.fixes?.find((r) => /SIPPT/i.test(r.fonction));

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          <View>
            {logoAbsoluteUrl && <Image src={logoAbsoluteUrl} style={styles.logo} />}
            <Text style={[styles.title, { marginTop: 8 }]}>{t("moadr_outil_titre")}</Text>
            <Text style={styles.subtitle}>{t("moadr_outil_sous_titre")}</Text>
          </View>
          {moadr.meta.reference && (
            <View style={styles.refBox}>
              <Text style={styles.refLabel}>{t("moadr_reference_attribuee")}</Text>
              <Text style={styles.refValue}>{moadr.meta.reference}</Text>
            </View>
          )}
        </View>

        {moadr.origine.repssNumeroChantier && (
          <View style={styles.boxed}>
            <KV label={t("moadr_lie_chantier")} value={`${moadr.origine.repssNumeroChantier} — ${moadr.origine.repssNomChantier}`} />
          </View>
        )}

        <Banner label={t("moadr_s1_titre")} />
        <KV label={t("moadr_projet")} value={moadr.objet.projet} />
        <KV label={t("moadr_lieu")} value={moadr.objet.lieu} />
        <KV label={t("moadr_date_debut")} value={moadr.objet.dateDebut} />
        <KV label={t("moadr_duree")} value={moadr.objet.duree} />
        <KV label={t("moadr_responsable_operation")} value={moadr.objet.responsableOperation} />

        <Banner label={t("moadr_s2_titre")} />
        <KV label={t("moadr_contexte")} value={moadr.intervention.contexte} />
        <KV label={t("moadr_etapes_principales")} value={moadr.intervention.etapesPrincipales} />

        <Banner label={t("moadr_s3_titre")} />
        <KV label={t("moadr_materiel")} value={moadr.equipement.materiel} />
        <KV label={t("moadr_outils")} value={moadr.equipement.outils} />
        <KV label={t("moadr_moyens_levage")} value={moadr.equipement.moyensLevage} />
        <KV label={t("moadr_epi_utilises")} value={moadr.equipement.epiUtilises} />

        <Banner label={t("moadr_s4_titre")} />
        <KV label={t("moadr_nombre_operateurs")} value={moadr.ressourcesHumaines.nombreOperateurs} />
        <KV label={t("moadr_qualification_operateurs")} value={moadr.ressourcesHumaines.qualificationOperateurs} />

        <Banner label={t("moadr_s5_titre")} />
        <Text style={{ marginBottom: 4 }}>{t("moadr_s5_1_texte")}</Text>
        <Text style={{ color: colors.neutralText, fontStyle: "italic" }}>{t("moadr_voir_tableau_page_suivante")}</Text>

        <Banner label={t("moadr_s6_titre")} />
        <KV label={t("moadr_epc")} value={moadr.mesuresPrevention.epc} />
        <KV label={t("moadr_epi_mesures")} value={moadr.mesuresPrevention.epi} />
        <KV label={t("moadr_zones_securite")} value={moadr.mesuresPrevention.zonesSecurite} />
        <KV label={t("moadr_controle_echafaudages")} value={moadr.mesuresPrevention.controleEchafaudages} />
        <KV label={t("moadr_formations")} value={moadr.mesuresPrevention.formations} />

        <Banner label={t("moadr_s7_titre")} />
        <KV label={t("moadr_plan_secours")} value={moadr.procedureSecours.planSecours} />
        <KV label={t("moadr_point_assemblage")} value={moadr.procedureSecours.pointAssemblage} />

        <Banner label={t("moadr_s8_titre")} />
        <KV label={t("moadr_controle_quotidien")} value={moadr.suiviControles.controleQuotidien} />
        <KV label={t("moadr_validation_installations")} value={moadr.suiviControles.validationInstallations} />

        <PageFooter t={t} />
      </Page>

      <AnalyseRisquesPage moadr={moadr} t={t} />

      <Page size="A4" style={styles.page} wrap>
        <Banner label={t("moadr_s9_titre")} />
        <View style={styles.signatureRow}>
          <Text style={styles.signatureRole}>{t("moadr_signature_responsable_operation")}{moadr.signatures.responsableOperationNom ? ` : ${moadr.signatures.responsableOperationNom}` : ""}</Text>
          <View style={styles.signatureBox} />
        </View>
        <View style={styles.signatureRow}>
          <Text style={styles.signatureRole}>{t("moadr_signature_sippt")}{responsableSippt?.nom ? ` : ${responsableSippt.nom}` : ""}</Text>
          <View style={styles.signatureBox} />
        </View>
        <View style={styles.signatureRow}>
          <Text style={styles.signatureRole}>{t("moadr_signature_operateurs")}{moadr.signatures.operateursNoms ? ` : ${moadr.signatures.operateursNoms}` : ""}</Text>
          <View style={styles.signatureBox} />
        </View>
        <PageFooter t={t} />
      </Page>
    </Document>
  );
}
