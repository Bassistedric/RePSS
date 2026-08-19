import { colors } from "../lib/colors";

// Niveau 1 de la hiérarchie typographique (3 niveaux, cohérents dans toute
// l'app) : titre d'écran, encadré, en navy (couleur d'accent dédiée à ce
// rôle — jamais réutilisée pour un sous-titre de section). `aside` accueille
// un complément aligné à droite (ex. compteur de sélection).
export default function ScreenTitle({ title, subtitle, aside }) {
  return (
    <div
      className="mb-6 px-5 py-4 rounded-lg border flex items-start justify-between gap-4"
      style={{ borderColor: colors.neutralBorder, background: colors.neutralBgSubtle }}
    >
      <div>
        <h3 className="text-xl font-bold" style={{ color: colors.navy }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: colors.neutralText }}>
            {subtitle}
          </p>
        )}
      </div>
      {aside && (
        <div className="text-sm shrink-0 pt-1" style={{ color: colors.neutralText }}>
          {aside}
        </div>
      )}
    </div>
  );
}
