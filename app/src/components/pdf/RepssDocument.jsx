import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { ROLES_ADMINISTRATION } from "../../lib/dossier";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 9, fontFamily: "Helvetica", color: "#1A1F24" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  logo: { height: 30, objectFit: "contain" },
  title: { fontSize: 16, fontWeight: 700 },
  subtitle: { fontSize: 10, color: "#5A646C", marginTop: 2 },
  section: { marginBottom: 14, breakInside: "avoid" },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginBottom: 6, paddingBottom: 3, borderBottom: "1pt solid #D6DADE" },
  row: { flexDirection: "row", marginBottom: 3 },
  kvKey: { width: 160, color: "#5A646C" },
  kvVal: { flex: 1, fontWeight: 500 },
  bullet: { flexDirection: "row", marginBottom: 2 },
  bulletDot: { width: 10 },
  tableHeader: { flexDirection: "row", borderBottom: "1pt solid #0B3040", paddingBottom: 3, marginBottom: 3 },
  tableRow: { flexDirection: "row", borderBottom: "0.5pt solid #E2E5E8", paddingVertical: 2 },
  th: { fontWeight: 700, fontSize: 8 },
  td: { fontSize: 8 },
  logosRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  contactCard: { width: "48%", marginBottom: 6, fontSize: 8, border: "0.5pt solid #E2E5E8", padding: 5 },
});

