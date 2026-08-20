const base = import.meta.env.BASE_URL;

let cache = null;

async function fetchJson(path) {
  const res = await fetch(`${base}content-pack/${path}`);
  if (!res.ok) throw new Error(`Impossible de charger ${path}`);
  return res.json();
}

export function logoUrl(filename) {
  if (!filename) return null;
  return `${base}content-pack/logos/${filename}`;
}

export async function loadContentPack() {
  if (cache) return cache;
  const [entreprise, catalogueCompletFr, catalogueCompletEn, catalogueCompletNl, catalogueAbrege, hopitaux, fr, nl, en] = await Promise.all([
    fetchJson("entreprise.json"),
    fetchJson("catalogue_risques.json"),
    fetchJson("catalogue_risques_en.json"),
    fetchJson("catalogue_risques_nl.json"),
    fetchJson("catalogue_risques_abrege.json"),
    fetchJson("liste_hopitaux.json"),
    fetchJson("i18n/fr.json"),
    fetchJson("i18n/nl.json"),
    fetchJson("i18n/en.json"),
  ]);
  cache = {
    entreprise,
    // Catalogue complet traduit (fr/en/nl, cf. RePSS_Analyse_Risques_EN/NL.xlsx) :
    // sélectionné par langue à l'usage (App.jsx), jamais mélangé. L'abrégé reste
    // fr uniquement (pas encore traduit, cf. CLAUDE.md §13).
    catalogueComplet: { fr: catalogueCompletFr, en: catalogueCompletEn, nl: catalogueCompletNl },
    catalogueAbrege,
    hopitaux: hopitaux.hopitaux,
    i18n: { fr, nl, en },
  };
  return cache;
}
