export default function Header() {
  return (
    <header className="neon-border" style={{ padding: '16px 32px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px #b026ff)' }}>⚔️</span>
        <h1 className="glow-text" style={{ fontSize: '1.8rem', background: 'linear-gradient(90deg, #00f0ff, #b026ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          VALQUÍRIA
        </h1>
        <span style={{ fontSize: '0.7rem', color: '#00f0ff', opacity: 0.5, fontFamily: 'Orbitron', letterSpacing: '2px' }}>
          v1.0 • HUNTER
        </span>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <span className="pulse-glow" style={{ color: '#00f0ff', fontSize: '0.7rem', fontFamily: 'Orbitron' }}>
          ● ONLINE
        </span>
      </div>
    </header>
  )
}
