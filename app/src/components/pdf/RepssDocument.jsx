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
  contactCard: { width: "48%", marginBottom: 6, fontSize: 8, border: "0.5pt solid #E2E5E8", padding: 5 },
  logosRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  catTitle: { fontSize: 10, fontWeight: 700, color: "#0B3040", marginTop: 8, marginBottom: 3, paddingBottom: 2, borderBottom: "1pt solid #E2E5E8" },
  subTitle: { fontSize: 9.5, fontWeight: 700, color: "#0B3040", marginTop: 5, marginBottom: 2, paddingBottom: 2, borderBottom: "0.75pt solid #D6E3E8" },
  actTitle: { fontSize: 9, fontWeight: 500, color: "#3D4750", marginTop: 3, marginBottom: 1, marginLeft: 6 },
  ligneRisque: { marginLeft: 12, marginTop: 1, marginBottom: 1 },
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

function TriStateRow({ label, value, t }) {
  if (!value) return null;
  const tristateLabel = { interne: t("tristate_interne"), client: t("tristate_client"), na: t("tristate_na") };
  return <KV label={label} value={tristateLabel[value] || value} />;
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

// §6 : la hiérarchie catégorie > sous-catégorie > activité est toujours affichée en
// entier (même sans ligne cochée dessous) pour prouver une revue délibérée ; seules
// les lignes de risque cochées sont détaillées.
function AnalyseRisquesComplet({ catalogue, corpsMetier, itemsCoches, t }) {
  const cochesById = Object.fromEntries(itemsCoches.map((i) => [i.risqueId, i]));
  const visibleCats = catalogue.categories.filter((c) => c.corps_metier === "universel" || corpsMetier.includes(c.corps_metier));

  return (
    <View>
      {visibleCats.map((cat) => (
        <View key={cat.id} wrap>
          <Text style={styles.catTitle}>{cat.fr}</Text>
          {catalogue.sousCategories
            .filter((s) => s.parent === cat.id)
            .map((sub) => (
              <View key={sub.id}>
                <Text style={styles.subTitle}>{sub.fr}</Text>
                {catalogue.activites
                  .filter((a) => a.parent === sub.id)
                  .map((act) => {
                    const lignes = catalogue.lignesRisque.filter((r) => r.parent === act.id && cochesById[r.id]);
                    return (
                      <View key={act.id} wrap={false}>
                        <Text style={styles.actTitle}>{act.fr}</Text>
                        {lignes.map((r) => (
                          <View key={r.id} style={styles.ligneRisque}>
                            <Text style={{ fontWeight: 500 }}>{r.sourceDanger}</Text>
                            <Text>{r.mesuresPrevention}</Text>
                            {cochesById[r.id].remarques && <Text style={{ color: "#5A646C" }}>{t("remarques_descriptifs")} {cochesById[r.id].remarques}</Text>}
                          </View>
                        ))}
                      </View>
                    );
                  })}
              </View>
            ))}
        </View>
      ))}
    </View>
  );
}

function AnalyseRisquesAbrege({ catalogue, itemsCoches }) {
  const cochesById = Object.fromEntries(itemsCoches.map((i) => [i.risqueId, i]));
  return (
    <View>
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
  );
}

export default function RepssDocument({ dossier, entreprise, catalogueComplet, catalogueAbrege, hopitaux, t, logoAbsoluteUrl }) {
  const { identification, renseignementsGeneraux: rg, administratif: adm, caracteristiques: cc, triage, caracterisation, reglesSpecifiques: rs, documentsAccompagnants: da, infosChantierUsine: icu } = dossier;
  const isAbrege = triage.modeChoisi === "abrege";

  const hopitauxSelectionnes = rs.hopitalPlusProcheIds.map((id) => hopitaux.find((h) => h.id === id)).filter(Boolean);
  const contacts = entreprise?.contactsReference || {};

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          {logoAbsoluteUrl && <Image src={logoAbsoluteUrl} style={styles.logo} />}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.title}>{t("reponse_au_pss")}</Text>
            <Text style={styles.subtitle}>
              {identification.numeroChantier} - {identification.nomChantier}
            </Text>
            <Text style={styles.subtitle}>
              {isAbrege ? t("repss_abrege_label") : t("repss_complet_label")} · {dossier.meta.dateDerniereModif}
              {dossier.meta.repssNumero ? ` · ${dossier.meta.repssNumero}` : ""}
            </Text>
          </View>
        </View>

        {!isAbrege && (
          <Section title={t("titre_rens_gen")}>
            <KV label={t("client")} value={rg.client} />
            <KV label={t("bureau_architecture")} value={rg.bureauArchitecture} />
            <KV label={t("coordinateur_securite")} value={rg.coordinateurSecurite} />
            <KV label={t("adresse_chantier")} value={rg.adresseChantier} />
          </Section>
        )}

        {!isAbrege && (
          <Section title={t("titre_adm_chantier")}>
            <KV label={t("date_debut_travaux")} value={adm.dateDebutTravaux} />
            <KV label={t("date_fin_travaux")} value={adm.dateFinTravauxEstimee} />
            {(entreprise?.rolesApprobation?.fixes || []).map((r) => (
              <KV key={r.fonction} label={r.fonction} value={r.nom} />
            ))}
            {ROLES_ADMINISTRATION.map((role) => adm.responsables[role] && <KV key={role} label={t(role)} value={adm.responsables[role]} />)}
            <Table
              columns={[
                { key: "societe", label: t("societe") },
                { key: "natureTravaux", label: t("nature_travaux"), flex: 2 },
                { key: "responsable", label: t("responsable") },
              ]}
              rows={da.sousTraitants}
            />
          </Section>
        )}

        {!isAbrege && (
          <Section title={t("titre_carac_chantier")}>
            <TriStateRow label={t("refectoire")} value={cc.refectoire} t={t} />
            <TriStateRow label={t("wc")} value={cc.wc} t={t} />
            <TriStateRow label={t("stockage")} value={cc.stockage} t={t} />
            <TriStateRow label={t("zone_circulation")} value={cc.zoneCirculation} t={t} />
            <TriStateRow label={t("zone_travail")} value={cc.zoneTravail} t={t} />
            <TriStateRow label={t("electricite_alim_terre")} value={cc.electricite} t={t} />
            <TriStateRow label={t("eau")} value={cc.eau} t={t} />
            <TriStateRow label={t("garde_corps")} value={cc.gardeCorps} t={t} />
            <TriStateRow label={t("ligne_de_vie")} value={cc.ligneDeVie} t={t} />
            <TriStateRow label={t("filet_retention")} value={cc.filetRetention} t={t} />
            <KV label={t("particularites_acces")} value={cc.particularitesAcces} />
          </Section>
        )}

        {isAbrege && (
          <Section title={t("titre_infos_chantier_usine")}>
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

        <Section title={t("titre_analyse_risques_chantier")}>
          {isAbrege ? (
            <AnalyseRisquesAbrege catalogue={catalogueAbrege} itemsCoches={dossier.analyseRisques.itemsCoches} />
          ) : (
            <AnalyseRisquesComplet
              catalogue={catalogueComplet}
              corpsMetier={caracterisation.corpsMetier}
              itemsCoches={dossier.analyseRisques.itemsCoches}
              t={t}
            />
          )}
        </Section>

        {!isAbrege && (
          <Section title={t("titre_regles_speciales")}>
            <KV label={t("service_incendie")} value="112" />
            <KV label={`${t("service_incendie")} (${t("n_interne_placeholder")})`} value={rs.serviceIncendieInterne} />
            <KV label={t("centre_antipoison_label")} value="070/245.245" />
            <KV label={t("police_label")} value={contacts.police?.tel || "101"} />
            <KV label={`${t("police_label")}, ${t("police_zone_proche")}`} value={contacts.police?.site_web} />
            {hopitauxSelectionnes.map((h) => (
              <KV key={h.id} label={t("hopital_plus_proche")} value={`${h.nom_hopital}${h.nom_site ? " (" + h.nom_site + ")" : ""}, ${h.adresse}, ${h.code_postal} ${h.commune}`} />
            ))}
          </Section>
        )}

        {!isAbrege && (
          <Section title={t("titre_derogations_pss")}>
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

        {!isAbrege && (da.planParticulier.notes || da.planParticulier.fichier || da.listeEnginsSpeciaux.length > 0) && (
          <Section title={t("titre_plan_particulier")}>
            <KV label={t("fichier_joint")} value={da.planParticulier.fichier} />
            <Text>{da.planParticulier.notes}</Text>
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

        {dossier.demandesMoadr.length > 0 && (
          <Section title={t("moadr_section_titre_pdf")}>
            {dossier.demandesMoadr.map((m) => (
              <View key={m.id} style={{ marginBottom: 4 }}>
                <Text>{m.descriptionSituation}</Text>
                <Text style={{ color: "#5A646C" }}>{m.mentionDocument}</Text>
              </View>
            ))}
          </Section>
        )}
      </Page>

      <Page size="A4" style={styles.page} wrap>
        <Section title={t("titre_regles_generales_entreprise").replace(/\[.*?\]/, entreprise?.identite?.nomAffichage || "")}>
          <Text>{entreprise?.reglesGeneralesAnnexe4?.texte}</Text>
        </Section>

        <Section title={t("contacts_reference_titre")}>
          <View style={styles.logosRow}>
            {Object.entries(contacts)
              .filter(([key]) => !["controleTechnique", "dgBienEtre"].includes(key))
              .map(([key, c]) => (
                <View key={key} style={styles.contactCard}>
                  <Text style={{ fontWeight: 700 }}>{c.nom}</Text>
                  <Text>{c.adresse}</Text>
                  <Text>
                    {c.tel} {c.email}
                  </Text>
                  <Text>{c.site_web}</Text>
                </View>
              ))}
            {Object.entries(contacts.controleTechnique || {}).map(([key, c]) => (
              <View key={key} style={styles.contactCard}>
                <Text style={{ fontWeight: 700 }}>{c.nom}</Text>
                <Text>{c.adresse}</Text>
                <Text>
                  {c.tel} {c.email}
                </Text>
              </View>
            ))}
            {Object.entries(contacts.dgBienEtre || {}).map(([key, c]) => (
              <View key={key} style={styles.contactCard}>
                <Text style={{ fontWeight: 700 }}>{c.nom}</Text>
                <Text>{c.adresse}</Text>
                <Text>
                  {c.tel} {c.email}
                </Text>
              </View>
            ))}
          </View>
        </Section>
      </Page>
    </Document>
  );
}
