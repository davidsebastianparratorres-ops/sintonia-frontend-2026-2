import "./PortadaAlbum.css";

export default function PortadaAlbum({ variante = 0, className = "" }) {
  // Convertir variante a número si llega como string
  const v =
    typeof variante === "number" ? variante : parseInt(variante, 10) || 0;

  return (
    <svg
      className={`portada-album ${className}`}
      viewBox="0 0 200 200"
      aria-hidden="true"
    >
      {/* Fondo por variante */}
      <rect
        width="200"
        height="200"
        fill={
          [
            "#24beb4", // 0: Pop
            "#9176fa", // 1: Lo-Fi
            "#fa55a3", // 2: Rock
            "#4b86fa", // 3: Electronica
            "#ff655c", // 4: Indie
            "#f8b946", // 5: Jazz
            "#e65025", // 6: Instrumental
            "#0c0b12", // 7: Musica Andina
            "#0c0b12", // 8: Salsa
            "#f8b946", // 9: Tropical
            "#4b86fa", // 10: Urbano
            "#24beb4", // 11: Folk
          ][v % 12]
        }
      />

      {/* 0: Pop */}
      {v === 0 && (
        <>
          <circle cx="153" cy="47" r="22" fill="white" />
          <circle cx="100" cy="174" r="68" fill="#0c0b12" />
        </>
      )}

      {/* 1: Lo-Fi */}
      {v === 1 && (
        <svg
          x="0"
          y="0"
          width="100%"
          height="100%"
          viewBox="16 16 92 92"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <clipPath id="recorte-lofi">
              <rect x="16" y="16" width="92" height="92" rx="8" />
            </clipPath>
          </defs>
          <g clipPath="url(#recorte-lofi)">
            <rect x="16" y="16" width="92" height="92" rx="8" fill="#2A2935" />
            <circle cx="62" cy="95.4554" r="31.3636" fill="#8E7BFF" />
            <circle cx="86.5682" cy="37.4318" r="9.93182" fill="#fff" />
          </g>
        </svg>
      )}

      {v === 2 && (
        <g>
          {/* Arco exterior de tono morado suave */}
          <circle
            cx="200"
            cy="200"
            r="160"
            fill="none"
            stroke="#9176fa"
            strokeWidth="45"
          />
          {/* Arco interior de tono violáceo en alto contraste */}
          <circle
            cx="200"
            cy="200"
            r="90"
            fill="none"
            stroke="#b355fa"
            strokeWidth="45"
          />
        </g>
      )}

      {/* 3: Electronica */}
      {v === 3 &&
        Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M-60 ${i * 48}L260 ${i * 48 - 200}`}
            stroke="#24beb4"
            strokeWidth="23"
          />
        ))}

      {/* 4: Indie */}
      {v === 4 &&
        Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M-60 ${i * 48}L260 ${i * 48 - 200}`}
            stroke="#f8b946"
            strokeWidth="23"
          />
        ))}

      {/* 5: Jazz */}
      {v === 5 &&
        Array.from({ length: 9 }, (_, i) => (
          <circle
            key={i}
            cx={45 + (i % 3) * 55}
            cy={45 + Math.floor(i / 3) * 55}
            r="18"
            fill={i % 2 ? "#0c0b12" : "#ffffff"}
          />
        ))}

      {/* 6: Instrumental */}
      {v === 6 &&
        Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M-60 ${i * 48}L260 ${i * 48 - 200}`}
            stroke="#0c0b12"
            strokeWidth="23"
          />
        ))}

      {/* 7: Musica Andina */}
      {v === 7 && (
        <>
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="#9176fa"
            strokeWidth="40"
          />
        </>
      )}

      {/* 8: Salsa */}
      {v === 8 &&
        Array.from({ length: 9 }, (_, i) => (
          <circle
            key={i}
            cx={45 + (i % 3) * 55}
            cy={45 + Math.floor(i / 3) * 55}
            r="18"
            fill={i % 2 ? "#fa55a3" : "#ffffff"}
          />
        ))}

      {/* 9: Tropical */}
      {v === 9 &&
        Array.from({ length: 9 }, (_, i) => (
          <circle
            key={i}
            cx={45 + (i % 3) * 55}
            cy={45 + Math.floor(i / 3) * 55}
            r="18"
            fill={i % 2 ? "#ff655c" : "#ffffff"}
          />
        ))}

      {/* 10: Urbano */}
      {v === 10 && (
        <>
          <circle cx="153" cy="47" r="20" fill="white" />
          <circle cx="100" cy="200" r="75" fill="#fa55a3" />
        </>
      )}

      {/* 11: Folk */}
      {v === 11 && (
        <>
          <circle
            cx="0"
            cy="0"
            r="140"
            fill="none"
            stroke="#f8b946"
            strokeWidth="35"
          />
        </>
      )}
    </svg>
  );
}
