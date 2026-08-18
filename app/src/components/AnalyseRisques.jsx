import { useState } from "react";
import { ChevronDown, ChevronUp, FileCheck } from "lucide-react";
import MoadrSection from "./MoadrSection";

// §6 : la case à cocher est la ligne de risque, jamais l'activité. L'activité est un
// simple sous-titre qui regroupe ses lignes, toujours affichées (pas de repli
// supplémentaire, médiane 2 lignes/activité, max 8). Seuls catégorie et
// sous-catégorie sont pliables/dépliables.
function ActiviteBlock({ activite, lignesRisque, isChecked, toggle, remarque, setRemarque }) {
  return (
    <div className="mb-3 last:mb-0 pl-3 border-l-2" style={{ borderColor: "#D6E3E8" }}>
      <p className="text-[13px] font-medium mb-1.5" style={{ color: "#3D4750" }}>
        {activite.fr}
      </p>
      <div className="flex flex-col gap-1 pl-3 border-l-2" style={{ borderColor: "#EDEFF1" }}>
        {lignesRisque.map((r) => {
          const checked = isChecked(r.id);
          return (
            <div key={r.id}>
              <label
                className="flex items-start gap-2 text-[13px] py-1 pl-2 pr-2 rounded"
                style={{ color: "#5A646C", ...(checked ? { background: "#EAF6EC", color: "#3D4750" } : {}) }}
              >
                <input
                  type="checkbox"
                  className="mt-0.5"
                  style={{ accentColor: "#8FCB9B" }}
                  checked={checked}
                  onChange={() => toggle(r.id)}
                />
                {r.sourceDanger}
              </label>
              {checked && (
                <input
                  type="text"
                  placeholder="Remarque (optionnel)"
                  className="ml-7 mb-1 border rounded px-2 py-1 text-xs"
                  style={{ borderColor: "#D6DADE", width: "calc(100% - 1.75rem)" }}
                  value={remarque(r.id)}
                  onChange={(e) => setRemarque(r.id, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CatalogueComplet({ catalogue, corpsMetier, isChecked, toggle, remarque, setRemarque }) {
  const [openCats, setOpenCats] = useState(new Set());
  const [openSubs, setOpenSubs] = useState(new Set());
  const visibleCats = catalogue.categories.filter(
    (c) => c.corps_metier === "universel" || corpsMetier.includes(c.corps_metier)
  );

  function toggleSet(setter) {
    return (id) =>
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
  }
  const toggleCat = toggleSet(setOpenCats);
  const toggleSub = toggleSet(setOpenSubs);

  return (
    <div className="flex flex-col gap-2 mb-4">
      {visibleCats.map((cat) => {
        const isOpen = openCats.has(cat.id);
        const subs = catalogue.sousCategories.filter((s) => s.parent === cat.id);
        return (
          <div key={cat.id} className="border rounded" style={{ borderColor: "#E2E5E8" }}>
            <button
              onClick={() => toggleCat(cat.id)}
              className="w-full flex justify-between items-center px-3 py-2.5 text-sm font-medium"
              style={{ background: "#EEF4F6", color: "#156082" }}
            >
              {cat.fr}
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isOpen && (
              <div className="px-3 py-3">
                {subs.map((sub) => {
                  const subOpen = openSubs.has(sub.id);
                  const acts = catalogue.activites.filter((a) => a.parent === sub.id);
                  return (
                    <div key={sub.id} className="mb-2 last:mb-0 border rounded" style={{ borderColor: "#EDEFF1" }}>
                      <button
                        onClick={() => toggleSub(sub.id)}
                        className="w-full flex justify-between items-center px-2.5 py-2 text-sm font-semibold border-b"
                        style={{ color: "#0B3040", borderColor: subOpen ? "#E2E5E8" : "transparent" }}
                      >
                        {sub.fr}
                        {subOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      {subOpen && (
                        <div className="p-2.5">
                          {acts.map((act) => (
                            <ActiviteBlock
                              key={act.id}
                              activite={act}
                              lignesRisque={catalogue.lignesRisque.filter((r) => r.parent === act.id)}
                              isChecked={isChecked}
                              toggle={toggle}
                              remarque={remarque}
                              setRemarque={setRemarque}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      {visibleCats.every((c) => c.corps_metier === "universel") && (
        <p className="text-xs" style={{ color: "#5A646C" }}>
          Coche un corps de métier à l'étape précédente pour voir apparaître d'autres catégories.
        </p>
      )}
    </div>
  );
}

function CatalogueAbrege({ catalogue, isChecked, toggle }) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      {catalogue.categories.map((cat) => (
        <div key={cat.id}>
          <p className="text-sm font-semibold mb-2 pb-1 border-b" style={{ color: "#0B3040", borderColor: "#E2E5E8" }}>
            {cat.fr}
          </p>
          <div className="flex flex-col gap-0.5">
            {catalogue.risques
              .filter((r) => r.categorieId === cat.id)
              .map((r) => {
                const disabled = r.risqueAggrave;
                return (
                  <label
                    key={r.id}
                    className="flex items-start gap-2 text-[13px] py-1"
                    style={{ color: disabled ? "#5A646C" : "#3D4750" }}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={isChecked(r.id)}
                      disabled={disabled}
                      onChange={() => toggle(r.id)}
                    />
                    <span style={disabled ? { textDecoration: "line-through" } : undefined}>
                      {r.sourceDanger} : {r.mesure}
                      {disabled && (
                        <span className="block text-[11px]" style={{ color: "#B3261E", textDecoration: "none" }}>
                          Non couvert par l'abrégé, nécessite le RePSS complet.
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyseRisques({ dossier, setDossier, catalogueComplet, catalogueAbrege, onBack, onNext }) {
  const { modeChoisi } = dossier.triage;
  const { corpsMetier } = dossier.caracterisation;
  const itemsCoches = dossier.analyseRisques.itemsCoches;

  function isChecked(id) {
    return itemsCoches.some((i) => i.risqueId === id);
  }
  function toggle(id) {
    const next = isChecked(id)
      ? itemsCoches.filter((i) => i.risqueId !== id)
      : [...itemsCoches, { risqueId: id, remarques: "" }];
    setDossier((prev) => ({ ...prev, analyseRisques: { itemsCoches: next } }));
  }
  function remarque(id) {
    return itemsCoches.find((i) => i.risqueId === id)?.remarques ?? "";
  }
  function setRemarque(id, text) {
    const next = itemsCoches.map((i) => (i.risqueId === id ? { ...i, remarques: text } : i));
    setDossier((prev) => ({ ...prev, analyseRisques: { itemsCoches: next } }));
  }

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="text-lg font-semibold" style={{ color: "#0B3040" }}>
          {modeChoisi === "abrege" ? "Risques & mesures" : "Analyse de risques"}
        </h3>
        <span className="text-sm" style={{ color: "#5A646C" }}>
          {itemsCoches.length} sélectionnée{itemsCoches.length > 1 ? "s" : ""}
        </span>
      </div>
      <p className="text-xs mb-4" style={{ color: "#5A646C" }}>
        {modeChoisi === "abrege"
          ? "Catalogue abrégé : coche les dangers présents sur le chantier."
          : "Filtré selon le corps de métier de ce chantier → coche les lignes de risque concernées."}
      </p>

      {modeChoisi === "abrege" ? (
        <CatalogueAbrege catalogue={catalogueAbrege} isChecked={isChecked} toggle={toggle} />
      ) : (
        <CatalogueComplet
          catalogue={catalogueComplet}
          corpsMetier={corpsMetier}
          isChecked={isChecked}
          toggle={toggle}
          remarque={remarque}
          setRemarque={setRemarque}
        />
      )}

      <MoadrSection dossier={dossier} setDossier={setDossier} />

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="px-5 py-2 rounded text-sm border" style={{ borderColor: "#D6DADE" }}>
          Retour
        </button>
        <button onClick={onNext} className="px-5 py-2 rounded text-sm font-medium flex items-center gap-2" style={{ background: "#0B3040", color: "white" }}>
          <FileCheck size={16} />
          Continuer
        </button>
      </div>
    </div>
  );
}
