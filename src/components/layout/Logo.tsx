/**
 * Знак бренда SLS24 · Vanga — тёмная скруглённая плитка с моно-глифом `{ }`
 * в синем акценте. Единый логотип семейства порталов (у Vanga — синий).
 */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flex: "0 0 auto",
        borderRadius: Math.round(size * 0.22),
        background: "#0a0a0c",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <text
          x="50"
          y="55"
          fontFamily="ui-monospace, 'JetBrains Mono', monospace"
          fontSize="46"
          fontWeight="700"
          fill="var(--color-accent)"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {"{ }"}
        </text>
      </svg>
    </span>
  );
}
