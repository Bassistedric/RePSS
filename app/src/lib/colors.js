// Système de couleurs RePSS (CLAUDE.md §9/§10).
//
// - navy / blue / turquoise sont des couleurs d'identité à usage volontairement
//   restreint (voir le rôle documenté à côté de chacune) — jamais des fonds
//   généraux, jamais mélangées aux couleurs sémantiques.
// - Les neutres sont des gris chauds (non teintés bleu) : ils portent tous les
//   fonds et bordures structurels, ainsi que le texte non sémantique.
// - success / warning / error sont réservées à leur seul usage sémantique et ne
//   servent jamais de simple accent décoratif.
export const colors = {
  // Identité : boutons principaux, en-têtes de catégorie, navigation active.
  navy: "#0B3040",
  // Fond très clair pour les usages d'identité qui ont besoin d'un fond plutôt
  // que d'un aplat plein : état actif de navigation, bandeaux de catégorie de
  // l'analyse de risques (texte navy sur fond pâle plutôt qu'aplat navy répété
  // 11 fois, qui n'est plus un signal et écrase le contraste des niveaux
  // dessous). Jamais un fond général pour autant.
  navyTint: "#DEE6E5",

  // Interactif : liens, accents secondaires, contrôles.
  blue: "#156082",

  // Accent de vie, dans l'esprit du dégradé du logo : usage unique, la bordure
  // des sous-catégories. Ne jamais le mélanger aux couleurs sémantiques.
  turquoise: "#1D9E75",

  // Neutres chauds : fonds et bordures structurels, texte non sémantique.
  neutralBg: "#F1EEEA",
  neutralBgSubtle: "#F8F6F3",
  neutralBorder: "#E3DFD9",
  neutralBorderStrong: "#D6D0C7",
  neutralBorderFaint: "#ECE8E2",
  neutralText: "#57514A",
  neutralTextStrong: "#3A352E",

  // Sémantiques réservées.
  success: "#3E9B57",
  successBg: "#EAF6EC",
  successAccent: "#8FCB9B",
  warning: "#F0C36D",
  warningBg: "#FFF8E8",
  warningText: "#8A6300",
  warningTextStrong: "#5A4300",
  error: "#B3261E",
};
