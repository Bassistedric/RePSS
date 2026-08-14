export function sanitizeFilename(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function saveDossier(dossier) {
  const toSave = {
    ...dossier,
    meta: { ...dossier.meta, dateDerniereModif: new Date().toISOString().slice(0, 10) },
  };
  const { numeroChantier, nomChantier } = dossier.identification;
  const blob = new Blob([JSON.stringify(toSave, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const filename =
    numeroChantier && nomChantier
      ? `RePSS_${sanitizeFilename(numeroChantier)}_${sanitizeFilename(nomChantier)}.json`
      : "RePSS_brouillon.json";
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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
