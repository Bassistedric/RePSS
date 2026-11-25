import { Plus, Trash2 } from "lucide-react";
import { getPath, setPath } from "../lib/paths";
import { colors } from "../lib/colors";
import ScreenTitle from "./ScreenTitle";

const INPUT_CLASS = "w-full border rounded px-3.5 py-2.5 text-sm";
const INPUT_STYLE = { borderColor: colors.neutralBorderStrong, background: "white" };

function TableField({ path, columns, value, onChange, t }) {
  const rows = value || [];

  function updateRow(i, key, val) {
    const next = rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r));
    onChange(path, next);
  }
  function addRow() {
    const empty = Object.fromEntries(columns.map((c) => [c.key, ""]));
    onChange(path, [...rows, empty]);
  }
  function removeRow(i) {
    onChange(path, rows.filter((_, idx) => idx !== i));
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse mb-3">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left text-sm font-medium pb-2 pr-3" style={{ color: colors.neutralText }}>
                {t(c.labelKey)}
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} className="pr-3 pb-3">
                  <input
                    type={c.type === "number" ? "number" : c.type === "date" ? "date" : "text"}
                    className={INPUT_CLASS}
                    style={INPUT_STYLE}
                    value={row[c.key] ?? ""}
                    onChange={(e) => updateRow(i, c.key, e.target.value)}
                  />
                </td>
              ))}
              <td className="pb-3">
                <button type="button" onClick={() => removeRow(i)} style={{ color: colors.neutralText }}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1.5 text-sm"
        style={{ color: colors.blue }}
      >
        <Plus size={14} /> {t("bouton_ajouter_ligne")}
      </button>
    </div>
  );
}

function approvalEntriesFor(value, role) {
  const raw = value?.[role];
  // Compatibilité avec les anciens formats (objet unique, ou simple chaîne pour le
  // nom) : dossier.js > normalizeDossier() s'en occupe déjà à l'import, mais ce
  // repli couvre aussi un dossier en cours d'édition pas encore passé par là.
  if (Array.isArray(raw)) return raw.length ? raw : [{ entite: "", nom: "", email: "", gsm: "" }];
  if (raw && typeof raw === "object") return [raw];
  if (typeof raw === "string" && raw) return [{ entite: "", nom: raw, email: "", gsm: "" }];
  return [{ entite: "", nom: "", email: "", gsm: "" }];
}

