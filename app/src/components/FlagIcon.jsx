// SVG inline plutôt qu'emoji : les drapeaux emoji ne s'affichent pas comme des
// images sur tous les OS (Windows notamment les rend en code pays dans une boîte).
export default function FlagIcon({ code, size = 18 }) {
  const style = { display: "block", borderRadius: 2 };
  if (code === "fr") {
    return (
      <svg width={size} height={size * 0.6} viewBox="0 0 30 18" style={style}>
        <rect width="10" height="18" fill="#002654" />
        <rect x="10" width="10" height="18" fill="#FFF" />
        <rect x="20" width="10" height="18" fill="#ED2939" />
      </svg>
    );
  }
  if (code === "nl") {
    return (
      <svg width={size} height={size * 0.6} viewBox="0 0 30 18" style={style}>
        <rect width="30" height="6" fill="#AE1C28" />
        <rect y="6" width="30" height="6" fill="#FFF" />
        <rect y="12" width="30" height="6" fill="#21468B" />
      </svg>
    );
  }
  if (code === "en") {
    return (
      <svg width={size} height={size * 0.6} viewBox="0 0 30 18" style={style}>
        <rect width="30" height="18" fill="#012169" />
        <path d="M0,0 L30,18 M30,0 L0,18" stroke="#FFF" strokeWidth="3.6" />
        <path d="M0,0 L30,18 M30,0 L0,18" stroke="#C8102E" strokeWidth="1.2" />
        <path d="M15,0 V18 M0,9 H30" stroke="#FFF" strokeWidth="6" />
        <path d="M15,0 V18 M0,9 H30" stroke="#C8102E" strokeWidth="3.6" />
      </svg>
    );
  }
  return null;
}
