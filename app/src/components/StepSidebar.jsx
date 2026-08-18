import { useState } from "react";
import { Check, Circle, CheckCircle2, Save, Info, Home } from "lucide-react";
import { getSteps } from "../lib/steps";
import { INFOS_ADMIN_TABS } from "../lib/infosAdminTabs";
import { colors } from "../lib/colors";

export default function StepSidebar({ current, dossier, onNavigate, onSave, t, infosAdminTab, setInfosAdminTab }) {
  const STEPS = getSteps(dossier.triage.modeChoisi);
  const currentIndex = STEPS.findIndex((s) => s.key === current);
  const [showInfo, setShowInfo] = useState(false);
  const { numeroChantier, nomChantier } = dossier.identification;
  const chantierLabel =
    numeroChantier && nomChantier ? `${numeroChantier} - ${nomChantier}` : numeroChantier || nomChantier || "Chantier";

  return (
    <div className="w-56 shrink-0 border-r p-4 flex flex-col" style={{ background: colors.neutralBgSubtle, borderColor: colors.neutralBorder }}>
      <p className="text-xs mb-4 truncate" style={{ color: colors.neutralText }}>
        {chantierLabel}
      </p>
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        <button
          onClick={() => onNavigate("accueil")}
          className="flex items-center gap-2 px-2 py-2 rounded text-sm text-left mb-1"
          style={{ color: colors.neutralText }}
        >
          <Home size={16} />
          {t("step_accueil")}
        </button>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < currentIndex;
          const active = s.key === current;
          const reachable = i <= currentIndex;
          const label = t(s.labelKey);
          return (
            <div key={s.key}>
              <button
                onClick={() => reachable && onNavigate(s.key)}
                disabled={!reachable}
                className="w-full flex items-center gap-2 px-2 py-2 rounded text-sm text-left"
                style={{
                  cursor: reachable ? "pointer" : "default",
                  ...(active
                    ? { background: colors.navyTint, color: colors.navy, fontWeight: 500 }
                    : { color: done ? colors.neutralTextStrong : colors.neutralText }),
                }}
              >
                {done ? <Check size={16} /> : active ? <Icon size={16} /> : <Circle size={16} />}
                <span className="truncate">{label}</span>
              </button>
              {/* Sous-menu dépliable : seule "Infos admin." a des sous-sections, et
                  uniquement affiché tant que cette étape est active. */}
              {s.key === "infosAdmin" && active && (
                <div className="flex flex-col gap-0.5 mt-0.5 mb-1 ml-3 pl-2 border-l" style={{ borderColor: colors.neutralBorderStrong }}>
                  {INFOS_ADMIN_TABS.map((tb) => {
                    const tabActive = infosAdminTab === tb.key;
                    const complete = tb.isComplete(dossier);
                    return (
                      <button
                        key={tb.key}
                        onClick={() => setInfosAdminTab(tb.key)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-left"
                        style={
                          tabActive
                            ? { background: colors.navyTint, color: colors.navy, fontWeight: 500 }
                            : { color: colors.neutralText }
                        }
                      >
                        {complete ? (
                          <CheckCircle2 size={13} style={{ color: colors.success }} />
                        ) : (
                          <Circle size={13} style={{ color: colors.neutralBorderStrong }} />
                        )}
                        <span className="truncate">{t(tb.labelKey)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t" style={{ borderColor: colors.neutralBorder }}>
        <button
          onClick={onSave}
          disabled={!numeroChantier && !nomChantier}
          className="w-full flex items-center justify-center gap-2 text-xs px-3 py-2 rounded border disabled:opacity-40"
          style={{ borderColor: colors.blue, color: colors.blue }}
        >
          <Save size={14} />
          {t("bouton_enregistrer")}
        </button>
        <button
          onClick={() => setShowInfo((v) => !v)}
          className="flex items-center gap-1 text-[11px] mt-1.5 mx-auto"
          style={{ color: colors.neutralText }}
        >
          <Info size={11} />
          {t("comment_ca_marche")}
        </button>
        {showInfo && (
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: colors.neutralText }}>
            {t("sidebar_info_text")}
          </p>
        )}
      </div>
    </div>
  );
}
