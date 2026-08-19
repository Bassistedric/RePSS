import { useState } from "react";
import { ChevronDown, ChevronUp, FileCheck } from "lucide-react";
import MoadrSection from "./MoadrSection";
import { colors } from "../lib/colors";
import { grouperLignesParSourceDanger } from "../lib/catalogue";

// §6 : la case à cocher est la ligne de risque, jamais l'activité. L'activité est un
// simple sous-titre qui regroupe ses lignes, toujours affichées (pas de repli
// supplémentaire, médiane 2 lignes/activité, max 8). Seuls catégorie et
// sous-catégorie sont pliables/dépliables.
//
// Plusieurs lignes peuvent partager le même sourceDanger sous une même activité
// (une évaluation Kinney distincte par conséquence possible) : elles sont
// regroupées en une seule case. Cocher/décocher agit sur tout le groupe d'un coup.
function RisqueGroupRow({ groupe, isChecked, toggle, remarque, setRemarque, t }) {
  const ids = groupe.membres.map((m) => m.id);
  const checked = ids.every((id) => isChecked(id));
  const single = groupe.membres.length === 1;
  const label = single ? groupe.membres[0].risques : groupe.sourceDanger;
  const remarqueId = ids[0];

  return (
    <div>
      <label
        className="flex items-start gap-2 text-[13px] py-1 pl-2 pr-2 rounded"
        style={{ color: colors.neutralText, ...(checked ? { background: colors.successBg, color: colors.neutralTextStrong } : {}) }}
      >
        <input
          type="checkbox"
          className="mt-0.5"
          style={{ accentColor: colors.successAccent }}
          checked={checked}
          onChange={() => toggle(ids)}
        />
        {label}
      </label>
      {!single && (
        <ul className="ml-7 mb-1 list-disc pl-4 flex flex-col gap-0.5" style={{ color: colors.neutralText }}>
          {groupe.membres.map((m) => (
            <li key={m.id} className="text-xs">
              {m.risques}
            </li>
          ))}
        </ul>
      )}
      {checked && (
        <input
          type="text"
          placeholder={t("remarque_optionnelle_placeholder")}
          className="ml-7 mb-1 border rounded px-2 py-1 text-xs"
          style={{ borderColor: colors.neutralBorderStrong, width: "calc(100% - 1.75rem)" }}
          value={remarque(remarqueId)}
          onChange={(e) => setRemarque(ids, e.target.value)}
        />
      )}
    </div>
  );
}

function RisqueRows({ lignesRisque, isChecked, toggle, remarque, setRemarque, t }) {
  const groupes = grouperLignesParSourceDanger(lignesRisque);
  return (
    <div className="flex flex-col gap-1">
      {groupes.map((groupe) => (
        <RisqueGroupRow
          key={groupe.membres[0].id}
          groupe={groupe}
          isChecked={isChecked}
          toggle={toggle}
          remarque={remarque}
          setRemarque={setRemarque}
          t={t}
        />
      ))}
    </div>
  );
}

function ActiviteBlock({ activite, lignesRisque, isChecked, toggle, remarque, setRemarque, t }) {
  return (
    <div className="mb-3 last:mb-0 pl-3 border-l-2" style={{ borderColor: colors.neutralBorderStrong }}>
      <p className="text-[13px] font-medium mb-1.5" style={{ color: colors.neutralTextStrong }}>
        {activite.fr}
      </p>
      <div className="pl-3 border-l-2" style={{ borderColor: colors.neutralBorderFaint }}>
        <RisqueRows lignesRisque={lignesRisque} isChecked={isChecked} toggle={toggle} remarque={remarque} setRemarque={setRemarque} t={t} />
      </div>
    </div>
  );
}

