import { logoUrl } from "../lib/contentPack";

const LANGUES = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "nl", flag: "🇳🇱", label: "Nederlands" },
  { code: "en", flag: "🇬🇧", label: "English" },
];

export default function Accueil({ onStart, lang, setLang, entreprise, t }) {
  const brand = entreprise?.branding || {};

  return (
    <div
      className="relative rounded-xl border p-10 flex flex-col items-center text-center"
      style={{ borderColor: "#E2E5E8", minHeight: 420 }}
    >
      <div className="absolute top-4 right-4 flex gap-1">
        {LANGUES.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            title={l.label}
            aria-label={l.label}
            className="w-8 h-8 rounded flex items-center justify-center text-base border"
            style={{
              borderColor: lang === l.code ? "#0B3040" : "#D6DADE",
              background: lang === l.code ? "#E7EEF1" : "white",
            }}
          >
            {l.flag}
          </button>
        ))}
      </div>

      {brand.logo && <img src={logoUrl(brand.logo)} alt={entreprise?.identite?.nomAffichage} style={{ height: 48, marginBottom: 14 }} />}
      <h2 className="text-xl font-semibold mb-1" style={{ color: brand.couleurPrincipale || "#0B3040" }}>
        Assistant RePSS
      </h2>
      <p className="text-sm mb-7 max-w-md" style={{ color: "#5A646C" }}>
        {t("accueil_intro")}
      </p>

      <div className="text-left max-w-md w-full mb-7 flex flex-col gap-2.5">
        {["accueil_etape1", "accueil_etape2", "accueil_etape3", "accueil_etape4"].map((key, i) => (
          <div key={key} className="flex gap-3 border rounded-lg px-3 py-2.5" style={{ borderColor: "#E2E5E8" }}>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
              style={{ background: brand.couleurPrincipale || "#0B3040", color: "white" }}
            >
              {i + 1}
            </span>
            <p className="text-sm" style={{ color: "#3D4750" }}>
              {t(key)}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="px-7 py-2.5 rounded text-sm font-medium mb-6"
        style={{ background: brand.couleurPrincipale || "#0B3040", color: "white" }}
      >
        {t("accueil_bouton_commencer")}
      </button>

      <p className="text-xs" style={{ color: "#5A646C" }}>
        {t("accueil_credits")}
      </p>
      <span className="absolute bottom-3 right-4 text-[11px]" style={{ color: "#5A646C" }}>
        By Cco
      </span>
    </div>
  );
}
