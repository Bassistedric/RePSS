export function sanitizeFilename(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// Déclenche le téléchargement d'un Blob JSON (§8 : pas de backend, tout côté
// navigateur). L'ancre est ajoutée au DOM avant le clic (requis par certains
// navigateurs pour que `.click()` déclenche réellement le téléchargement) et
// `URL.revokeObjectURL` est différé : le révoquer dans la même tâche que le
// clic peut, sur Safari notamment, invalider l'URL avant que le navigateur
// n'ait fini de lire le Blob, produisant un fichier tronqué ou vide.
function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function saveDossier(dossier) {
  const toSave = {
    ...dossier,
    meta: { ...dossier.meta, dateDerniereModif: new Date().toISOString().slice(0, 10) },
  };
  const { numeroChantier, nomChantier } = dossier.identification;
  const filename =
    numeroChantier && nomChantier
      ? `RePSS_${sanitizeFilename(numeroChantier)}_${sanitizeFilename(nomChantier)}.json`
      : "RePSS_brouillon.json";
  downloadJson(toSave, filename);
}

// Même mécanisme que saveDossier (Blob + URL.createObjectURL, §8), pour le MOADR
// (§13) : document autonome, pas de backend non plus.
export function saveMoadr(moadr) {
  const { reference } = moadr.meta;
  const { projet } = moadr.objet;
  const filename = reference
    ? `MOADR_${sanitizeFilename(reference)}.json`
    : projet
      ? `MOADR_${sanitizeFilename(projet)}_brouillon.json`
      : "MOADR_brouillon.json";
  downloadJson(moadr, filename);
}

export function readDossierFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        resolve(JSON.parse(evt.target.result));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