// §6 : `granularite: "activite"` = action précise dont tous les risques sont
// automatiques dès qu'elle a lieu (ex. "Travaux de soudure") : une seule case sur
// l'activité elle-même, qui ajoute tous ses risqueId d'un coup ; ses `risques`
// s'affichent comme puces informatives, jamais individuellement cochables, et le
// sourceDanger de chaque ligne n'est jamais ré-affiché (déjà porté par l'activité).
function ActiviteBundleBlock({ activite, lignesRisque, isChecked, toggle, remarque, setRemarque, t }) {
  const ids = lignesRisque.map((r) => r.id);
  const checked = ids.length > 0 && ids.every((id) => isChecked(id));
  const remarqueId = ids[0];

  return (
    <div className="mb-3 last:mb-0 pl-3 border-l-2" style={{ borderColor: colors.neutralBorderStrong }}>
      <label
        className="flex items-start gap-2 text-[13px] font-medium py-1 pl-2 pr-2 rounded"
        style={{ color: colors.neutralTextStrong, ...(checked ? { background: colors.successBg } : {}) }}
      >
        <input
          type="checkbox"
          className="mt-0.5"
          style={{ accentColor: colors.successAccent }}
          checked={checked}
          disabled={ids.length === 0}
          onChange={() => toggle(ids)}
        />
        {activite.fr}
      </label>
      {lignesRisque.length > 0 && (
        <ul className="ml-7 mt-1 list-disc pl-4 flex flex-col gap-0.5" style={{ color: colors.neutralText }}>
          {lignesRisque.map((r) => (
            <li key={r.id} className="text-xs">
              {r.risques}
            </li>
          ))}
        </ul>
      )}
      {checked && (
        <input
          type="text"
          placeholder={t("remarque_optionnelle_placeholder")}
          className="ml-7 mt-1 border rounded px-2 py-1 text-xs"
          style={{ borderColor: colors.neutralBorderStrong, width: "calc(100% - 1.75rem)" }}
          value={remarque(remarqueId)}
          onChange={(e) => setRemarque(ids, e.target.value)}
        />
      )}
    </div>
  );
}

// La hiérarchie n'a pas une profondeur fixe (certaines catégories/sous-catégories
// sautent un ou deux niveaux intermédiaires). À un niveau donné, on cherche d'abord
// des activités rattachées ; si aucune, les lignes de risque sont rattachées
// directement à ce niveau et on les affiche sans indentation d'activité fictive.
function ActivitesOuRisques({ catalogue, parentId, isChecked, toggle, remarque, setRemarque, t }) {
  const acts = catalogue.activites.filter((a) => a.parent === parentId);
  if (acts.length > 0) {
    return acts.map((act) => {
      const lignesRisque = catalogue.lignesRisque.filter((r) => r.parent === act.id);
      const Block = act.granularite === "activite" ? ActiviteBundleBlock : ActiviteBlock;
      return (
        <Block
          key={act.id}
          activite={act}
          lignesRisque={lignesRisque}
          isChecked={isChecked}
          toggle={toggle}
          remarque={remarque}
          setRemarque={setRemarque}
          t={t}
        />
      );
    });
  }
  const lignesDirectes = catalogue.lignesRisque.filter((r) => r.parent === parentId);
  return <RisqueRows lignesRisque={lignesDirectes} isChecked={isChecked} toggle={toggle} remarque={remarque} setRemarque={setRemarque} t={t} />;
}

