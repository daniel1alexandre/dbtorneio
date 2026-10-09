import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volleyball, Play, Square, RotateCcw, CheckCircle, Timer, ArrowLeft, Clock } from 'lucide-react';
import api from '../services/api';

export default function ArbitroPage() {
  const [view, setView] = useState('list'); // list | match
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Match control state
  const [fase, setFase] = useState('espera'); // espera | aquecimento | partida | finalizada
  const [aquecTime, setAquecTime] = useState(300); // 5 min
  const [matchTime, setMatchTime] = useState(0);
  const [set1, setSet1] = useState(['', '']);
  const [set2, setSet2] = useState(['', '']);
  const [set3, setSet3] = useState(['', '']);
  const [vencedor, setVencedor] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const navigate = useNavigate();
  const aquecRef = useRef(null);
  const matchRef = useRef(null);

  // Aquecimento countdown
  useEffect(() => {
    if (fase === 'aquecimento') {
      aquecRef.current = setInterval(() => {
        setAquecTime(t => {
          if (t <= 1) {
            clearInterval(aquecRef.current);
            setFase('partida');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(aquecRef.current);
  }, [fase]);

  // Match timer
  useEffect(() => {
    if (fase === 'partida') {
      matchRef.current = setInterval(() => setMatchTime(t => t + 1), 1000);
    }
    return () => clearInterval(matchRef.current);
  }, [fase]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const resetTudo = () => {
    setFase('espera');
    setAquecTime(300);
    setMatchTime(0);
    setSet1(['', '']);
    setSet2(['', '']);
    setSet3(['', '']);
    setVencedor(null);
    setConfirmando(false);
  };

  useEffect(() => {
    if (view === 'list') {
      api.get('/partidas')
        .then(res => setPartidas(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [view]);

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    resetTudo();
    setView('match');
  };

  const dupla1 = selectedMatch ? `${selectedMatch.atleta1_nome || 'A1'} / ${selectedMatch.atleta2_nome || 'A2'}` : 'Santos / Arruda';
  const dupla2 = selectedMatch ? `${selectedMatch.atleta3_nome || 'A3'} / ${selectedMatch.atleta4_nome || 'A4'}` : 'Silva / Silveira';
  const quadra = selectedMatch ? selectedMatch.quadra_numero : 3;

  if (view === 'list') {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 8, border: '1px solid #333',
              background: '#1A1A1A', cursor: 'pointer', color: '#AAA',
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>Painel do Árbitro</h1>
            <p style={{ color: '#888', margin: 0, fontSize: 13 }}>Selecione uma partida para arbitrar</p>
          </div>
        </div>

        {loading ? (
          <div style={{ color: '#888', textAlign: 'center', padding: 40 }}>Carregando cronograma...</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {partidas.map(p => (
              <div key={p.id} style={{
                background: '#111', border: '1px solid #222', borderRadius: 12, padding: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                transition: 'border 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#FF6600'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#222'}
              onClick={() => handleSelectMatch(p)}
              >
                <div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ background: '#333', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Quadra {p.quadra_numero || '?'}</span>
                    <span style={{ color: '#888', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12}/> {p.horario_agendado?.slice(0,5)}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{p.atleta1_nome || 'A1'} / {p.atleta2_nome || 'A2'} <span style={{color: '#555', margin: '0 8px'}}>VS</span> {p.atleta3_nome || 'A3'} / {p.atleta4_nome || 'A4'}</div>
                </div>
                <button className="btn btn-primary btn-sm" style={{ padding: '8px 16px' }}>Arbitrar →</button>
              </div>
            ))}
            {partidas.length === 0 && <div style={{ color: '#888', textAlign: 'center', padding: 40 }}>Nenhuma partida agendada.</div>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="arbitro-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      {/* Header */}
      <div style={{
        background: '#111', padding: '16px 20px',
        borderBottom: '1px solid #222',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setView('list')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 8, border: '1px solid #333',
              background: '#1A1A1A', cursor: 'pointer', color: '#AAA',
            }}
            title="Voltar para a lista de jogos"
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #FF6600, #FF8833)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Volleyball size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>Quadra {quadra}</div>
            <div style={{ fontSize: 12, color: '#888' }}>Painel do Árbitro</div>
          </div>
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: 8,
          background: fase === 'partida' ? 'rgba(0,170,0,0.2)' : fase === 'aquecimento' ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${fase === 'partida' ? '#00AA00' : fase === 'aquecimento' ? '#FFD700' : '#333'}`,
          fontSize: 12, fontWeight: 700, color: fase === 'partida' ? '#00AA00' : fase === 'aquecimento' ? '#FFD700' : '#888',
          textTransform: 'uppercase', letterSpacing: '1px',
        }}>
          {fase === 'espera' ? 'Aguardando' : fase === 'aquecimento' ? 'Aquecimento' : fase === 'partida' ? 'Em Andamento' : 'Finalizada'}
        </div>
      </div>

      {/* Teams */}
      <div style={{ padding: '20px', background: '#0A0A0A', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ textAlign: 'center', marginBottom: 4, fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Duplas Masculino Pro · Semifinal
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{
              fontSize: 22, fontWeight: 900, color: '#fff',
              letterSpacing: '-0.5px', lineHeight: 1.1,
              padding: '10px 14px', borderRadius: 10,
              background: vencedor === 1 ? 'rgba(0,170,0,0.15)' : 'rgba(255,255,255,0.04)',
              border: vencedor === 1 ? '2px solid #00AA00' : '1px solid #1A1A1A',
              transition: 'all 0.3s',
            }}>
              {dupla1}
            </div>
          </div>
          <div style={{ color: '#555', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>VS</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 22, fontWeight: 900, color: '#fff',
              letterSpacing: '-0.5px', lineHeight: 1.1,
              padding: '10px 14px', borderRadius: 10,
              background: vencedor === 2 ? 'rgba(0,170,0,0.15)' : 'rgba(255,255,255,0.04)',
              border: vencedor === 2 ? '2px solid #00AA00' : '1px solid #1A1A1A',
              transition: 'all 0.3s',
            }}>
              {dupla2}
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── FASE: ESPERA ── */}
        {fase === 'espera' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 20 }}>
            <div style={{ textAlign: 'center', color: '#555', fontSize: 14 }}>
              Pressione o botão para iniciar o aquecimento oficial
            </div>
            <button
              className="btn btn-success"
              style={{ fontSize: 18, padding: '18px 48px', borderRadius: 14, minHeight: 60, gap: 12 }}
              onClick={() => setFase('aquecimento')}
            >
              <Timer size={22} />
              Iniciar Aquecimento
            </button>
            <div style={{ color: '#555', fontSize: 13 }}>
              Duração padrão: <strong style={{ color: '#FFD700' }}>5 minutos</strong>
            </div>
          </div>
        )}

        {/* ── FASE: AQUECIMENTO ── */}
        {fase === 'aquecimento' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 200, height: 200, borderRadius: '50%',
              border: `6px solid ${aquecTime < 60 ? '#FF6600' : '#FFD700'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: `conic-gradient(${aquecTime < 60 ? '#FF6600' : '#FFD700'} ${((300 - aquecTime) / 300) * 360}deg, #1A1A1A 0deg)`,
              boxShadow: `0 0 30px ${aquecTime < 60 ? 'rgba(255,102,0,0.3)' : 'rgba(255,215,0,0.3)'}`,
              transition: 'border-color 0.5s, box-shadow 0.5s',
            }}>
              <div style={{ width: 170, height: 170, borderRadius: '50%', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="timer-display animate-countdown-pulse"
                  style={{ fontSize: 52, color: aquecTime < 60 ? '#FF6600' : '#FFD700' }}>
                  {formatTime(aquecTime)}
                </div>
                <div style={{ color: '#555', fontSize: 12, marginTop: 4, letterSpacing: '1px' }}>AQUECIMENTO</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn"
                style={{
                  background: '#1A1A1A', color: '#888', border: '1px solid #333',
                  fontSize: 14, padding: '12px 24px',
                }}
                onClick={() => { clearInterval(aquecRef.current); setFase('partida'); }}
              >
                Pular →
              </button>
            </div>
            <div style={{ color: '#555', fontSize: 13, textAlign: 'center' }}>
              A partida iniciará automaticamente ao término
            </div>
          </div>
        )}

        {/* ── FASE: PARTIDA ── */}
        {fase === 'partida' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Match timer */}
            <div style={{ textAlign: 'center' }}>
              <div className="timer-display" style={{ fontSize: 56, color: '#00AA00' }}>
                {formatTime(matchTime)}
              </div>
              <div style={{ color: '#555', fontSize: 12, letterSpacing: '1px' }}>TEMPO DE PARTIDA</div>
            </div>

            {/* Score input */}
            {[
              { label: 'Set 1', state: set1, setter: setSet1 },
              { label: 'Set 2', state: set2, setter: setSet2 },
              { label: 'Super Tie-break', state: set3, setter: setSet3, optional: true },
            ].map(({ label, state, setter, optional }) => (
              <div key={label} style={{
                background: '#0D0D0D', border: '1px solid #1A1A1A', borderRadius: 12, padding: '14px 16px',
              }}>
                <div style={{ fontSize: 12, color: '#555', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {label} {optional && <span style={{ color: '#333' }}>(se necessário)</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>{dupla1.split(' / ')[0]}</div>
                    <input
                      type="number" min="0" max="99"
                      value={state[0]}
                      onChange={e => setter([e.target.value, state[1]])}
                      style={{
                        width: '100%', padding: '12px', borderRadius: 10,
                        background: '#1A1A1A', border: '1px solid #2A2A2A',
                        color: '#fff', fontSize: 28, fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        textAlign: 'center', outline: 'none',
                      }}
                    />
                  </div>
                  <div style={{ color: '#333', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>×</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>{dupla2.split(' / ')[0]}</div>
                    <input
                      type="number" min="0" max="99"
                      value={state[1]}
                      onChange={e => setter([state[0], e.target.value])}
                      style={{
                        width: '100%', padding: '12px', borderRadius: 10,
                        background: '#1A1A1A', border: '1px solid #2A2A2A',
                        color: '#fff', fontSize: 28, fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        textAlign: 'center', outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Winner select */}
            <div style={{ background: '#0D0D0D', border: '1px solid #1A1A1A', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: '#555', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Dupla Vencedora
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ id: 1, nome: dupla1 }, { id: 2, nome: dupla2 }].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setVencedor(d.id)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 10,
                      border: vencedor === d.id ? '2px solid #00AA00' : '1px solid #2A2A2A',
                      background: vencedor === d.id ? 'rgba(0,170,0,0.15)' : '#1A1A1A',
                      color: vencedor === d.id ? '#00AA00' : '#888',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      transition: 'all 0.2s', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    {vencedor === d.id && <CheckCircle size={15} />}
                    {d.nome}
                  </button>
                ))}
              </div>
            </div>

            {/* Finalize button */}
            {!confirmando ? (
              <button
                className="btn btn-danger"
                style={{ fontSize: 16, padding: '16px', borderRadius: 12, minHeight: 56 }}
                onClick={() => setConfirmando(true)}
              >
                <Square size={18} />
                Encerrar Partida
              </button>
            ) : (
              <div style={{
                background: 'rgba(255,0,0,0.1)', border: '2px solid #CC0000',
                borderRadius: 12, padding: '16px',
              }} className="animate-blink-danger">
                <div style={{ color: '#FF6666', fontWeight: 700, textAlign: 'center', marginBottom: 12, fontSize: 14 }}>
                  ⚠️ Confirmar encerramento da partida?
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="btn btn-ghost"
                    style={{ flex: 1, color: '#888', border: '1px solid #333', background: 'transparent' }}
                    onClick={() => setConfirmando(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ flex: 1 }}
                    onClick={() => { setFase('finalizada'); setConfirmando(false); }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FASE: FINALIZADA ── */}
        {fase === 'finalizada' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 10 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(0,170,0,0.15)', border: '3px solid #00AA00',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle size={40} color="#00AA00" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>Partida Finalizada!</div>
              <div style={{ color: '#888', marginTop: 6, fontSize: 14 }}>Duração: {formatTime(matchTime)}</div>
            </div>

            {/* Results summary */}
            <div style={{ width: '100%', background: '#0D0D0D', borderRadius: 12, padding: '16px', border: '1px solid #1A1A1A' }}>
              {[[set1, 'Set 1'], [set2, 'Set 2'], [set3, 'Super Tie-break']].map(([s, label], i) => (
                s[0] || s[1] ? (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1A1A1A', fontSize: 14 }}>
                    <span style={{ color: '#555' }}>{label}</span>
                    <span style={{ color: '#fff', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                      {s[0]} × {s[1]}
                    </span>
                  </div>
                ) : null
              ))}
              {vencedor && (
                <div style={{ marginTop: 12, textAlign: 'center', padding: '10px', background: 'rgba(0,170,0,0.08)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>VENCEDOR</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#00AA00' }}>
                    🏆 {vencedor === 1 ? dupla1 : dupla2}
                  </div>
                </div>
              )}
            </div>

            <button
              className="btn"
              style={{ background: '#1A1A1A', color: '#888', border: '1px solid #333', padding: '12px 28px', fontSize: 14 }}
              onClick={resetTudo}
            >
              <RotateCcw size={16} />
              Nova Partida
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
