// Redimensionne une image (PNG/JPG) côté navigateur avant de la stocker dans le
// dossier JSON (pas de backend, §CLAUDE.md §8) : évite qu'une photo de plusieurs
// Mo gonfle le fichier .json exporté et ralentisse la génération du PDF. Toujours
// réencodée en JPEG (la photo de couverture n'a pas besoin de transparence).
export function resizeImageToDataUrl(file, { maxWidth = 1600, maxHeight = 1600, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = Math.min(1, maxWidth / img.width, maxHeight / img.height);
      const width = Math.round(img.width * ratio);
      const height = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image illisible"));
    };
    img.src = url;
  });
}
