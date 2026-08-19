import { logoUrl } from "../lib/contentPack";
import FlagIcon from "./FlagIcon";
import { colors } from "../lib/colors";

const LANGUES = [
  { code: "fr", label: "Français" },
  { code: "nl", label: "Nederlands" },
  { code: "en", label: "English" },
];

export default function Accueil({ onStart, lang, setLang, entreprise, t }) {
  const brand = entreprise?.branding || {};

  return (
    <div
      className="relative rounded-xl border p-12 flex flex-col items-center text-center"
      style={{ borderColor: colors.neutralBorder, minHeight: 440 }}
    >
      <div className="absolute top-5 right-5 flex gap-1.5">
        {LANGUES.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            title={l.label}
            aria-label={l.label}
            className="w-9 h-9 rounded flex items-center justify-center border"
            style={{
              borderColor: lang === l.code ? colors.navy : colors.neutralBorderStrong,
              background: lang === l.code ? colors.navyTint : "white",
            }}
          >
            <FlagIcon code={l.code} />
          </button>
        ))}
      </div>

      {brand.logo && <img src={logoUrl(brand.logo)} alt={entreprise?.identite?.nomAffichage} style={{ height: 52, marginBottom: 16 }} />}
      <h2 className="text-2xl font-bold mb-1.5" style={{ color: brand.couleurPrincipale || colors.navy }}>
        Assistant RePSS
      </h2>
      <p className="text-base mb-8 max-w-md" style={{ color: colors.neutralText }}>
        {t("accueil_intro")}
      </p>

      <div className="text-left max-w-md w-full mb-8 flex flex-col gap-3">
        {["accueil_etape1", "accueil_etape2", "accueil_etape3", "accueil_etape4"].map((key, i) => (
          <div
            key={key}
            className="flex gap-3 border rounded-lg px-4 py-3"
            style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
              style={{ background: brand.couleurPrincipale || colors.navy, color: "white" }}
            >
              {i + 1}
            </span>
            <p className="text-sm" style={{ color: colors.neutralTextStrong }}>
              {t(key)}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="px-8 py-3 rounded text-base font-medium mb-6"
        style={{ background: brand.couleurPrincipale || colors.navy, color: "white" }}
      >
        {t("accueil_bouton_commencer")}
      </button>

      <p className="text-sm" style={{ color: colors.neutralText }}>
        {t("accueil_credits")}
      </p>
      <span className="absolute bottom-3 right-4 text-xs" style={{ color: colors.neutralText }}>
        By Cco
      </span>
    </div>
  );
}
