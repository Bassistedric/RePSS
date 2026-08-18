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
      className="relative rounded-xl border p-10 flex flex-col items-center text-center"
      style={{ borderColor: colors.neutralBorder, minHeight: 420 }}
    >
      <div className="absolute top-4 right-4 flex gap-1">
        {LANGUES.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            title={l.label}
            aria-label={l.label}
            className="w-8 h-8 rounded flex items-center justify-center border"
            style={{
              borderColor: lang === l.code ? colors.navy : colors.neutralBorderStrong,
              background: lang === l.code ? colors.navyTint : "white",
            }}
          >
            <FlagIcon code={l.code} />
          </button>
        ))}
      </div>

      {brand.logo && <img src={logoUrl(brand.logo)} alt={entreprise?.identite?.nomAffichage} style={{ height: 48, marginBottom: 14 }} />}
      <h2 className="text-xl font-semibold mb-1" style={{ color: brand.couleurPrincipale || colors.navy }}>
        Assistant RePSS
      </h2>
      <p className="text-sm mb-7 max-w-md" style={{ color: colors.neutralText }}>
        {t("accueil_intro")}
      </p>

      <div className="text-left max-w-md w-full mb-7 flex flex-col gap-2.5">
        {["accueil_etape1", "accueil_etape2", "accueil_etape3", "accueil_etape4"].map((key, i) => (
          <div key={key} className="flex gap-3 border rounded-lg px-3 py-2.5" style={{ borderColor: colors.neutralBorder }}>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
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
        className="px-7 py-2.5 rounded text-sm font-medium mb-6"
        style={{ background: brand.couleurPrincipale || colors.navy, color: "white" }}
      >
        {t("accueil_bouton_commencer")}
      </button>

      <p className="text-xs" style={{ color: colors.neutralText }}>
        {t("accueil_credits")}
      </p>
      <span className="absolute bottom-3 right-4 text-[11px]" style={{ color: colors.neutralText }}>
        By Cco
      </span>
    </div>
  );
}
