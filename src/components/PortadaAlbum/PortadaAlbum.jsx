import "./PortadaAlbum.css";
export default function PortadaAlbum({ variante = 0, className = "" }) {
  return (
    <svg
      className={`portada-album ${className}`}
      viewBox="0 0 200 200"
      aria-hidden="true"
    >
      <rect
        width="200"
        height="200"
        fill={
          ["#24beb4", "#fa55a3", "#f8b946", "#4b86fa", "#ff655c", "#9176fa"][
            variante % 6
          ]
        }
      />
      {variante === 0 && (
        <>
          <circle cx="153" cy="47" r="22" fill="white" />
          <circle cx="100" cy="174" r="68" fill="#0c0b12" />
        </>
      )}
      {variante === 1 && (
        <>
          <circle
            cx="205"
            cy="205"
            r="155"
            fill="none"
            stroke="#9176fa"
            strokeWidth="46"
          />
          <circle cx="205" cy="205" r="65" fill="#9176fa" />
        </>
      )}
      {(variante === 2 || variante === 5) &&
        Array.from({ length: 9 }, (_, i) => (
          <circle
            key={i}
            cx={45 + (i % 3) * 55}
            cy={45 + Math.floor(i / 3) * 55}
            r="18"
            fill={i % 2 ? (variante === 2 ? "#ff655c" : "#fa55a3") : "#fff"}
          />
        ))}
      {(variante === 3 || variante === 4) &&
        Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M-60 ${i * 48}L260 ${i * 48 - 200}`}
            stroke={variante === 3 ? "#24beb4" : "#f8b946"}
            strokeWidth="23"
          />
        ))}
    </svg>
  );
}
