import { pdf } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import MoadrDocument from "../components/pdf/MoadrDocument";

// §13 (fusion) : à la génération du RePSS, les demandesMoadr au statut "valide"
// voient leur MOADR réellement fusionné (pages ajoutées à la suite), pas juste
// mentionné — pas de backend disponible pour une fusion côté serveur, donc tout
// se fait ici côté navigateur : chaque MOADR est regénéré en PDF depuis le
// dossier complet stocké sur la demande (moadrDossier), puis ses pages sont
// copiées dans le PDF du RePSS via pdf-lib.
export async function fusionnerMoadrValides(repssDocElement, demandesMoadr, { entreprise, t, logoAbsoluteUrl }) {
  const repssBlob = await pdf(repssDocElement).toBlob();
  const repssBytes = await repssBlob.arrayBuffer();
  const finalPdf = await PDFDocument.load(repssBytes);

  const aFusionner = (demandesMoadr || []).filter((d) => d.statut === "valide" && d.moadrDossier);

  for (const demande of aFusionner) {
    const moadrDocElement = (
      <MoadrDocument moadr={demande.moadrDossier} entreprise={entreprise} t={t} logoAbsoluteUrl={logoAbsoluteUrl} />
    );
    const moadrBlob = await pdf(moadrDocElement).toBlob();
    const moadrBytes = await moadrBlob.arrayBuffer();
    const moadrPdf = await PDFDocument.load(moadrBytes);
    const pagesCopiees = await finalPdf.copyPages(moadrPdf, moadrPdf.getPageIndices());
    pagesCopiees.forEach((page) => finalPdf.addPage(page));
  }

  const bytes = await finalPdf.save();
  return new Blob([bytes], { type: "application/pdf" });
}
