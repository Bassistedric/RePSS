import { useState, useRef } from "react";
import { Check, Circle, ChevronDown, ChevronUp, FileCheck, ListChecks, Search, Sparkles, Upload, Save, Info } from "lucide-react";

const VMA_LOGO =
  "data:image/png;base64,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";

const BRAND = {
  primary: "#0B3040",
  secondary: "#156082",
};

const CATALOGUE = {
  categories: [
    { id: "cat10_mesures_generales", fr: "Mesures générales", corpsMetier: "universel" },
    { id: "cat32_hvac_froid", fr: "HVAC - Froid", corpsMetier: "hvac_froid" },
  ],
  sousCategories: [
    { id: "cat10_mesures_generales_sub1", fr: "Installation de chantier", parent: "cat10_mesures_generales" },
    { id: "cat32_hvac_froid_sub1", fr: "Exécution", parent: "cat32_hvac_froid" },
  ],
  activites: [
    { id: "cat10_mesures_generales_sub1_act1", fr: "Implantation", parent: "cat10_mesures_generales_sub1" },
    { id: "cat10_mesures_generales_sub1_act2", fr: "Accès au chantier", parent: "cat10_mesures_generales_sub1" },
    { id: "cat10_mesures_generales_sub1_act3", fr: "Pose de signalisation", parent: "cat10_mesures_generales_sub1" },
    { id: "cat10_mesures_generales_sub1_act4", fr: "Mise en place des conteneurs et baraquements", parent: "cat10_mesures_generales_sub1" },
    { id: "cat10_mesures_generales_sub1_act5", fr: "Raccordement électrique, téléphonique, mise à la terre", parent: "cat10_mesures_generales_sub1" },
    { id: "cat10_mesures_generales_sub1_act6", fr: "Vestiaires", parent: "cat10_mesures_generales_sub1" },
    { id: "cat10_mesures_generales_sub1_act7", fr: "Réfectoire pour les repas", parent: "cat10_mesures_generales_sub1" },
    { id: "cat10_mesures_generales_sub1_act8", fr: "Sanitaires", parent: "cat10_mesures_generales_sub1" },
    { id: "cat32_hvac_froid_sub1_act1", fr: "Utilisation de certains produits", parent: "cat32_hvac_froid_sub1" },
    { id: "cat32_hvac_froid_sub1_act2", fr: "Travaux de soudure", parent: "cat32_hvac_froid_sub1" },
    { id: "cat32_hvac_froid_sub1_act3", fr: "Travaux d'isolation", parent: "cat32_hvac_froid_sub1" },
    { id: "cat32_hvac_froid_sub1_act4", fr: "Travaux d'électricité", parent: "cat32_hvac_froid_sub1" },
    { id: "cat32_hvac_froid_sub1_act6", fr: "Mise en service et intervention", parent: "cat32_hvac_froid_sub1" },
    { id: "cat32_hvac_froid_sub1_act8", fr: "Travaux de terrassement et pose de canalisations", parent: "cat32_hvac_froid_sub1" },
  ],
  risques: [
    { id: "r1", parent: "cat10_mesures_generales_sub1_act1", src: "Absence de coordination" },
    { id: "r2", parent: "cat10_mesures_generales_sub1_act2", src: "Accès non maîtrisés des véhicules et des piétons" },
    { id: "r3", parent: "cat10_mesures_generales_sub1_act2", src: "Piste non stabilisée" },
    { id: "r4", parent: "cat10_mesures_generales_sub1_act2", src: "Zones de circulation non définies" },
    { id: "r5", parent: "cat10_mesures_generales_sub1_act3", src: "Proximité de circulation non maîtrisée" },
    { id: "r6", parent: "cat10_mesures_generales_sub1_act3", src: "Absence de signalisation / balisage" },
    { id: "r7", parent: "cat10_mesures_generales_sub1_act4", src: "Portance du sol insuffisante" },
    { id: "r8", parent: "cat10_mesures_generales_sub1_act5", src: "Câbles ou conduites existantes enterrées" },
    { id: "r9", parent: "cat10_mesures_generales_sub1_act5", src: "Raccordement" },
    { id: "r10", parent: "cat10_mesures_generales_sub1_act6", src: "Vol" },
    { id: "r11", parent: "cat10_mesures_generales_sub1_act6", src: "Locaux communs sous-traitant / autre entreprise" },
    { id: "r12", parent: "cat10_mesures_generales_sub1_act7", src: "Températures extérieures" },
    { id: "r13", parent: "cat10_mesures_generales_sub1_act8", src: "Locaux communs sous-traitant / autre entreprise" },
    { id: "r14", parent: "cat32_hvac_froid_sub1_act1", src: "Bonbonnes sous pression (oxygène, acétylène…)" },
    { id: "r15", parent: "cat32_hvac_froid_sub1_act1", src: "Produits chimiques ou dangereux (acides, peintures…)" },
    { id: "r16", parent: "cat32_hvac_froid_sub1_act2", src: "Chalumeau oxyacétylénique" },
    { id: "r17", parent: "cat32_hvac_froid_sub1_act2", src: "Poste à souder" },
    { id: "r18", parent: "cat32_hvac_froid_sub1_act3", src: "Laine minérale, poussières" },
    { id: "r19", parent: "cat32_hvac_froid_sub1_act4", src: "Panneau d'affichage, voltmètre" },
    { id: "r20", parent: "cat32_hvac_froid_sub1_act6", src: "Travaux sur une installation électrique, système de détection incendie…" },
    { id: "r21", parent: "cat32_hvac_froid_sub1_act6", src: "Installation gaz" },
    { id: "r22", parent: "cat32_hvac_froid_sub1_act6", src: "Remplissage du gaz et mise sous pression de l'installation" },
    { id: "r23", parent: "cat32_hvac_froid_sub1_act8", src: "Pelle hydraulique" },
    { id: "r24", parent: "cat32_hvac_froid_sub1_act8", src: "Camions" },
  ],
};

