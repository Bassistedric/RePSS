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
  const [entreprise, catalogueComplet, catalogueAbrege, hopitaux, fr, nl, en] = await Promise.all([
    fetchJson("entreprise.json"),
    fetchJson("catalogue_risques.json"),
    fetchJson("catalogue_risques_abrege.json"),
    fetchJson("liste_hopitaux.json"),
    fetchJson("i18n/fr.json"),
    fetchJson("i18n/nl.json"),
    fetchJson("i18n/en.json"),
  ]);
  cache = {
    entreprise,
    catalogueComplet,
    catalogueAbrege,
    hopitaux: hopitaux.hopitaux,
    i18n: { fr, nl, en },
  };
  return cache;
}
