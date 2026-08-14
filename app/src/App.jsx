import { useEffect, useState } from "react";
import { loadContentPack } from "./lib/contentPack";
import { makeTranslator } from "./lib/i18n";
import { defaultDossier } from "./lib/dossier";
import { STEPS } from "./lib/steps";
import { saveDossier } from "./lib/storage";
import {
  renseignementsGenerauxSchema,
  administrationSchema,
  sousTraitantsSchema,
  caracteristiquesSchema,
} from "./lib/schema";

import StepSidebar from "./components/StepSidebar";
import Accueil from "./components/Accueil";
import Identification from "./components/Identification";
import SimpleFormStep from "./components/SimpleFormStep";
import Caracterisation from "./components/Caracterisation";
import AnalyseRisques from "./components/AnalyseRisques";
import ComplementsStep from "./components/ComplementsStep";
import Finalisation from "./components/Finalisation";

export default function App() {
  const [pack, setPack] = useState(null);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("fr");
  const [screen, setScreen] = useState("accueil");
  const [dossier, setDossier] = useState(defaultDossier);

  useEffect(() => {
    loadContentPack()
      .then(setPack)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#EEF0F2" }}>
        <p className="text-sm" style={{ color: "#B3261E" }}>
          Erreur de chargement des données : {error}
        </p>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#EEF0F2" }}>
        <p className="text-sm" style={{ color: "#5A646C" }}>
          Chargement…
        </p>
      </div>
    );
  }

  const t = makeTranslator(pack.i18n, lang);
  const corpsMetierOptions = pack.catalogueComplet.categories
    .filter((c) => c.corps_metier !== "universel")
    .map((c) => ({ id: c.corps_metier, label: c.fr }))
    .filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i);

  const stepIndex = STEPS.findIndex((s) => s.key === screen);
  function goNext() {
    const next = STEPS[stepIndex + 1];
    if (next) setScreen(next.key);
  }
  function goBack() {
    const prev = STEPS[stepIndex - 1];
    if (prev) setScreen(prev.key);
  }

  function renderScreen() {
    switch (screen) {
      case "identification":
        return <Identification dossier={dossier} setDossier={setDossier} onNext={goNext} t={t} />;
      case "renseignements":
        return (
          <SimpleFormStep
            schema={renseignementsGenerauxSchema}
            dossier={dossier}
            setDossier={setDossier}
            t={t}
            title={t("titre_rens_gen")}
            onBack={goBack}
            onNext={goNext}
          />
        );
      case "administration":
        return (
          <SimpleFormStep
            schema={administrationSchema}
            dossier={dossier}
            setDossier={setDossier}
            t={t}
            title={t("titre_adm_chantier")}
            onBack={goBack}
            onNext={goNext}
          />
        );
      case "sousTraitants":
        return (
          <SimpleFormStep
            schema={sousTraitantsSchema}
            dossier={dossier}
            setDossier={setDossier}
            t={t}
            title={t("titre_liste_sous_traitants")}
            onBack={goBack}
            onNext={goNext}
          />
        );
      case "caracteristiques":
        return (
          <SimpleFormStep
            schema={caracteristiquesSchema}
            dossier={dossier}
            setDossier={setDossier}
            t={t}
            title={t("titre_carac_chantier")}
            onBack={goBack}
            onNext={goNext}
          />
        );
      case "caracterisation":
        return (
          <Caracterisation
            dossier={dossier}
            setDossier={setDossier}
            corpsMetierOptions={corpsMetierOptions}
            onBack={goBack}
            onNext={goNext}
          />
        );
      case "analyse":
        return (
          <AnalyseRisques
            dossier={dossier}
            setDossier={setDossier}
            catalogueComplet={pack.catalogueComplet}
            catalogueAbrege={pack.catalogueAbrege}
            onBack={goBack}
            onNext={goNext}
          />
        );
      case "complements":
        return (
          <ComplementsStep
            dossier={dossier}
            setDossier={setDossier}
            hopitaux={pack.hopitaux}
            t={t}
            onBack={goBack}
            onNext={goNext}
          />
        );
      case "finalisation":
        return (
          <Finalisation
            dossier={dossier}
            setDossier={setDossier}
            entreprise={pack.entreprise}
            catalogueComplet={pack.catalogueComplet}
            catalogueAbrege={pack.catalogueAbrege}
            hopitaux={pack.hopitaux}
            t={t}
            onBack={goBack}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#EEF0F2" }}>
      <div className="w-full max-w-4xl rounded-xl overflow-hidden border shadow-sm" style={{ borderColor: "#E2E5E8", background: "white" }}>
        {screen === "accueil" ? (
          <div className="p-6">
            <Accueil onStart={() => setScreen("identification")} lang={lang} setLang={setLang} entreprise={pack.entreprise} />
          </div>
        ) : (
          <div className="flex">
            <StepSidebar current={screen} dossier={dossier} onNavigate={setScreen} onSave={() => saveDossier(dossier)} t={t} />
            <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: "90vh" }}>
              {renderScreen()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