const CORPS_METIER_OPTIONS = [
  { id: "electricite", label: "Électricité BT/HT" },
  { id: "hvac_froid", label: "HVAC - Froid" },
  { id: "photovoltaique", label: "Photovoltaïque" },
];

const STEPS = [
  { key: "identification", label: "Identification", icon: Search },
  { key: "caracterisation", label: "Caractérisation", icon: Sparkles },
  { key: "analyse", label: "Analyse de risques", icon: ListChecks },
];

function sanitizeFilename(s) {
  return s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function StepSidebar({ current, numero, nom, mode, corpsMetier, checked, onNavigate }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);
  const [showInfo, setShowInfo] = useState(false);
  const chantierLabel = numero && nom ? `${numero} - ${nom}` : numero || nom || "Chantier";

  function handleSave() {
    const data = {
      meta: {
        repssNumero: null,
        version: 1,
        statut: "brouillon",
        dateDerniereModif: new Date().toISOString().slice(0, 10),
      },
      identification: { numeroChantier: numero, nomChantier: nom, chantierId: chantierLabel },
      caracterisation: { modeChoisi: mode, corpsMetier },
      analyseRisques: { itemsCoches: [...checked].map((id) => ({ risqueId: id, remarques: "" })) },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const filename = numero && nom ? `RePSS_${sanitizeFilename(numero)}_${sanitizeFilename(nom)}.json` : "RePSS_brouillon.json";
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-52 shrink-0 border-r p-4 flex flex-col" style={{ background: "#F7F8F9", borderColor: "#E2E5E8" }}>
      <p className="text-xs mb-4 truncate" style={{ color: "#7A8590" }}>
        {chantierLabel}
      </p>
      <div className="flex flex-col gap-1 flex-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < currentIndex;
          const active = s.key === current;
          const reachable = i <= currentIndex;
          return (
            <button
              key={s.key}
              onClick={() => reachable && onNavigate(s.key)}
              disabled={!reachable}
              className="flex items-center gap-2 px-2 py-2 rounded text-sm text-left"
              style={{
                cursor: reachable ? "pointer" : "default",
                ...(active
                  ? { background: "#E7EEF1", color: BRAND.primary, fontWeight: 500 }
                  : { color: done ? "#3D4750" : "#A7AFB6" }),
              }}
            >
              {done ? <Check size={16} /> : active ? <Icon size={16} /> : <Circle size={16} />}
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="pt-3 border-t" style={{ borderColor: "#E2E5E8" }}>
        <button
          onClick={handleSave}
          disabled={!numero && !nom}
          className="w-full flex items-center justify-center gap-2 text-xs px-3 py-2 rounded border disabled:opacity-40"
          style={{ borderColor: BRAND.secondary, color: BRAND.secondary }}
        >
          <Save size={14} />
          Enregistrer
        </button>
        <button
          onClick={() => setShowInfo((v) => !v)}
          className="flex items-center gap-1 text-[11px] mt-1.5 mx-auto"
          style={{ color: "#A7AFB6" }}
        >
          <Info size={11} />
          Comment ça marche ?
        </button>
        {showInfo && (
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "#7A8590" }}>
            Télécharge l'état actuel dans un fichier .json à déposer dans le dossier SharePoint du chantier.
            Pour reprendre plus tard : reviens sur l'écran d'identification et clique "Reprendre un RePSS
            existant", puis choisis ce fichier.
          </p>
        )}
      </div>
    </div>
  );
}