function Section({ title, children }) {
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

export default function RepssDocument({ dossier, entreprise, catalogueComplet, catalogueAbrege, hopitaux, t, logoAbsoluteUrl }) {
  const { identification, renseignementsGeneraux: rg, administration: adm, caracteristiques: cc, caracterisation, reglesSpecifiques: rs } = dossier;
  const isAbrege = caracterisation.mode === "abrege";

  const activitesSelectionnees = [];
  if (!isAbrege) {
    for (const act of catalogueComplet.activites) {
      if (dossier.analyseRisques.activitesCochees.includes(act.id)) {
        const risques = catalogueComplet.lignesRisque.filter((r) => r.parent === act.id);
        activitesSelectionnees.push({ activite: act, risques });
      }
    }
  }
  const itemsAbregeSelectionnes = isAbrege
    ? catalogueAbrege.risques.filter((r) => dossier.analyseRisques.itemsCochesAbrege.includes(r.id))
    : [];

  const hopitauxSelectionnes = rs.hopitalPlusProcheIds.map((id) => hopitaux.find((h) => h.id === id)).filter(Boolean);
  const contacts = entreprise?.contactsReference || {};
  const controleTech = contacts.controleTechnique || {};
  const dgBienEtre = contacts.dgBienEtre || {};

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          {logoAbsoluteUrl && <Image src={logoAbsoluteUrl} style={styles.logo} />}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.title}>Réponse au P.S.S.</Text>
            <Text style={styles.subtitle}>
              {identification.numeroChantier} - {identification.nomChantier}
            </Text>
            <Text style={styles.subtitle}>{isAbrege ? "RePSS abrégé" : "RePSS complet"} · {dossier.meta.dateDerniereModif}</Text>
          </View>
        </View>

        <Section title={t("titre_rens_gen")}>
          <KV label={t("client")} value={rg.client} />
          <KV label={t("maitre_oeuvre")} value={rg.maitreOeuvre} />
          <KV label={t("maitre_ouvrage")} value={rg.maitreOuvrage} />
          <KV label={t("nom_resp_travaux")} value={rg.nomRespTravaux} />
          <KV label={t("nom_resp_paiements")} value={rg.nomRespPaiements} />
          <KV label={t("nom_conseiller_prevention")} value={rg.nomConseillerPrevention} />
          <KV label={t("bureau_architecture")} value={rg.bureauArchitecture} />
          <KV label={t("be_tech_speciales")} value={rg.beTechSpeciales} />
          <KV label={t("coordinateur_securite")} value={rg.coordinateurSecurite} />
          <KV label={t("adresse_chantier")} value={rg.adresseChantier} />
          <KV label={t("adresse_facturation")} value={rg.adresseFacturation} />
          <KV label={t("numero_tva")} value={rg.numeroTva} />
        </Section>

        <Section title={t("titre_adm_chantier")}>
          {ROLES_ADMINISTRATION.map(
            (role) => adm.responsables[role] && <KV key={role} label={t(role)} value={adm.responsables[role]} />
          )}
          <KV label={t("description_succinte_travaux")} value={adm.descriptionTravaux} />
          <KV label={t("date_debut_travaux")} value={adm.dateDebutTravaux} />
          <KV label={t("date_fin_travaux")} value={adm.dateFinTravaux} />
          <Table
            columns={[
              { key: "page", label: t("page") },
              { key: "changement", label: t("changement"), flex: 2 },
              { key: "date", label: t("date") },
            ]}
            rows={adm.revisionsPPSS}
          />
        </Section>

        <Section title={t("titre_liste_sous_traitants")}>
          <Table
            columns={[
              { key: "societe", label: t("societe") },
              { key: "natureTravaux", label: t("nature_travaux"), flex: 2 },
              { key: "responsable", label: t("responsable") },
            ]}
            rows={dossier.sousTraitants}
          />
        </Section>

        <Section title={t("titre_carac_chantier")}>
          <Bullets
            items={[
              { label: t("plan_en_annexe"), value: cc.planEnAnnexe },
              { label: t("refectoire"), value: cc.refectoire },
              { label: t("wc"), value: cc.wc },
              { label: t("stockage"), value: cc.stockage },
              { label: t("evacuation_dechets"), value: cc.evacuationDechets },
              { label: t("eclairage"), value: cc.eclairage },
              { label: t("electricite_alim_terre"), value: cc.electriciteAlimTerre },
              { label: t("eau"), value: cc.eau },
              { label: t("panneau_signalisation"), value: cc.panneauSignalisation },
              { label: t("barrieres"), value: cc.barrieres },
              { label: t("garde_corps"), value: cc.gardeCorps },
              { label: t("ligne_de_vie"), value: cc.ligneDeVie },
              { label: t("filet_retention"), value: cc.filetRetention },
              { label: t("presence_secouristes"), value: cc.presenceSecouristes },
              { label: t("permis_feu"), value: cc.permisFeu },
              { label: t("permis_travail"), value: cc.permisTravail },
            ]}
          />
          <KV label={t("particularites_acces")} value={cc.particularitesAcces} />
          <KV label={t("zone_circulation")} value={cc.zoneCirculation} />
          <KV label={t("zone_travail")} value={cc.zoneTravail} />
          <KV label={t("materiel_specifique")} value={cc.materielSpecifique} />
          <KV label={t("produits_dangereux")} value={cc.produitsDangereux} />
        </Section>

        <Section title={t("titre_analyse_risques_chantier")}>
          {isAbrege
            ? itemsAbregeSelectionnes.map((r) => (
                <View key={r.id} style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: 700 }}>{r.sourceDanger}</Text>
                  <Text>{r.mesure}</Text>
                </View>
              ))
            : activitesSelectionnees.map(({ activite, risques }) => (
                <View key={activite.id} style={{ marginBottom: 6 }} wrap={false}>
                  <Text style={{ fontWeight: 700 }}>{activite.fr}</Text>
                  {risques.map((r) => (
                    <View key={r.id} style={{ marginLeft: 8, marginTop: 2 }}>
                      <Text style={{ fontWeight: 500 }}>{r.sourceDanger}</Text>
                      <Text>{r.mesuresPrevention}</Text>
                    </View>
                  ))}
                </View>
              ))}
        </Section>

        <Section title={t("titre_regles_speciales")}>
          <KV label={t("conseiller_prevention")} value={rs.conseillerPrevention} />
          <KV label={t("service_incendie")} value={rs.serviceIncendie} />
          <KV label={t("service_incendie_interne")} value={rs.serviceIncendieInterne} />
          <KV label={t("infirmerie_client")} value={rs.infirmerieClient} />
          {hopitauxSelectionnes.map((h) => (
            <KV key={h.id} label={t("hopital_plus_proche")} value={`${h.nom_hopital}${h.nom_site ? " (" + h.nom_site + ")" : ""} — ${h.adresse}, ${h.code_postal} ${h.commune}`} />
          ))}
        </Section>

        <Section title={t("titre_derogations_pss")}>
          {dossier.derogationsPSS.neant ? (
            <Text>{t("neant")}</Text>
          ) : (
            <Table
              columns={[
                { key: "objet", label: t("objet") },
                { key: "zoneApplication", label: t("zone_application") },
                { key: "motivationRaison", label: t("motivation_raison"), flex: 2 },
                { key: "autorisationDonneePar", label: t("autorisation_donnee_par") },
              ]}
              rows={dossier.derogationsPSS.items}
            />
          )}
        </Section>

        <Section title={t("titre_questions_coordination")}>
          <Table
            columns={[
              { key: "question", label: t("question"), flex: 2 },
              { key: "reponse", label: t("reponse"), flex: 2 },
            ]}
            rows={dossier.questionsCoordination}
          />
        </Section>

        <Section title={t("titre_plan_particulier")}>
          <Text>{dossier.planParticulier.notes}</Text>
          <Table
            columns={[
              { key: "typeEngin", label: t("type_engin") },
              { key: "phase", label: t("phase") },
              { key: "nombre", label: t("nombre") },
            ]}
            rows={dossier.planParticulier.enginsSpeciaux}
          />
        </Section>
      </Page>

      <Page size="A4" style={styles.page} wrap>
        <Section title={t("titre_regles_generales_entreprise").replace("[nom entreprise]", entreprise?.identite?.nomAffichage || "")}>
          <Text>{entreprise?.reglesGeneralesAnnexe4?.texte}</Text>
        </Section>

        <Section title="Contacts de référence">
          <View style={styles.logosRow}>
            {Object.entries(contacts)
              .filter(([key]) => !["controleTechnique", "dgBienEtre"].includes(key))
              .map(([key, c]) => (
                <View key={key} style={styles.contactCard}>
                  <Text style={{ fontWeight: 700 }}>{c.nom}</Text>
                  <Text>{c.adresse}</Text>
                  <Text>{c.tel} {c.email}</Text>
                  <Text>{c.site_web}</Text>
                </View>
              ))}
            {Object.entries(controleTech).map(([key, c]) => (
              <View key={key} style={styles.contactCard}>
                <Text style={{ fontWeight: 700 }}>{c.nom}</Text>
                <Text>{c.adresse}</Text>
                <Text>{c.tel} {c.email}</Text>
              </View>
            ))}
            {Object.entries(dgBienEtre).map(([key, c]) => (
              <View key={key} style={styles.contactCard}>
                <Text style={{ fontWeight: 700 }}>{c.nom}</Text>
                <Text>{c.adresse}</Text>
                <Text>{c.tel} {c.email}</Text>
              </View>
            ))}
          </View>
        </Section>
      </Page>
    </Document>
  );
}
