import { useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileCheck, Save, AlertTriangle, Plus, Trash2, CheckCircle2 } from "lucide-react";
import RepssDocument from "./pdf/RepssDocument";
import { logoUrl } from "../lib/contentPack";
import { saveDossier } from "../lib/storage";
import { colors } from "../lib/colors";
import ScreenTitle from "./ScreenTitle";

function AutoDoc({ label, t }) {
  return (
    <div className="flex items-center gap-2 text-sm py-1.5" style={{ color: colors.neutralTextStrong }}>
      <CheckCircle2 size={15} style={{ color: colors.success }} />
      {label}
      <span className="text-sm" style={{ color: colors.neutralText }}>
        {t("genere_auto")}
      </span>
    </div>
  );
}

export default function Generation({ dossier, setDossier, entreprise, catalogueComplet, catalogueAbrege, hopitaux, t, lang, setLang, onBack }) {
  const isAbrege = dossier.triage.modeChoisi === "abrege";
  const brand = entreprise?.branding || {};
  const logoAbsoluteUrl = brand.logo ? new URL(logoUrl(brand.logo), window.location.origin).href : null;
  // §12 : les tables de contacts (référence, urgence) affichent le logo de chaque
  // organisme — même traitement que le logo principal, en absolu pour react-pdf.
  const logosBaseUrl = new URL(`${import.meta.env.BASE_URL}content-pack/logos/`, window.location.origin).href;
  // Photo/illustration de couverture (§12, optionnelle) : même dossier que les logos.
  const photoCouvertureAbsoluteUrl = brand.photoCouverture ? `${logosBaseUrl}${brand.photoCouverture}` : null;
  const filename = `RePSS_${dossier.identification.numeroChantier || "brouillon"}.pdf`;
  const { listeEnginsSpeciaux, planParticulier } = dossier.documentsAccompagnants;

  function updateDocs(patch) {
    setDossier((prev) => ({ ...prev, documentsAccompagnants: { ...prev.documentsAccompagnants, ...patch } }));
  }
  function updatePlanParticulier(patch) {
    updateDocs({ planParticulier: { ...planParticulier, ...patch } });
  }
  function addEngin() {
    updateDocs({ listeEnginsSpeciaux: [...listeEnginsSpeciaux, { typeEngin: "", phase: "", nombre: "" }] });
  }
  function updateEngin(i, key, val) {
    updateDocs({ listeEnginsSpeciaux: listeEnginsSpeciaux.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)) });
  }
  function removeEngin(i) {
    updateDocs({ listeEnginsSpeciaux: listeEnginsSpeciaux.filter((_, idx) => idx !== i) });
  }

  // Le numéro RePSS n'est attribué qu'à cette étape (jamais avant, pour ne pas
  // gaspiller de numéros sur un brouillon), dès l'arrivée sur l'écran de génération.
  useEffect(() => {
    if (dossier.meta.repssNumero) return;
    const numero = `REPSS-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    setDossier((prev) => (prev.meta.repssNumero ? prev : { ...prev, meta: { ...prev.meta, repssNumero: numero, statut: "genere" } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ScreenTitle title={isAbrege ? t("step_generation_abrege") : t("step_generation_complet")} />

      {dossier.meta.moadrEnAttente && (
        <div className="flex items-start gap-2.5 border rounded-lg px-4 py-3 mb-5" style={{ borderColor: colors.warning, background: colors.warningBg }}>
          <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: colors.warningText }} />
          <div className="text-sm" style={{ color: colors.warningTextStrong }}>
            <p className="font-medium mb-1">
              {dossier.demandesMoadr.length} {t("moadr_demandes_en_attente")}
            </p>
            {dossier.demandesMoadr.map((m) => (
              <p key={m.id}>
                {m.descriptionSituation} → {m.mentionDocument}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="border rounded-lg p-5 mb-5" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
        <p className="text-base font-semibold mb-2.5" style={{ color: colors.blue }}>
          {t("documents_auto_titre")}
        </p>
        <AutoDoc label={t("emargement_label")} t={t} />
        {!isAbrege && <AutoDoc label={t("grille_kinney_label")} t={t} />}
        <AutoDoc label={t("titre_regles_generales_entreprise").replace(/\[.*?\]/, entreprise?.identite?.nomAffichage || "")} t={t} />
        {!isAbrege && <AutoDoc label={t("titre_liste_sous_traitants")} t={t} />}
      </div>

      {!isAbrege && (
        <div className="border rounded-lg p-5 mb-5" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
          <p className="text-base font-semibold mb-3.5" style={{ color: colors.blue }}>
            {t("titre_plan_particulier")}
          </p>
          <input
            type="file"
            className="text-sm mb-2.5"
            onChange={(e) => updatePlanParticulier({ fichier: e.target.files[0]?.name ?? null })}
          />
          {planParticulier.fichier && (
            <p className="text-sm mb-2.5" style={{ color: colors.neutralText }}>
              {t("fichier_joint")} : {planParticulier.fichier}
            </p>
          )}
          <textarea
            placeholder={t("notes_complementaires_placeholder")}
            className="w-full border rounded px-3.5 py-2.5 text-sm mb-5"
            style={{ borderColor: colors.neutralBorderStrong, background: "white" }}
            rows={2}
            value={planParticulier.notes}
            onChange={(e) => updatePlanParticulier({ notes: e.target.value })}
          />

          <p className="text-base font-semibold mb-2.5" style={{ color: colors.blue }}>
            {t("titre_liste_engins_speciaux")}
          </p>
          <table className="w-full text-sm mb-2.5">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium pb-2 pr-3" style={{ color: colors.neutralText }}>
                  {t("type_engin")}
                </th>
                <th className="text-left text-sm font-medium pb-2 pr-3" style={{ color: colors.neutralText }}>
                  {t("phase")}
                </th>
                <th className="text-left text-sm font-medium pb-2 pr-3" style={{ color: colors.neutralText }}>
                  {t("nombre")}
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {listeEnginsSpeciaux.map((r, i) => (
                <tr key={i}>
                  <td className="pr-3 pb-3">
                    <input className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: colors.neutralBorderStrong, background: "white" }} value={r.typeEngin} onChange={(e) => updateEngin(i, "typeEngin", e.target.value)} />
                  </td>
                  <td className="pr-3 pb-3">
                    <input className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: colors.neutralBorderStrong, background: "white" }} value={r.phase} onChange={(e) => updateEngin(i, "phase", e.target.value)} />
                  </td>
                  <td className="pr-3 pb-3">
                    <input type="number" className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: colors.neutralBorderStrong, background: "white" }} value={r.nombre} onChange={(e) => updateEngin(i, "nombre", e.target.value)} />
                  </td>
                  <td className="pb-3">
                    <button onClick={() => removeEngin(i)} style={{ color: colors.neutralText }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addEngin} className="flex items-center gap-1.5 text-sm" style={{ color: colors.blue }}>
            <Plus size={14} /> {t("bouton_ajouter_ligne")}
          </button>
        </div>
      )}

      <div className="border rounded-lg p-5 mb-7" style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}>
        <label className="text-sm font-medium block mb-2">{t("langue_document_label")}</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border rounded px-3.5 py-2.5 text-sm"
          style={{ borderColor: colors.neutralBorderStrong, background: "white" }}
        >
          <option value="fr">Français</option>
          <option value="nl">Nederlands</option>
          <option value="en">English</option>
        </select>
        {dossier.meta.repssNumero && (
          <p className="text-sm mt-2.5" style={{ color: colors.neutralText }}>
            {t("numero_repss_attribue")} : {dossier.meta.repssNumero}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={onBack} className="px-6 py-2.5 rounded text-sm border" style={{ borderColor: colors.neutralBorderStrong }}>
          {t("bouton_retour")}
        </button>
        <div className="flex gap-2.5">
          <button
            onClick={() => saveDossier(dossier)}
            className="flex items-center gap-2 px-5 py-2.5 rounded text-sm border"
            style={{ borderColor: colors.blue, color: colors.blue }}
          >
            <Save size={16} />
            {t("enregistrer_json_bouton")}
          </button>
          <PDFDownloadLink
            document={
              <RepssDocument
                dossier={dossier}
                entreprise={entreprise}
                catalogueComplet={catalogueComplet}
                catalogueAbrege={catalogueAbrege}
                hopitaux={hopitaux}
                t={t}
                logoAbsoluteUrl={logoAbsoluteUrl}
                logosBaseUrl={logosBaseUrl}
                photoCouvertureAbsoluteUrl={photoCouvertureAbsoluteUrl}
              />
            }
            fileName={filename}
            className="flex items-center gap-2 px-6 py-2.5 rounded text-sm font-medium"
            style={{ background: colors.navy, color: "white" }}
          >
            {({ loading }) => (
              <>
                <FileCheck size={16} />
                {loading ? t("generation_en_cours") : t("generer_pdf_bouton")}
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}
