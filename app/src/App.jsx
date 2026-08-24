import { useEffect, useState } from "react";
import { loadContentPack } from "./lib/contentPack";
import { makeTranslator } from "./lib/i18n";
import { colors } from "./lib/colors";
import { defaultDossier } from "./lib/dossier";
import { defaultMoadrDossier } from "./lib/moadrDossier";
import { getSteps } from "./lib/steps";
import { saveDossier } from "./lib/storage";

import StepSidebar from "./components/StepSidebar";
import Accueil from "./components/Accueil";
import Identification from "./components/Identification";
import Caracterisation from "./components/Caracterisation";
import InfosAdmin from "./components/InfosAdmin";
import InfosChantierUsine from "./components/InfosChantierUsine";
import AnalyseRisques from "./components/AnalyseRisques";
import Generation from "./components/Generation";
import Moadr from "./components/Moadr";

export default function App() {
  const [pack, setPack] = useState(null);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("fr");
  const [screen, setScreen] = useState("accueil");
  const [dossier, setDossier] = useState(defaultDossier);
  // §13 : le MOADR est un troisième type de document, distinct du dossier RePSS
  // (pas de mode "abrégé/complet" à gérer) — son propre état, en parallèle.
  const [moadrDossier, setMoadrDossier] = useState(defaultMoadrDossier);
  // Écran RePSS à retrouver au retour du MOADR : null si lancé depuis l'accueil
  // (retour à l'accueil), sinon l'étape du wizard quittée pour y aller.
  const [screenAvantMoadr, setScreenAvantMoadr] = useState(null);
  const [infosAdminTab, setInfosAdminTab] = useState("renseignements");
  // Plus haut index d'étape jamais atteint : distinct de l'étape courante pour que
  // revenir en arrière dans la sidebar ne "referme" pas l'accès aux étapes déjà
  // remplies plus loin (sinon on est forcé de repasser par "Continuer" à chaque fois).
  const [furthestStepIndex, setFurthestStepIndex] = useState(0);

  useEffect(() => {
    loadContentPack()
      .then(setPack)
      .catch((e) => setError(e.message));
  }, []);

  // Le parcours bifurque juste après la Caractérisation selon le mode choisi
  // (CLAUDE.md §5) : la liste d'étapes dépend donc de triage.modeChoisi. Calculé ici
  // (avant les retours anticipés ci-dessous) pour respecter les règles des Hooks.
  const steps = getSteps(dossier.triage.modeChoisi);
  const stepIndex = steps.findIndex((s) => s.key === screen);
  useEffect(() => {
    if (stepIndex > furthestStepIndex) setFurthestStepIndex(stepIndex);
  }, [stepIndex, furthestStepIndex]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: colors.neutralBg }}>
        <p className="text-sm" style={{ color: colors.error }}>
          Erreur de chargement des données : {error}
        </p>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: colors.neutralBg }}>
        <p className="text-sm" style={{ color: colors.neutralText }}>
          Chargement…
        </p>
      </div>
    );
  }

  const t = makeTranslator(pack.i18n, lang);
  // Le catalogue complet existe en fr/en/nl (RePSS_Analyse_Risques_EN/NL.xlsx) :
  // sélectionné selon la langue courante, avant même l'étape Génération, pour que
  // le wizard (Caractérisation, Analyse de risques) s'affiche déjà dans la langue
  // choisie et pas seulement le PDF final.
  const catalogueComplet = pack.catalogueComplet[lang] || pack.catalogueComplet.fr;
  const corpsMetierOptions = catalogueComplet.categories
    .filter((c) => c.corps_metier !== "universel")
    .map((c) => ({ id: c.corps_metier, label: c.fr }))
    .filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i);

  function goNext() {
    const next = steps[stepIndex + 1];
    if (next) setScreen(next.key);
  }
  function goBack() {
    const prev = steps[stepIndex - 1];
    if (prev) setScreen(prev.key);
  }

  // §13 : deux entrées vers le même outil MOADR — standalone (accueil, aucun lien
  // avec un RePSS) ou depuis une demande faite au sein du RePSS en cours (pré-
  // remplissage automatique : chantier, date, contexte déjà connus à ce stade).
  function startMoadrStandalone() {
    setMoadrDossier(defaultMoadrDossier());
    setScreenAvantMoadr(null);
    setScreen("moadr");
  }
  function openMoadrFromDemande(demande) {
    const base = defaultMoadrDossier();
    const dateDebut = dossier.administratif?.dateDebutTravaux || dossier.infosChantierUsine?.dateDebutTravaux || "";
    setMoadrDossier({
      ...base,
      origine: {
        repssNumeroChantier: dossier.identification.numeroChantier,
        repssNomChantier: dossier.identification.nomChantier,
        demandeMoadrId: demande.id,
      },
      objet: {
        ...base.objet,
        projet: dossier.identification.nomChantier,
        dateDebut,
        responsableOperation: dossier.identification.pmLead,
      },
      intervention: { ...base.intervention, contexte: demande.descriptionSituation },
    });
    setScreenAvantMoadr(screen);
    setScreen("moadr");
  }
  // À l'attribution de la référence MOADR (§13 : "le PDF généré est joint en
  // annexe de ce RePSS"), on ne peut pas joindre de vrai fichier (pas de backend) :
  // on référence le PDF généré dans la demande d'origine, marquée traitée.
  function marquerMoadrGenere(demandeMoadrId, filename) {
    if (!demandeMoadrId) return;
    setDossier((prev) => {
      const next = prev.demandesMoadr.map((d) => (d.id === demandeMoadrId ? { ...d, statut: "traite", fichierAnnexe: filename } : d));
      return { ...prev, demandesMoadr: next, meta: { ...prev.meta, moadrEnAttente: next.some((d) => d.statut === "demande") } };
    });
  }

  function renderScreen() {
    switch (screen) {
      case "identification":
        return <Identification dossier={dossier} setDossier={setDossier} onNext={goNext} t={t} />;
      case "caracterisation":
        return (
          <Caracterisation
            dossier={dossier}
            setDossier={setDossier}
            corpsMetierOptions={corpsMetierOptions}
            onBack={goBack}
            onNext={goNext}
            t={t}
          />
        );
      case "infosAdmin":
        return (
          <InfosAdmin
            dossier={dossier}
            setDossier={setDossier}
            entreprise={pack.entreprise}
            hopitaux={pack.hopitaux}
            t={t}
            onBack={goBack}
            onNext={goNext}
            tab={infosAdminTab}
            setTab={setInfosAdminTab}
          />
        );
      case "infosChantierUsine":
        return <InfosChantierUsine dossier={dossier} setDossier={setDossier} t={t} onBack={goBack} onNext={goNext} />;
      case "analyse":
        return (
          <AnalyseRisques
            dossier={dossier}
            setDossier={setDossier}
            catalogueComplet={catalogueComplet}
            catalogueAbrege={pack.catalogueAbrege}
            onBack={goBack}
            onNext={goNext}
            onOpenMoadr={openMoadrFromDemande}
            t={t}
          />
        );
      case "generation":
        return (
          <Generation
            dossier={dossier}
            setDossier={setDossier}
            entreprise={pack.entreprise}
            catalogueComplet={catalogueComplet}
            catalogueAbrege={pack.catalogueAbrege}
            hopitaux={pack.hopitaux}
            t={t}
            lang={lang}
            setLang={setLang}
            onBack={goBack}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: colors.neutralBg }}>
      <div className="w-full max-w-5xl rounded-xl overflow-hidden border shadow-sm" style={{ borderColor: colors.neutralBorder, background: "white" }}>
        {screen === "accueil" ? (
          <div className="p-8">
            <Accueil
              onStart={() => setScreen("identification")}
              onStartMoadr={startMoadrStandalone}
              lang={lang}
              setLang={setLang}
              entreprise={pack.entreprise}
              t={t}
            />
          </div>
        ) : screen === "moadr" ? (
          <div className="p-8 overflow-y-auto" style={{ maxHeight: "90vh" }}>
            {/* Outil autonome, une seule page (pas de sidebar d'étapes) : les 9
                sections du MOADR ne bifurquent pas comme le triage RePSS, §13. */}
            <Moadr
              moadr={moadrDossier}
              setMoadr={setMoadrDossier}
              entreprise={pack.entreprise}
              t={t}
              lang={lang}
              setLang={setLang}
              onBack={() => setScreen(screenAvantMoadr || "accueil")}
              onGenerated={marquerMoadrGenere}
            />
          </div>
        ) : (
          <div className="flex">
            <StepSidebar
              current={screen}
              furthestStepIndex={furthestStepIndex}
              dossier={dossier}
              onNavigate={setScreen}
              onSave={() => saveDossier(dossier)}
              t={t}
              infosAdminTab={infosAdminTab}
              setInfosAdminTab={setInfosAdminTab}
            />
            <div className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: "90vh" }}>
              {renderScreen()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
