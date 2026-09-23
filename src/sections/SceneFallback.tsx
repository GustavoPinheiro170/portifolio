// Versão estática do painel para navegadores sem WebGL.
export function SceneFallback() {
  return (
    <svg className="scene-fallback" viewBox="0 0 320 200" role="presentation">
      <rect x="1" y="1" width="318" height="198" rx="14" fill="#0D1B2E" stroke="#6F86FF" strokeWidth="2" />
      <circle cx="20" cy="18" r="4" fill="#FF6B6B" />
      <circle cx="34" cy="18" r="4" fill="#F2C27B" />
      <circle cx="48" cy="18" r="4" fill="#6FD3A8" />
      {[50, 72, 94, 116, 138].map((y, i) => (
        <rect key={y} x="24" y={y} width={[150, 210, 180, 120, 90][i]} height="8" rx="4" fill={i % 2 ? '#8FA2FF' : '#9FE0C8'} />
      ))}
    </svg>
  )
}
