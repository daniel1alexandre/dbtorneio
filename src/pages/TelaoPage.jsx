import { useState, useEffect } from 'react';
import { partidas, quadras } from '../data/mockData';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const PANEL_DURATION = 30000; // 30s each

function Panel1({ matches }) {
  return (
    <div style={{ padding: '40px 60px' }}>
      <div style={{
        fontSize: 16, fontWeight: 700, color: '#FF6600',
        letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 32,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6600', animation: 'ws-ping 1.2s infinite' }} />
        PRÓXIMAS PARTIDAS
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {matches.map((m, i) => (
          <div key={m.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 16,
              border: `1.5px solid ${m.status === 'aquecimento' ? '#FFD700' : m.status === 'em_andamento' ? '#00AA00' : 'rgba(255,255,255,0.1)'}`,
              padding: '20px',
              boxShadow: m.status === 'em_andamento' ? '0 0 24px rgba(0,170,0,0.15)' : m.status === 'aquecimento' ? '0 0 24px rgba(255,215,0,0.15)' : 'none',
            }}>
              <div style={{ fontSize: 13, color: '#FF6600', fontWeight: 700, marginBottom: 12, letterSpacing: '1px' }}>
                QUADRA {m.quadra}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>
                {m.dupla1}
              </div>
              <div style={{ fontSize: 14, color: '#555', marginBottom: 8, fontStyle: 'italic' }}>vs</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
                {m.dupla2}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>{m.horario}</span>
                <span style={{
                  padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                  background: m.status === 'aquecimento' ? 'rgba(255,215,0,0.15)' : m.status === 'em_andamento' ? 'rgba(0,170,0,0.15)' : 'rgba(255,255,255,0.08)',
                  color: m.status === 'aquecimento' ? '#FFD700' : m.status === 'em_andamento' ? '#00AA00' : '#888',
                  border: `1px solid ${m.status === 'aquecimento' ? '#FFD700' : m.status === 'em_andamento' ? '#00AA00' : 'rgba(255,255,255,0.1)'}`,
                }}>
                  {m.status === 'agendada' ? m.horario : m.status === 'aquecimento' ? '⚡ AQUECIMENTO' : '▶ AO VIVO'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Panel2({ matches }) {
  const live = matches.filter(m => m.status === 'em_andamento' || m.status === 'aquecimento');
  return (
    <div style={{ padding: '40px 60px' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#00AA00', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00AA00', animation: 'ws-ping 1.2s infinite' }} />
        QUADRAS EM ATIVIDADE
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28 }}>
        {live.map((m, i) => (
          <div key={m.id} style={{
            background: m.status === 'aquecimento' ? 'rgba(255,215,0,0.05)' : 'rgba(0,170,0,0.05)',
            border: `2px solid ${m.status === 'aquecimento' ? '#FFD70040' : '#00AA0040'}`,
            borderRadius: 20, padding: '28px 32px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#FF6600' }}>Quadra {m.quadra}</span>
              <span style={{
                padding: '6px 16px', borderRadius: 99,
                background: m.status === 'aquecimento' ? 'rgba(255,215,0,0.15)' : 'rgba(0,170,0,0.15)',
                color: m.status === 'aquecimento' ? '#FFD700' : '#00AA00',
                fontSize: 13, fontWeight: 700, letterSpacing: '1px',
              }}>
                {m.status === 'aquecimento' ? '⚡ AQUECIMENTO' : '▶ EM ANDAMENTO'}
              </span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 6, letterSpacing: '-0.5px' }}>
              {m.dupla1}
            </div>
            <div style={{ fontSize: 18, color: '#555', marginBottom: 6 }}>×</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px' }}>
              {m.dupla2}
            </div>
            {m.placar && (
              <div style={{ fontSize: 28, fontWeight: 800, color: '#FFD700', fontFamily: "'JetBrains Mono', monospace" }}>
                {m.placar}
              </div>
            )}
            <div style={{ fontSize: 14, color: '#444', marginTop: 12 }}>
              {m.categoria} · {m.fase}
            </div>
          </div>
        ))}
        {live.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#333', fontSize: 24, padding: '60px 0' }}>
            Nenhuma partida ao vivo no momento
          </div>
        )}
      </div>
    </div>
  );
}

function Panel3({ matches }) {
  const finalizadas = matches.filter(m => m.status === 'finalizada');
  return (
    <div style={{ padding: '40px 60px' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#006699', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 32 }}>
        🏆 RESULTADOS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {finalizadas.map((m, i) => (
          <div key={m.id} style={{
            display: 'flex', alignItems: 'center', gap: 24,
            background: 'rgba(255,255,255,0.04)', borderRadius: 14,
            padding: '20px 28px', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ width: 6, height: 40, borderRadius: 99, background: '#006699', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{m.dupla1}</div>
              <div style={{ fontSize: 14, color: '#555' }}>vs {m.dupla2}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#FFD700', fontFamily: "'JetBrains Mono', monospace" }}>
                {m.placar || '—'}
              </div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{m.categoria}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#FF6600', fontWeight: 700 }}>Quadra {m.quadra}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#00AA00', marginTop: 4 }}>✓ {m.vencedor}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TelaoPage() {
  const [panel, setPanel] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setPanel(p => (p + 1) % 3), PANEL_DURATION);
    return () => clearInterval(timer);
  }, []);

  const upcomingMatches = partidas.filter(m => m.status !== 'finalizada').slice(0, 8);

  return (
    <div className="telao-root" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(17,69,45,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(229,214,26,0.05) 0%, transparent 50%)',
      }} />

      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 72,
        background: 'rgba(0,17,51,0.95)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: '#fff',
              transition: 'all 0.2s'
            }}
            title="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden' }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>DBTorneios</div>
            <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, letterSpacing: '2px' }}>COPA ELITE COPACABANA 2026</div>
          </div>
        </div>

        {/* Panel indicators */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['Próximas', 'Ao Vivo', 'Resultados'].map((label, i) => (
            <button
              key={i}
              onClick={() => setPanel(i)}
              style={{
                padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: panel === i ? '#FF6600' : 'rgba(255,255,255,0.08)',
                color: panel === i ? '#fff' : '#555',
                fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                transition: 'all 0.3s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Live clock */}
        <LiveClock />
      </div>

      {/* Main content */}
      <div style={{ paddingTop: 72, position: 'relative', zIndex: 1 }}>
        <div style={{ opacity: panel === 0 ? 1 : 0, transition: 'opacity 0.6s', position: panel === 0 ? 'relative' : 'absolute', inset: 0, pointerEvents: panel === 0 ? 'auto' : 'none' }}>
          <Panel1 matches={upcomingMatches} />
        </div>
        <div style={{ opacity: panel === 1 ? 1 : 0, transition: 'opacity 0.6s', position: panel === 1 ? 'relative' : 'absolute', inset: 0, pointerEvents: panel === 1 ? 'auto' : 'none', top: 72 }}>
          <Panel2 matches={partidas} />
        </div>
        <div style={{ opacity: panel === 2 ? 1 : 0, transition: 'opacity 0.6s', position: panel === 2 ? 'relative' : 'absolute', inset: 0, pointerEvents: panel === 2 ? 'auto' : 'none', top: 72 }}>
          <Panel3 matches={partidas} />
        </div>
      </div>

      {/* Bottom ticker */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: '#FF6600', height: 44,
        display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', gap: 60, padding: '0 24px',
          animation: 'scroll-ticker 30s linear infinite',
          whiteSpace: 'nowrap', fontSize: 14, fontWeight: 700, color: '#fff',
        }}>
          {partidas.map((m, i) => (
            <span key={i}>
              ⚡ {m.dupla1} vs {m.dupla2} — Quadra {m.quadra} — {m.horario} — {m.categoria}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-ticker {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-200%); }
        }
      `}</style>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '2px' }}>
        {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div style={{ fontSize: 12, color: '#888', textTransform: 'capitalize' }}>
        {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
      </div>
    </div>
  );
}