function CatalogueComplet({ catalogue, corpsMetier, isChecked, toggle, remarque, setRemarque, t }) {
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

  let lastGroupe;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {visibleCats.map((cat) => {
        const isOpen = openCats.has(cat.id);
        const subs = catalogue.sousCategories.filter((s) => s.parent === cat.id);
        // Le regroupement (cat.groupe) n'est ni sélectionnable ni pliable : c'est le
        // niveau le plus neutre visuellement, juste un séparateur au-dessus des
        // catégories qui le partagent (ex. "Exécution générale").
        const showGroupe = cat.groupe && cat.groupe !== lastGroupe;
        lastGroupe = cat.groupe;
        return (
          <div key={cat.id}>
            {showGroupe && (
              <p
                className="text-xs uppercase mt-3 mb-1.5 pt-2 border-t first:mt-0 first:pt-0 first:border-t-0"
                style={{ color: colors.neutralText, borderColor: colors.neutralBorder, letterSpacing: "0.06em" }}
              >
                {cat.groupe}
              </p>
            )}
            <div className="border rounded" style={{ borderColor: colors.neutralBorder }}>
            <button
              onClick={() => toggleCat(cat.id)}
              className="w-full flex justify-between items-center px-3 py-2.5 text-sm font-medium"
              style={{ background: colors.navy, color: "white" }}
            >
              {cat.fr}
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isOpen && (
              <div className="px-3 py-3">
                {subs.length > 0 ? (
                  subs.map((sub) => {
                    const subOpen = openSubs.has(sub.id);
                    return (
                      <div key={sub.id} className="mb-2 last:mb-0 border rounded" style={{ borderColor: colors.neutralBorderFaint }}>
                        <button
                          onClick={() => toggleSub(sub.id)}
                          className="w-full flex justify-between items-center px-2.5 py-2 text-sm font-semibold border-b-2"
                          style={{ color: colors.navy, borderColor: subOpen ? colors.turquoise : "transparent" }}
                        >
                          {sub.fr}
                          {subOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {subOpen && (
                          <div className="p-2.5">
                            <ActivitesOuRisques
                              catalogue={catalogue}
                              parentId={sub.id}
                              isChecked={isChecked}
                              toggle={toggle}
                              remarque={remarque}
                              setRemarque={setRemarque}
                              t={t}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  // Cette catégorie saute le niveau sous-catégorie : ses activités
                  // (ou, plus rare, ses lignes de risque) sont rattachées directement
                  // à la catégorie, pas d'indentation de sous-catégorie fictive.
                  <ActivitesOuRisques
                    catalogue={catalogue}
                    parentId={cat.id}
                    isChecked={isChecked}
                    toggle={toggle}
                    remarque={remarque}
                    setRemarque={setRemarque}
                    t={t}
                  />
                )}
              </div>
            )}
            </div>
          </div>
        );
      })}
      {visibleCats.every((c) => c.corps_metier === "universel") && (
        <p className="text-xs" style={{ color: colors.neutralText }}>
          {t("analyse_message_corps_metier")}
        </p>
      )}
    </div>
  );
}

function CatalogueAbrege({ catalogue, isChecked, toggle, t }) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      {catalogue.categories.map((cat) => (
        <div key={cat.id}>
          <p className="text-sm font-semibold mb-2 pb-1 border-b" style={{ color: colors.navy, borderColor: colors.neutralBorder }}>
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
                    style={{ color: disabled ? colors.neutralText : colors.neutralTextStrong }}
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
                        <span className="block text-[11px]" style={{ color: colors.warningText, textDecoration: "none" }}>
                          {t("analyse_non_couvert_abrege")}
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

export default function AnalyseRisques({ dossier, setDossier, catalogueComplet, catalogueAbrege, onBack, onNext, t }) {
  const { modeChoisi } = dossier.triage;
  const { corpsMetier } = dossier.caracterisation;
  const itemsCoches = dossier.analyseRisques.itemsCoches;

  function isChecked(id) {
    return itemsCoches.some((i) => i.risqueId === id);
  }
  // §6 : un groupe de lignes partageant le même sourceDanger se coche/décoche en
  // bloc → toggle accepte un seul id ou un tableau d'ids, traité comme un tout
  // (tous cochés ou tous décochés d'un coup).
  function toggle(idOrIds) {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const allChecked = ids.every(isChecked);
    const next = allChecked
      ? itemsCoches.filter((i) => !ids.includes(i.risqueId))
      : [...itemsCoches, ...ids.filter((id) => !isChecked(id)).map((id) => ({ risqueId: id, remarques: "" }))];
    setDossier((prev) => ({ ...prev, analyseRisques: { itemsCoches: next } }));
  }
  function remarque(id) {
    return itemsCoches.find((i) => i.risqueId === id)?.remarques ?? "";
  }
  // Un groupe partage une seule remarque, appliquée à tous ses risqueId.
  function setRemarque(idOrIds, text) {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const next = itemsCoches.map((i) => (ids.includes(i.risqueId) ? { ...i, remarques: text } : i));
    setDossier((prev) => ({ ...prev, analyseRisques: { itemsCoches: next } }));
  }

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>
          {modeChoisi === "abrege" ? t("analyse_titre_abrege") : t("analyse_titre_complet")}
        </h3>
        <span className="text-sm" style={{ color: colors.neutralText }}>
          {itemsCoches.length} {t("analyse_compteur_selection")}
        </span>
      </div>
      <p className="text-xs mb-4" style={{ color: colors.neutralText }}>
        {modeChoisi === "abrege" ? t("analyse_aide_abrege") : t("analyse_aide_complet")}
      </p>

      {modeChoisi === "abrege" ? (
        <CatalogueAbrege catalogue={catalogueAbrege} isChecked={isChecked} toggle={toggle} t={t} />
      ) : (
        <CatalogueComplet
          catalogue={catalogueComplet}
          corpsMetier={corpsMetier}
          isChecked={isChecked}
          toggle={toggle}
          remarque={remarque}
          setRemarque={setRemarque}
          t={t}
        />
      )}

      <MoadrSection dossier={dossier} setDossier={setDossier} t={t} />

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="px-5 py-2 rounded text-sm border" style={{ borderColor: colors.neutralBorderStrong }}>
          {t("bouton_retour")}
        </button>
        <button onClick={onNext} className="px-5 py-2 rounded text-sm font-medium flex items-center gap-2" style={{ background: colors.navy, color: "white" }}>
          <FileCheck size={16} />
          {t("bouton_continuer")}
        </button>
      </div>
    </div>
  );
}
