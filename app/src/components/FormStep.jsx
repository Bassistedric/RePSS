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

function ApprovalRolesField({ path, roles, value, onChange, t }) {
  function contactFor(role) {
    const contact = value?.[role];
    // Les anciens dossiers stockaient uniquement le nom sous forme de chaîne.
    return typeof contact === "string" ? { nom: contact, email: "", gsm: "" } : (contact || {});
  }

  function updateContact(role, key, nextValue) {
    onChange(path, {
      ...(value || {}),
      [role]: { ...contactFor(role), [key]: nextValue },
    });
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[32rem] grid-cols-[minmax(10rem,1.2fr)_minmax(8.5rem,1fr)_minmax(7.5rem,0.8fr)] gap-x-4 gap-y-3 items-end">
        <span className="text-sm font-medium" style={{ color: colors.neutralText }}>{t("tbl_nom")}</span>
        <span className="text-sm font-medium" style={{ color: colors.neutralText }}>{t("tbl_email")}</span>
        <span className="text-sm font-medium" style={{ color: colors.neutralText }}>{t("gsm")}</span>
        {roles.map((role) => {
          const contact = contactFor(role);
          return (
            <div key={role} className="contents">
              <label className="text-sm font-medium">
                <span className="block mb-1.5">{t(role)}</span>
                <input type="text" autoComplete="off" className={INPUT_CLASS} style={INPUT_STYLE} value={contact.nom ?? ""} onChange={(e) => updateContact(role, "nom", e.target.value)} />
              </label>
              {/* autoComplete="off" : sans ça, le navigateur propose/renseigne le même
                  email/tél. enregistré (souvent celui de la personne qui remplit)
                  sur toutes les lignes de rôles variables au lieu de laisser vide. */}
              <input aria-label={`${t(role)} – ${t("tbl_email")}`} type="email" autoComplete="off" className={INPUT_CLASS} style={INPUT_STYLE} value={contact.email ?? ""} onChange={(e) => updateContact(role, "email", e.target.value)} />
              <input aria-label={`${t(role)} – ${t("gsm")}`} type="tel" autoComplete="off" className={INPUT_CLASS} style={INPUT_STYLE} value={contact.gsm ?? ""} onChange={(e) => updateContact(role, "gsm", e.target.value)} />
            </div>
          );
        })}
      </div>
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
          rows={3}
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
