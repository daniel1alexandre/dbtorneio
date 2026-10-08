import { useState } from 'react';
import Layout from '../components/Layout';
import { categorias, partidas } from '../data/mockData';
import { Trophy, ChevronRight, Users, ListFilter, Brackets } from 'lucide-react';

function BracketMatch({ match, round }) {
  const isLive = match.status === 'em_andamento';
  const isDone = match.status === 'finalizada';
  return (
    <div style={{
      background: '#fff', borderRadius: 10,
      border: `1.5px solid ${isLive ? '#00AA00' : isDone ? '#CCC' : '#E2E8F0'}`,
      overflow: 'hidden', width: 180, flexShrink: 0,
      boxShadow: isLive ? '0 0 16px rgba(0,170,0,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        background: isLive ? '#00AA00' : isDone ? '#CCC' : '#003366',
        padding: '4px 10px', fontSize: 10, fontWeight: 700,
        color: '#fff', letterSpacing: '0.5px', textTransform: 'uppercase',
      }}>
        {round} {isLive && '▶'} {isDone && '✓'}
      </div>
      {[match.dupla1, match.dupla2].map((dupla, i) => (
        <div key={i} style={{
          padding: '8px 10px',
          background: isDone && match.vencedor === dupla ? 'rgba(0,170,0,0.06)' : 'transparent',
          borderBottom: i === 0 ? '1px solid #F0F4F8' : 'none',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            fontSize: 12, fontWeight: isDone && match.vencedor === dupla ? 800 : 500,
            color: isDone && match.vencedor === dupla ? '#006699' : '#333',
          }}>
            {dupla}
          </span>
          {isDone && match.vencedor === dupla && (
            <Trophy size={12} color="#FFD700" />
          )}
        </div>
      ))}
      {match.placar && (
        <div style={{ padding: '4px 10px', background: '#F8FAFC', fontSize: 11, color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>
          {match.placar}
        </div>
      )}
    </div>
  );
}

export default function ChaveamentoPage() {
  const [selectedCat, setSelectedCat] = useState(categorias[0].id);
  const [fase, setFase] = useState('grupos'); // 'grupos' | 'matamata'

  const currentCat = categorias.find(c => c.id === selectedCat);

  // Generate mock groups dynamically based on confirmed duplas
  const generateGroups = (totalDuplas) => {
    // Try to form groups of 3 or 4
    const numGroups = Math.max(1, Math.floor(totalDuplas / 3));
    return Array.from({ length: numGroups }, (_, i) => ({
      name: `Grupo ${String.fromCharCode(65 + i)}`,
      teams: [
        { name: `Dupla ${i + 1}A`, pts: Math.floor(Math.random() * 6), sg: Math.floor(Math.random() * 5) },
        { name: `Dupla ${i + 1}B`, pts: Math.floor(Math.random() * 6), sg: Math.floor(Math.random() * 5) },
        { name: `Dupla ${i + 1}C`, pts: Math.floor(Math.random() * 6), sg: Math.floor(Math.random() * 5) },
      ].sort((a, b) => b.pts - a.pts || b.sg - a.sg)
    }));
  };

  const grupos = generateGroups(currentCat?.confirmados || 12);

  const rounds = [
    { label: 'Quartas de Final', matches: partidas.filter(p => p.fase === 'Quartas') },
    { label: 'Semifinal', matches: partidas.filter(p => p.fase === 'Semi') },
    { label: 'Final', matches: [{ id: 'final', dupla1: 'TBD', dupla2: 'TBD', status: 'agendada', horario: '18:00', placar: null, vencedor: null }] },
  ];

  return (
    <Layout title="Chaveamento" subtitle="Fase de grupos e árvore eliminatória">
      {/* Category selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            style={{
              padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              background: selectedCat === cat.id ? '#003366' : '#fff',
              color: selectedCat === cat.id ? '#fff' : '#555',
              border: selectedCat === cat.id ? 'none' : '1.5px solid #E2E8F0',
              transition: 'all 0.2s',
              boxShadow: selectedCat === cat.id ? '0 4px 12px rgba(0,51,102,0.3)' : 'none',
            }}
          >
            {cat.nome}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', padding: 4, borderRadius: 12, border: '1px solid #E8EDF4', width: 'fit-content' }}>
        <button
          onClick={() => setFase('grupos')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            background: fase === 'grupos' ? '#003366' : 'transparent',
            color: fase === 'grupos' ? '#fff' : '#888',
            transition: 'all 0.2s',
          }}
        >
          <ListFilter size={16} /> Fase de Grupos
        </button>
        <button
          onClick={() => setFase('matamata')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            background: fase === 'matamata' ? '#003366' : 'transparent',
            color: fase === 'matamata' ? '#fff' : '#888',
            transition: 'all 0.2s',
          }}
        >
          <Brackets size={16} /> Mata-Mata
        </button>
      </div>

      {fase === 'grupos' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A2332' }}>Classificação dos Grupos</div>
              <div style={{ fontSize: 13, color: '#888' }}>{currentCat?.confirmados} duplas distribuídas em {grupos.length} grupos.</div>
            </div>
            <button className="btn btn-primary btn-sm"><Users size={14} /> Distribuir Duplas</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {grupos.map((grupo, gi) => (
              <div key={gi} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ background: '#003366', color: '#fff', padding: '10px 16px', fontWeight: 700, fontSize: 14 }}>
                  {grupo.name}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', color: '#888', textAlign: 'left', borderBottom: '1px solid #E8EDF4' }}>
                      <th style={{ padding: '8px 12px', fontWeight: 600 }}>Pos</th>
                      <th style={{ padding: '8px 12px', fontWeight: 600 }}>Dupla</th>
                      <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'center' }}>Pts</th>
                      <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'center' }}>SG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grupo.teams.map((t, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F0F4F8', background: i < 2 ? 'rgba(0,170,0,0.03)' : '#fff' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: i < 2 ? '#00AA00' : '#888' }}>{i + 1}º</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#333' }}>{t.name}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{t.pts}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#666' }}>{t.sg > 0 ? `+${t.sg}` : t.sg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {fase === 'matamata' && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2332', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={18} color="#FFD700" />
              Chave Eliminatória: {currentCat?.nome}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm">
                <Users size={13} /> Sortear Chave
              </button>
            </div>
          </div>
          <div style={{ padding: '24px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', minWidth: 'max-content' }}>
              {rounds.map((round, ri) => (
                <div key={ri} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, textAlign: 'center' }}>
                      {round.label}
                    </div>
                    {round.matches.map((m, mi) => (
                      <div key={mi} style={{
                        display: 'flex', alignItems: 'center',
                        marginTop: ri > 0 ? `${40 * (ri)}px` : 0,
                      }}>
                        <BracketMatch match={m} round={round.label} />
                      </div>
                    ))}
                  </div>
                  {ri < rounds.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                      <ChevronRight size={24} color="#DDD" />
                    </div>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 12 }}>
                <div style={{
                  background: 'linear-gradient(135deg, #003366, #006699)',
                  borderRadius: 14, padding: '20px 24px', textAlign: 'center',
                  border: '2px solid #FFD700', boxShadow: '0 0 24px rgba(255,215,0,0.2)',
                }}>
                  <Trophy size={32} color="#FFD700" style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>CAMPEÃO</div>
                  <div style={{ fontSize: 12, color: '#88AACC', marginTop: 4 }}>A definir</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All matches table */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2332' }}>Todas as Partidas (Geral)</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Quadra</th>
                <th>Horário</th>
                <th>Dupla 1</th>
                <th>Dupla 2</th>
                <th>Categoria</th>
                <th>Fase</th>
                <th>Status</th>
                <th>Placar</th>
              </tr>
            </thead>
            <tbody>
              {partidas.map((p, i) => (
                <tr key={p.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <td style={{ fontWeight: 700, color: '#FF6600' }}>Q{p.quadra}</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#888' }}>{p.horario}</td>
                  <td style={{ fontWeight: 600 }}>{p.dupla1}</td>
                  <td style={{ color: '#555' }}>{p.dupla2}</td>
                  <td>
                    <span style={{ padding: '2px 8px', borderRadius: 99, background: '#F0F4F8', fontSize: 11, color: '#555', fontWeight: 600 }}>{p.categoria}</span>
                  </td>
                  <td style={{ fontSize: 12, color: '#888' }}>{p.fase}</td>
                  <td><span className={`badge ${p.status}`}>{p.status.replace('_', ' ')}</span></td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#555' }}>{p.placar || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
