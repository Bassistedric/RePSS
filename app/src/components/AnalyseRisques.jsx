import { useState } from "react";
import { ChevronDown, ChevronUp, FileCheck } from "lucide-react";

function ActiviteRow({ activite, risques, checked, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex items-start gap-2">
        <label className="flex items-start gap-2 text-[13px] py-1 flex-1" style={{ color: "#3D4750" }}>
          <input type="checkbox" className="mt-0.5" checked={checked} onChange={() => onToggle(activite.id)} />
          <span className="font-medium">{activite.fr}</span>
        </label>
        {risques.length > 0 && (
          <button onClick={() => setExpanded((v) => !v)} style={{ color: "#A7AFB6" }} className="shrink-0">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>
      {expanded && (
        <div className="pl-6 flex flex-col gap-2 mt-1">
          {risques.map((r) => (
            <div key={r.id} className="text-xs border-l-2 pl-2" style={{ borderColor: "#EDEFF1", color: "#5A646C" }}>
              <p className="font-medium" style={{ color: "#3D4750" }}>
                {r.sourceDanger}
              </p>
              <p className="whitespace-pre-line">{r.mesuresPrevention}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CatalogueComplet({ catalogue, corpsMetier, checked, toggleActivite }) {
  const [openCats, setOpenCats] = useState(new Set());
  const visibleCats = catalogue.categories.filter(
    (c) => c.corps_metier === "universel" || corpsMetier.includes(c.corps_metier)
  );

  function toggleCat(id) {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-2 mb-6">
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
                  const acts = catalogue.activites.filter((a) => a.parent === sub.id);
                  return (
                    <div key={sub.id} className="mb-4 last:mb-0">
                      <p className="text-sm font-semibold mb-2 pb-1 border-b" style={{ color: "#0B3040", borderColor: "#E2E5E8" }}>
                        {sub.fr}
                      </p>
                      <div className="flex flex-col pl-1">
                        {acts.map((act) => (
                          <ActiviteRow
                            key={act.id}
                            activite={act}
                            risques={catalogue.lignesRisque.filter((r) => r.parent === act.id)}
                            checked={checked.has(act.id)}
                            onToggle={toggleActivite}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      {visibleCats.length === visibleCats.filter((c) => c.corps_metier === "universel").length && (
        <p className="text-xs" style={{ color: "#A7AFB6" }}>
          Coche un corps de métier à l'étape précédente pour voir apparaître d'autres catégories.
        </p>
      )}
    </div>
  );
}

function CatalogueAbrege({ catalogue, checked, toggleItem }) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {catalogue.categories.map((cat) => (
        <div key={cat.id}>
          <p className="text-sm font-semibold mb-2 pb-1 border-b" style={{ color: "#0B3040", borderColor: "#E2E5E8" }}>
            {cat.fr}
          </p>
          <div className="flex flex-col gap-0.5">
            {catalogue.risques
              .filter((r) => r.categorieId === cat.id)
              .map((r) => (
                <label
                  key={r.id}
                  className="flex items-start gap-2 text-[13px] py-1"
                  style={{ color: r.risqueAggrave ? "#A7AFB6" : "#3D4750" }}
                >
                  <input type="checkbox" className="mt-0.5" checked={checked.has(r.id)} onChange={() => toggleItem(r.id)} />
                  <span style={r.risqueAggrave ? { textDecoration: "line-through" } : undefined}>
                    {r.sourceDanger} — {r.mesure}
                    {r.risqueAggrave && (
                      <span className="block text-[11px]" style={{ color: "#B3261E", textDecoration: "none" }}>
                        Non couvert par l'abrégé (nécessite le RePSS complet)
                      </span>
                    )}
                  </span>
                </label>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyseRisques({ dossier, setDossier, catalogueComplet, catalogueAbrege, onBack, onNext }) {
  const { mode, corpsMetier } = dossier.caracterisation;
  const activitesCochees = new Set(dossier.analyseRisques.activitesCochees);
  const itemsCochesAbrege = new Set(dossier.analyseRisques.itemsCochesAbrege);

  function toggleActivite(id) {
    const next = new Set(activitesCochees);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setDossier((prev) => ({ ...prev, analyseRisques: { ...prev.analyseRisques, activitesCochees: [...next] } }));
  }
  function toggleItem(id) {
    const next = new Set(itemsCochesAbrege);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setDossier((prev) => ({ ...prev, analyseRisques: { ...prev.analyseRisques, itemsCochesAbrege: [...next] } }));
  }

  const total = mode === "abrege" ? itemsCochesAbrege.size : activitesCochees.size;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="text-lg font-semibold" style={{ color: "#0B3040" }}>
          Analyse de risques
        </h3>
        <span className="text-sm" style={{ color: "#5A646C" }}>
          {total} sélectionnée{total > 1 ? "s" : ""}
        </span>
      </div>
      <p className="text-xs mb-4" style={{ color: "#7A8590" }}>
        {mode === "abrege"
          ? "Catalogue abrégé : coche les dangers présents sur le chantier."
          : "Filtré selon le corps de métier de ce chantier — coche les activités concernées, dépliables pour voir le détail (Kinney fixe, validé QHSE)."}
      </p>

      {mode === "abrege" ? (
        <CatalogueAbrege catalogue={catalogueAbrege} checked={itemsCochesAbrege} toggleItem={toggleItem} />
      ) : (
        <CatalogueComplet
          catalogue={catalogueComplet}
          corpsMetier={corpsMetier}
          checked={activitesCochees}
          toggleActivite={toggleActivite}
        />
      )}

      <div className="flex justify-between">
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