// Un rôle variable peut être porté par plusieurs sociétés momentanées sur un même
// chantier (ex. "sud"/"nord") : chaque rôle est un tableau d'entrées plutôt qu'un
// contact unique. Le champ "Entité" reste masqué tant qu'il n'y a qu'une seule
// entrée (ambigu sinon : pas la peine de nommer une société momentanée s'il n'y en
// a qu'une).
function ApprovalRolesField({ path, roles, value, onChange, t }) {
  function updateRole(role, nextEntries) {
    onChange(path, { ...(value || {}), [role]: nextEntries });
  }
  function updateEntry(role, idx, key, nextValue) {
    const entries = approvalEntriesFor(value, role);
    updateRole(role, entries.map((e, i) => (i === idx ? { ...e, [key]: nextValue } : e)));
  }
  function addEntry(role) {
    updateRole(role, [...approvalEntriesFor(value, role), { entite: "", nom: "", email: "", gsm: "" }]);
  }
  function removeEntry(role, idx) {
    const entries = approvalEntriesFor(value, role);
    if (entries.length <= 1) return;
    updateRole(role, entries.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-6">
      {roles.map((role) => {
        const entries = approvalEntriesFor(value, role);
        const multiple = entries.length > 1;
        return (
          <div key={role} className="flex flex-col gap-2.5">
            <span className="text-sm font-medium" style={{ color: colors.neutralTextStrong }}>{t(role)}</span>
            {entries.map((entry, idx) => (
              <div key={idx} className="flex flex-wrap items-end gap-3">
                {multiple && (
                  <label className="text-sm" style={{ width: "7.5rem" }}>
                    <span className="block mb-1.5 font-medium" style={{ color: colors.neutralText }}>{t("entite_label")}</span>
                    <input
                      type="text"
                      placeholder={t("entite_placeholder")}
                      className={INPUT_CLASS}
                      style={INPUT_STYLE}
                      value={entry.entite ?? ""}
                      onChange={(e) => updateEntry(role, idx, "entite", e.target.value)}
                    />
                  </label>
                )}
                <label className="text-sm flex-1" style={{ minWidth: "10rem" }}>
                  <span className="block mb-1.5 font-medium" style={{ color: colors.neutralText }}>{t("tbl_nom")}</span>
                  {/* autoComplete="off" : sans ça, le navigateur propose/renseigne le
                      même nom/email/tél. enregistré sur toutes les lignes de rôles
                      variables au lieu de laisser vide. */}
                  <input type="text" autoComplete="off" className={INPUT_CLASS} style={INPUT_STYLE} value={entry.nom ?? ""} onChange={(e) => updateEntry(role, idx, "nom", e.target.value)} />
                </label>
                <label className="text-sm flex-1" style={{ minWidth: "9rem" }}>
                  <span className="block mb-1.5 font-medium" style={{ color: colors.neutralText }}>{t("tbl_email")}</span>
                  <input type="email" autoComplete="off" className={INPUT_CLASS} style={INPUT_STYLE} value={entry.email ?? ""} onChange={(e) => updateEntry(role, idx, "email", e.target.value)} />
                </label>
                <label className="text-sm flex-1" style={{ minWidth: "8rem" }}>
                  <span className="block mb-1.5 font-medium" style={{ color: colors.neutralText }}>{t("gsm")}</span>
                  <input type="tel" autoComplete="off" className={INPUT_CLASS} style={INPUT_STYLE} value={entry.gsm ?? ""} onChange={(e) => updateEntry(role, idx, "gsm", e.target.value)} />
                </label>
                {multiple && (
                  <button
                    type="button"
                    onClick={() => removeEntry(role, idx)}
                    className="pb-2.5"
                    aria-label={t("bouton_retirer_entite")}
                    style={{ color: colors.neutralText }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addEntry(role)}
              className="flex items-center gap-1.5 text-sm self-start"
              style={{ color: colors.blue }}
            >
              <Plus size={14} /> {t("bouton_ajouter_societe_momentanee")}
            </button>
          </div>
        );
      })}
    </div>
  );
}

const TRISTATE_OPTIONS = [
  { value: "interne", labelKey: "tristate_interne" },
  { value: "client", labelKey: "tristate_client" },
  { value: "na", labelKey: "tristate_na" },
];

function TriStateField({ path, value, onChange, t }) {
  return (
    <div className="inline-flex rounded border overflow-hidden" style={{ borderColor: colors.neutralBorderStrong }}>
      {TRISTATE_OPTIONS.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(path, active ? null : o.value)}
            className="px-3.5 py-2 text-sm"
            style={{
              background: active ? colors.blue : "white",
              color: active ? "white" : colors.neutralText,
              borderRight: o.value !== "na" ? `1px solid ${colors.neutralBorderStrong}` : undefined,
            }}
          >
            {t(o.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

function Field({ field, dossier, onChange, t }) {
  const value = getPath(dossier, field.path);

  if (field.type === "table") {
    return <TableField path={field.path} columns={field.columns} value={value} onChange={onChange} t={t} />;
  }

  if (field.type === "approvalRoles") {
    return <ApprovalRolesField path={field.path} roles={field.roles} value={value} onChange={onChange} t={t} />;
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm py-1.5">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(field.path, e.target.checked)} />
        {field.labelKey ? t(field.labelKey) : field.label}
      </label>
    );
  }

  if (field.type === "tristate") {
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <span className="text-sm">{field.labelKey ? t(field.labelKey) : field.label}</span>
        <TriStateField path={field.path} value={value} onChange={onChange} t={t} />
      </div>
    );
  }

  if (field.type === "readonly") {
    return (
      <div>
        {field.labelKey && <label className="text-sm font-medium block mb-1.5" style={{ color: colors.neutralText }}>{t(field.labelKey)}</label>}
        <p className="text-sm" style={{ color: colors.neutralTextStrong }}>{value || t("non_renseigne")}</p>
      </div>
    );
  }

  const label = field.labelKey ? t(field.labelKey) : field.label ?? null;

  return (
    <div>
      {label && <label className="text-sm font-medium block mb-2">{label}</label>}
      {field.type === "textarea" ? (
        <textarea
          className={INPUT_CLASS}
          style={INPUT_STYLE}
          rows={field.rows || 3}
          value={value ?? ""}
          onChange={(e) => onChange(field.path, e.target.value)}
        />
      ) : (
        <input
          type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
          className={INPUT_CLASS}
          style={INPUT_STYLE}
          value={value ?? ""}
          onChange={(e) => onChange(field.path, e.target.value)}
        />
      )}
    </div>
  );
}

// `nested` : quand ce FormStep est lui-même à l'intérieur d'une autre carte déjà
// teintée (ex. dérogations PSS dans Infos admin.), ses groupes restent blancs pour
// rester lisibles sur ce fond au lieu d'empiler deux teintes identiques.
export default function FormStep({ schema, dossier, setDossier, t, title, nested }) {
  function onChange(path, value) {
    setDossier((prev) => setPath(prev, path, value));
  }

  return (
    <div>
      {title && <ScreenTitle title={title} />}
      <div className="flex flex-col gap-7">
        {schema.map((group, gi) => (
          <div
            key={gi}
            className="border rounded-lg p-5"
            style={{ borderColor: colors.neutralBorder, background: nested ? "white" : colors.neutralBgSubtle }}
          >
            {group.titleKey && (
              <p className="text-base font-semibold mb-4" style={{ color: colors.blue }}>
                {t(group.titleKey)}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              {group.fields.map((field) => {
                const isWide = field.type === "table" || field.type === "approvalRoles" || field.type === "textarea" || field.wide;
                return (
                  <div key={field.path} className={isWide ? "sm:col-span-2" : ""}>
                    <Field field={field} dossier={dossier} onChange={onChange} t={t} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