function Accueil({ onStart, lang, setLang }) {
  return (
    <div
      className="relative rounded-xl border p-10 flex flex-col items-center text-center"
      style={{ borderColor: "#E2E5E8", minHeight: 420 }}
    >
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="absolute top-4 right-4 text-xs border rounded px-2 py-1"
        style={{ borderColor: "#D6DADE", color: "#5A646C" }}
      >
        <option value="fr">Français</option>
        <option value="nl">Nederlands</option>
        <option value="en">English</option>
      </select>

      <img src={VMA_LOGO} alt="VMA Sud" style={{ height: 48, marginBottom: 14 }} />
      <h2 className="text-xl font-semibold mb-1" style={{ color: BRAND.primary }}>
        Assistant RePSS
      </h2>
      <p className="text-sm mb-7 max-w-md" style={{ color: "#5A646C" }}>
        Générez votre réponse au PSS en quelques étapes, guidées selon votre chantier
      </p>

      <div className="text-left max-w-md w-full mb-7 flex flex-col gap-2.5">
        {[
          "Identifiez le chantier  →  l'app retrouve automatiquement un RePSS existant si vous en avez déjà commencé un",
          "Quelques critères déterminent si un RePSS abrégé suffit, ou si le complet est nécessaire",
          "Cochez les risques concernés  →  seules les catégories correspondant aux corps de métier présents sur le chantier s'affichent, une ou plusieurs selon les cas",
          "Le document se génère avec toutes les annexes requises, prêt à déposer sur SharePoint",
        ].map((t, i) => (
          <div key={i} className="flex gap-3 border rounded-lg px-3 py-2.5" style={{ borderColor: "#E2E5E8" }}>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
              style={{ background: BRAND.primary, color: "white" }}
            >
              {i + 1}
            </span>
            <p className="text-sm" style={{ color: "#3D4750" }}>
              {t}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="px-7 py-2.5 rounded text-sm font-medium mb-6"
        style={{ background: BRAND.primary, color: "white" }}
      >
        Commencer
      </button>

      <p className="text-xs" style={{ color: "#A7AFB6" }}>
        Conçu par Cédric Comblé, CP1 - Ergonome
      </p>
      <span className="absolute bottom-3 right-4 text-[11px]" style={{ color: "#C6CCD1" }}>
        By Cco
      </span>
    </div>
  );
}

function Identification({ numero, setNumero, nom, setNom, onNext }) {
  const [importInfo, setImportInfo] = useState(null);
  const fileRef = useRef(null);
  const chantierId = numero && nom ? `${numero} - ${nom}` : "";

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        const id = data?.identification?.chantierId || "";
        const [idNum, ...rest] = id.split(" - ");
        setNumero(data?.identification?.numeroChantier || idNum || "");
        setNom(data?.identification?.nomChantier || rest.join(" - ") || "");
        setImportInfo({
          numero: data?.meta?.repssNumero || "?",
          version: data?.meta?.version || "?",
          date: data?.meta?.dateDerniereModif || "?",
        });
      } catch (err) {
        setImportInfo({ error: true });
      }
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: BRAND.primary }}>
        Identification du chantier
      </h3>
      <p className="text-sm mb-4" style={{ color: "#7A8590" }}>
        Nouveau chantier, ou reprise d'un RePSS déjà commencé
      </p>

      <div className="grid grid-cols-[140px_1fr] gap-3 mb-5">
        <div>
          <label className="text-sm font-medium block mb-1.5">N° chantier</label>
          <input
            type="text"
            placeholder="12345"
            className="w-full border rounded px-3 py-2 text-sm"
            style={{ borderColor: "#D6DADE" }}
            value={numero}
            onChange={(e) => {
              setNumero(e.target.value);
              setImportInfo(null);
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Nom du chantier</label>
          <input
            type="text"
            placeholder="Rénovation site Gembloux"
            className="w-full border rounded px-3 py-2 text-sm"
            style={{ borderColor: "#D6DADE" }}
            value={nom}
            onChange={(e) => {
              setNom(e.target.value);
              setImportInfo(null);
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px" style={{ background: "#E2E5E8" }} />
        <span className="text-xs" style={{ color: "#A7AFB6" }}>
          ou
        </span>
        <div className="flex-1 h-px" style={{ background: "#E2E5E8" }} />
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 border rounded px-3 py-2.5 text-sm mb-2"
        style={{ borderColor: "#D6DADE", color: BRAND.secondary }}
      >
        <Upload size={16} />
        Reprendre un RePSS existant (fichier .json)
      </button>
      <input ref={fileRef} type="file" accept=".json" onChange={handleFile} className="hidden" />

      {importInfo && !importInfo.error && (
        <p className="text-xs mb-5" style={{ color: BRAND.secondary }}>
          Dossier importé : {importInfo.numero} · version {importInfo.version} · modifié le {importInfo.date}
        </p>
      )}
      {importInfo?.error && (
        <p className="text-xs mb-5" style={{ color: "#B3261E" }}>
          Ce fichier ne semble pas être un dossier RePSS valide.
        </p>
      )}
      {!importInfo && <div className="mb-5" />}

      <div className="flex justify-end">
        <button
          disabled={!chantierId}
          onClick={onNext}
          className="px-5 py-2 rounded text-sm font-medium disabled:opacity-40"
          style={{ background: BRAND.primary, color: "white" }}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}

function Caracterisation({ mode, setMode, corpsMetier, toggleCorpsMetier, aide, toggleAide, onBack, onNext }) {
  const aideActive = Object.values(aide).some(Boolean);
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4" style={{ color: BRAND.primary }}>
        Caractérisation du chantier
      </h3>

      <p className="text-sm font-medium mb-2">RePSS abrégé ou complet ?</p>
      <div className="flex gap-5 mb-3">
        <label className="flex items-center gap-1.5 text-sm" style={aideActive ? { color: "#A7AFB6" } : undefined}>
          <input type="radio" checked={mode === "abrege"} disabled={aideActive} onChange={() => setMode("abrege")} />
          Abrégé
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="radio" checked={mode === "complet"} onChange={() => setMode("complet")} />
          Complet
        </label>
      </div>
      {aideActive && (
        <p className="text-xs mb-3" style={{ color: "#B3261E" }}>
          Abrégé non disponible : au moins un critère ci-dessous s'applique à ce chantier.
        </p>
      )}

      <div className="rounded p-3 mb-5" style={{ background: "#F7F8F9" }}>
        <p className="text-xs mb-1.5" style={{ color: "#5A646C" }}>
          Si l'un de ces points concerne le chantier, le complet est requis
        </p>
        {[
          { key: "heures", label: "Heures de chantier < 1000" },
          { key: "hauteur", label: "Travail en hauteur ≥ 5 m" },
          { key: "ht", label: "Haute tension" },
          { key: "confine", label: "Espace confiné" },
        ].map((o) => (
          <label key={o.key} className="flex items-center gap-2 text-sm py-0.5">
            <input type="checkbox" checked={aide[o.key]} onChange={() => toggleAide(o.key)} />
            {o.label}
          </label>
        ))}
      </div>

      <p className="text-sm font-medium mb-2">Corps de métier concernés</p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {CORPS_METIER_OPTIONS.map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={corpsMetier.includes(o.id)} onChange={() => toggleCorpsMetier(o.id)} />
            {o.label}
          </label>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-5 py-2 rounded text-sm border" style={{ borderColor: "#D6DADE" }}>
          Retour
        </button>
        <button
          onClick={onNext}
          className="px-5 py-2 rounded text-sm font-medium"
          style={{ background: BRAND.primary, color: "white" }}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}

function AnalyseRisques({ corpsMetier, checked, toggleRisque, openCats, toggleCat, onBack }) {
  const visibleCats = CATALOGUE.categories.filter(
    (c) => c.corpsMetier === "universel" || corpsMetier.includes(c.corpsMetier)
  );
  const total = checked.size;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="text-lg font-semibold" style={{ color: BRAND.primary }}>
          Analyse de risques
        </h3>
        <span className="text-sm" style={{ color: "#5A646C" }}>
          {total} ligne{total > 1 ? "s" : ""} sélectionnée{total > 1 ? "s" : ""}
        </span>
      </div>
      <p className="text-xs mb-1" style={{ color: "#7A8590" }}>
        Filtré selon le corps de métier de ce chantier
      </p>
      <p className="text-xs mb-4" style={{ color: "#C6CCD1" }}>
        Prototype : seules "Mesures générales" et "HVAC - Froid" sont chargées comme exemple
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {visibleCats.map((cat) => {
          const isOpen = openCats.has(cat.id);
          const subs = CATALOGUE.sousCategories.filter((s) => s.parent === cat.id);
          return (
            <div key={cat.id} className="border rounded" style={{ borderColor: "#E2E5E8" }}>
              <button
                onClick={() => toggleCat(cat.id)}
                className="w-full flex justify-between items-center px-3 py-2.5 text-sm font-medium"
                style={{ background: "#EEF4F6", color: BRAND.secondary }}
              >
                {cat.fr}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isOpen && (
                <div className="px-3 py-3">
                  {subs.map((sub) => {
                    const acts = CATALOGUE.activites.filter((a) => a.parent === sub.id);
                    return (
                      <div key={sub.id} className="mb-4 last:mb-0">
                        <p
                          className="text-sm font-semibold mb-2 pb-1 border-b"
                          style={{ color: BRAND.primary, borderColor: "#E2E5E8" }}
                        >
                          {sub.fr}
                        </p>
                        <div className="flex flex-col gap-3 pl-3 border-l-2" style={{ borderColor: "#D6E3E8" }}>
                          {acts.map((act) => {
                            const risques = CATALOGUE.risques.filter((r) => r.parent === act.id);
                            if (risques.length === 0) return null;
                            return (
                              <div key={act.id}>
                                <p className="text-[13px] font-medium mb-1.5" style={{ color: "#3D4750" }}>
                                  {act.fr}
                                </p>
                                <div className="flex flex-col gap-0.5 pl-3 border-l-2" style={{ borderColor: "#EDEFF1" }}>
                                  {risques.map((r) => {
                                    const isChecked = checked.has(r.id);
                                    return (
                                      <label
                                        key={r.id}
                                        className="flex items-start gap-2 text-[13px] py-1 pl-2 pr-2 rounded"
                                        style={{ color: "#5A646C", ...(isChecked ? { background: "#EAF6EC", color: "#3D4750" } : {}) }}
                                      >
                                        <input
                                          type="checkbox"
                                          className="mt-0.5"
                                          style={{ accentColor: "#8FCB9B" }}
                                          checked={isChecked}
                                          onChange={() => toggleRisque(r.id)}
                                        />
                                        {r.src}
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {visibleCats.length === 1 && (
          <p className="text-xs" style={{ color: "#A7AFB6" }}>
            Coche un corps de métier à l'étape précédente pour voir apparaître d'autres catégories.
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-5 py-2 rounded text-sm border" style={{ borderColor: "#D6DADE" }}>
          Retour
        </button>
        <button className="px-5 py-2 rounded text-sm font-medium flex items-center gap-2" style={{ background: BRAND.primary, color: "white" }}>
          <FileCheck size={16} />
          Continuer vers Annexes
        </button>
      </div>
    </div>
  );
}

export default function RePSSPrototype() {
  const [screen, setScreen] = useState("accueil");
  const [lang, setLang] = useState("fr");
  const [numero, setNumero] = useState("");
  const [nom, setNom] = useState("");
  const [mode, setMode] = useState("complet");
  const [aide, setAide] = useState({ heures: false, hauteur: false, ht: false, confine: false });
  const [corpsMetier, setCorpsMetier] = useState([]);
  const [checked, setChecked] = useState(new Set());
  const [openCats, setOpenCats] = useState(new Set(["cat10_mesures_generales"]));

  function toggleCorpsMetier(id) {
    setCorpsMetier((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  function toggleAide(key) {
    setAide((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (Object.values(next).some(Boolean)) setMode("complet");
      return next;
    });
  }
  function toggleRisque(id) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleCat(id) {
    setOpenCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#EEF0F2" }}>
      <div className="w-full max-w-3xl rounded-xl overflow-hidden border shadow-sm" style={{ borderColor: "#E2E5E8", background: "white" }}>
        {screen === "accueil" ? (
          <div className="p-6">
            <Accueil onStart={() => setScreen("identification")} lang={lang} setLang={setLang} />
          </div>
        ) : (
          <div className="flex">
            <StepSidebar
              current={screen}
              numero={numero}
              nom={nom}
              mode={mode}
              corpsMetier={corpsMetier}
              checked={checked}
              onNavigate={setScreen}
            />
            <div className="flex-1 p-6">
              {screen === "identification" && (
                <Identification
                  numero={numero}
                  setNumero={setNumero}
                  nom={nom}
                  setNom={setNom}
                  onNext={() => setScreen("caracterisation")}
                />
              )}
              {screen === "caracterisation" && (
                <Caracterisation
                  mode={mode}
                  setMode={setMode}
                  corpsMetier={corpsMetier}
                  toggleCorpsMetier={toggleCorpsMetier}
                  aide={aide}
                  toggleAide={toggleAide}
                  onBack={() => setScreen("identification")}
                  onNext={() => setScreen("analyse")}
                />
              )}
              {screen === "analyse" && (
                <AnalyseRisques
                  corpsMetier={corpsMetier}
                  checked={checked}
                  toggleRisque={toggleRisque}
                  openCats={openCats}
                  toggleCat={toggleCat}
                  onBack={() => setScreen("caracterisation")}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
