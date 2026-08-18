import { Plus, Trash2 } from "lucide-react";
import { getPath, setPath } from "../lib/paths";

const INPUT_CLASS = "w-full border rounded px-3 py-2 text-sm";
const INPUT_STYLE = { borderColor: "#D6DADE" };

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
      <table className="w-full text-sm border-collapse mb-2">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left text-xs font-medium pb-1.5 pr-2" style={{ color: "#5A646C" }}>
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
                <td key={c.key} className="pr-2 pb-2">
                  <input
                    type={c.type === "number" ? "number" : c.type === "date" ? "date" : "text"}
                    className={INPUT_CLASS}
                    style={INPUT_STYLE}
                    value={row[c.key] ?? ""}
                    onChange={(e) => updateRow(i, c.key, e.target.value)}
                  />
                </td>
              ))}
              <td className="pb-2">
                <button type="button" onClick={() => removeRow(i)} style={{ color: "#B3261E" }}>
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
        className="flex items-center gap-1 text-xs"
        style={{ color: "#156082" }}
      >
        <Plus size={14} /> {t("bouton_ajouter_ligne")}
      </button>
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
    <div className="inline-flex rounded border overflow-hidden" style={{ borderColor: "#D6DADE" }}>
      {TRISTATE_OPTIONS.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(path, active ? null : o.value)}
            className="px-3 py-1.5 text-xs"
            style={{
              background: active ? "#0B3040" : "white",
              color: active ? "white" : "#5A646C",
              borderRight: o.value !== "na" ? "1px solid #D6DADE" : undefined,
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

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm py-1">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(field.path, e.target.checked)} />
        {field.labelKey ? t(field.labelKey) : field.label}
      </label>
    );
  }

  if (field.type === "tristate") {
    return (
      <div className="flex flex-col gap-1 py-1">
        <span className="text-sm">{field.labelKey ? t(field.labelKey) : field.label}</span>
        <TriStateField path={field.path} value={value} onChange={onChange} t={t} />
      </div>
    );
  }

  if (field.type === "readonly") {
    return (
      <div>
        {field.labelKey && <label className="text-sm font-medium block mb-1" style={{ color: "#5A646C" }}>{t(field.labelKey)}</label>}
        <p className="text-sm" style={{ color: "#3D4750" }}>{value || t("non_renseigne")}</p>
      </div>
    );
  }

  const label = field.labelKey ? t(field.labelKey) : field.label ?? null;

  return (
    <div>
      {label && <label className="text-sm font-medium block mb-1.5">{label}</label>}
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

export default function FormStep({ schema, dossier, setDossier, t, title }) {
  function onChange(path, value) {
    setDossier((prev) => setPath(prev, path, value));
  }

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#0B3040" }}>
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-6">
        {schema.map((group, gi) => (
          <div key={gi} className="border rounded-lg p-4" style={{ borderColor: "#E2E5E8" }}>
            {group.titleKey && (
              <p className="text-sm font-semibold mb-3" style={{ color: "#156082" }}>
                {t(group.titleKey)}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {group.fields.map((field) => {
                const isWide = field.type === "table" || field.type === "textarea";
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
