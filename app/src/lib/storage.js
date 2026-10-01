export function sanitizeFilename(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// Déclenche le téléchargement d'un Blob JSON (§8 : pas de backend, tout côté
// navigateur).
function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  downloadBlob(blob, filename);
}

// Même garde-fou (ancre dans le DOM, revokeObjectURL différé), pour un Blob déjà
// construit ailleurs — utilisé pour le PDF final du RePSS une fois les MOADR
// "valide" fusionnés (§13, fusion), puisque ce n'est plus un simple <Document>
// react-pdf passable à PDFDownloadLink.
export function downloadBlob(blob, filename) {
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
