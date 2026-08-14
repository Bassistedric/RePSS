import { logoUrl } from "../lib/contentPack";

export default function Accueil({ onStart, lang, setLang, entreprise }) {
  const brand = entreprise?.branding || {};

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

      {brand.logo && <img src={logoUrl(brand.logo)} alt={entreprise?.identite?.nomAffichage} style={{ height: 48, marginBottom: 14 }} />}
      <h2 className="text-xl font-semibold mb-1" style={{ color: brand.couleurPrincipale || "#0B3040" }}>
        Assistant RePSS
      </h2>
      <p className="text-sm mb-7 max-w-md" style={{ color: "#5A646C" }}>
        Générez votre réponse au PSS en quelques étapes, guidées selon votre chantier
      </p>

      <div className="text-left max-w-md w-full mb-7 flex flex-col gap-2.5">
        {[
          "Identifiez le chantier  →  l'app retrouve automatiquement un RePSS existant si vous en avez déjà commencé un",
          "Quelques critères déterminent si un RePSS abrégé suffit, ou si le complet est nécessaire",
          "Cochez les activités concernées  →  seules les catégories correspondant aux corps de métier présents sur le chantier s'affichent",
          "Le document se génère avec toutes les annexes requises, prêt à déposer sur SharePoint",
        ].map((text, i) => (
          <div key={i} className="flex gap-3 border rounded-lg px-3 py-2.5" style={{ borderColor: "#E2E5E8" }}>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
              style={{ background: brand.couleurPrincipale || "#0B3040", color: "white" }}
            >
              {i + 1}
            </span>
            <p className="text-sm" style={{ color: "#3D4750" }}>
              {text}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="px-7 py-2.5 rounded text-sm font-medium mb-2"
        style={{ background: brand.couleurPrincipale || "#0B3040", color: "white" }}
      >
        Commencer
      </button>
    </div>
  );
}
