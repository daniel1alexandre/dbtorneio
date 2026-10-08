import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { partidas as initialPartidas, quadras, horarios, categorias } from '../data/mockData';
import { GripVertical, AlertCircle, Clock, Play, CheckCircle, Zap, Filter } from 'lucide-react';

const STATUS_CONFIG = {
  agendada:     { label: 'Agendada',      color: '#006699', bg: '#E8F4FD', border: '#006699' },
  aquecimento:  { label: 'Aquecimento',   color: '#996600', bg: '#FFF8DC', border: '#FFD700' },
  em_andamento: { label: 'Em Andamento',  color: '#006600', bg: '#E8F5E8', border: '#00AA00' },
  finalizada:   { label: 'Finalizada',    color: '#666666', bg: '#F5F5F5', border: '#BBBBBB' },
};

const STATUS_ICONS = {
  agendada: Clock,
  aquecimento: Zap,
  em_andamento: Play,
  finalizada: CheckCircle,
};

function MatchCard({ partida, onDragStart, onDragEnd }) {
  const cfg = STATUS_CONFIG[partida.status] || STATUS_CONFIG.agendada;
  const Icon = STATUS_ICONS[partida.status] || Clock;

  return (
    <div
      className={`match-card ${partida.status}`}
      draggable={partida.status === 'agendada'}
      onDragStart={(e) => {
        if (partida.status !== 'agendada') { e.preventDefault(); return; }
        onDragStart(partida);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={onDragEnd}
      style={{ cursor: partida.status === 'agendada' ? 'grab' : 'default' }}
    >
      {/* Status dot */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.3px',
          color: cfg.color,
        }}>
          <Icon size={9} />
          {cfg.label.toUpperCase()}
        </span>
        {partida.status === 'agendada' && (
          <GripVertical size={12} style={{ color: '#aaa' }} />
        )}
      </div>

      {/* Teams */}
      <div style={{ fontWeight: 700, fontSize: 12, color: cfg.color, lineHeight: 1.3, marginBottom: 4 }}>
        {partida.dupla1}
      </div>
      <div style={{ fontSize: 10, color: '#888', marginBottom: 2 }}>vs</div>
      <div style={{ fontWeight: 700, fontSize: 12, color: cfg.color, lineHeight: 1.3 }}>
        {partida.dupla2}
      </div>

      {/* Meta */}
      <div style={{ marginTop: 7, paddingTop: 6, borderTop: `1px solid ${cfg.border}40`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>{partida.categoria}</span>
        <span style={{ fontSize: 10, color: '#999' }}>{partida.fase}</span>
      </div>

      {/* Score if exists */}
      {partida.placar && (
        <div style={{
          marginTop: 5, fontSize: 11, fontWeight: 700,
          color: '#333', fontFamily: "'JetBrains Mono', monospace",
          background: 'rgba(0,0,0,0.04)', borderRadius: 4, padding: '2px 6px',
          textAlign: 'center',
        }}>
          {partida.placar}
        </div>
      )}

      {/* Pulse for warming up */}
      {partida.status === 'aquecimento' && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 8, height: 8, borderRadius: '50%',
          background: '#FFD700',
          animation: 'pulse-glow 2s infinite',
        }} />
      )}
    </div>
  );
}

function DroppableCell({ quadra, horario, partida, onDrop, onDragOver, onDragLeave, isOver, isConflict }) {
  return (
    <td
      onDragOver={(e) => { e.preventDefault(); onDragOver(quadra.id, horario); }}
      onDragLeave={onDragLeave}
      onDrop={() => onDrop(quadra.id, horario)}
      style={{
        verticalAlign: 'top',
        padding: '4px',
        minWidth: 170,
        height: 130,
        border: '1px solid #EEF2F8',
        borderRadius: 6,
        transition: 'all 0.15s ease',
        background: isConflict
          ? 'rgba(255,0,0,0.06)'
          : isOver
          ? 'rgba(0,102,153,0.06)'
          : 'transparent',
        outline: isConflict
          ? '2px dashed #FF0000'
          : isOver
          ? '2px dashed #006699'
          : 'none',
        outlineOffset: -2,
        position: 'relative',
      }}
    >
      {isConflict && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 4, pointerEvents: 'none', zIndex: 10,
        }}>
          <AlertCircle size={20} color="#FF0000" />
          <span style={{ fontSize: 10, color: '#CC0000', fontWeight: 700, textAlign: 'center' }}>
            Conflito de Quadra!
          </span>
        </div>
      )}
      {partida && <MatchCard partida={partida} onDragStart={() => {}} onDragEnd={() => {}} />}
    </td>
  );
}

export default function CronogramaPage() {
  const [partidas, setPartidas] = useState(initialPartidas);
  const [dragging, setDragging] = useState(null);
  const [overCell, setOverCell] = useState(null);
  const [conflictCell, setConflictCell] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');

  const quadrasAtivas = quadras.filter(q => q.ativa).slice(0, 6);

  const handleDragStart = (partida) => setDragging(partida);
  const handleDragEnd = () => {
    setDragging(null);
    setOverCell(null);
    setConflictCell(null);
  };

  const handleDragOver = (quadraId, horario) => {
    if (!dragging) return;
    const cell = `${quadraId}-${horario}`;
    setOverCell(cell);

    // Check conflict: same horario, same quadra occupied by another match
    const occupied = partidas.find(
      p => p.id !== dragging.id &&
        p.quadra === quadras.find(q => q.id === quadraId)?.numero &&
        p.horario === horario
    );
    setConflictCell(occupied ? cell : null);
  };

  const handleDrop = (quadraId, horario) => {
    if (!dragging) return;
    const cell = `${quadraId}-${horario}`;

    // Conflict check
    const quadraNum = quadras.find(q => q.id === quadraId)?.numero;
    const occupied = partidas.find(
      p => p.id !== dragging.id && p.quadra === quadraNum && p.horario === horario
    );
    if (occupied) {
      setConflictCell(cell);
      setTimeout(() => setConflictCell(null), 1500);
      setDragging(null);
      setOverCell(null);
      return;
    }

    setPartidas(prev => prev.map(p =>
      p.id === dragging.id ? { ...p, quadra: quadraNum, horario } : p
    ));
    setDragging(null);
    setOverCell(null);
    setConflictCell(null);
  };

  const getPartidaForCell = (quadraNum, horario) =>
    partidas.find(p => p.quadra === quadraNum && p.horario === horario);

  const statusCounts = {
    agendada: partidas.filter(p => p.status === 'agendada').length,
    aquecimento: partidas.filter(p => p.status === 'aquecimento').length,
    em_andamento: partidas.filter(p => p.status === 'em_andamento').length,
    finalizada: partidas.filter(p => p.status === 'finalizada').length,
  };

  return (
    <Layout title="Cronograma" subtitle="Arraste os blocos para reorganizar partidas nas quadras">
      {/* Status legend + filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Status legend */}
        <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap' }}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8,
              background: cfg.bg, border: `1.5px solid ${cfg.border}`,
              fontSize: 12, fontWeight: 600, color: cfg.color,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.border }} />
              {cfg.label}
              <span style={{ background: 'rgba(0,0,0,0.1)', borderRadius: 99, padding: '0 5px', fontSize: 11 }}>
                {statusCounts[key]}
              </span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Filter size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <select
              className="input"
              style={{ paddingLeft: 28, width: 'auto', fontSize: 13 }}
              value={filtroStatus}
              onChange={e => setFiltroStatus(e.target.value)}
            >
              <option value="todas">Todos os status</option>
              <option value="agendada">Agendadas</option>
              <option value="aquecimento">Aquecimento</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="finalizada">Finalizadas</option>
            </select>
          </div>
          <select
            className="input"
            style={{ width: 'auto', fontSize: 13 }}
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
          >
            <option value="todas">Todas as categorias</option>
            {categorias.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
          </select>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 16px', borderRadius: 10, marginBottom: 16,
        background: 'rgba(0,102,153,0.06)', border: '1px solid rgba(0,102,153,0.15)',
        fontSize: 12, color: '#006699',
      }}>
        <GripVertical size={15} />
        <strong>Drag & Drop:</strong> Arraste partidas <em>agendadas</em> entre as células. Conflitos de quadra são detectados automaticamente.
      </div>

      {/* Schedule Grid */}
      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: '100%' }}>
          <thead>
            <tr>
              <th style={{
                position: 'sticky', left: 0, zIndex: 10,
                background: '#003366', color: '#fff',
                padding: '12px 16px', fontSize: 12, fontWeight: 700,
                minWidth: 80, borderRight: '1px solid rgba(255,255,255,0.1)',
              }}>
                Horário
              </th>
              {quadrasAtivas.map(q => (
                <th key={q.id} style={{
                  background: '#003366', color: '#fff',
                  padding: '12px 16px', fontSize: 12, fontWeight: 700,
                  textAlign: 'center', minWidth: 170,
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div>Quadra {q.numero}</div>
                  <div style={{ fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                    {q.localizacao}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horarios.slice(0, 12).map((horario, rowIdx) => (
              <tr key={horario} style={{ background: rowIdx % 2 === 0 ? '#fff' : '#FAFBFD' }}>
                <td style={{
                  position: 'sticky', left: 0, zIndex: 5,
                  background: rowIdx % 2 === 0 ? '#fff' : '#FAFBFD',
                  padding: '0 16px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12, fontWeight: 700, color: '#555',
                  borderRight: '1px solid #EEF2F8',
                  width: 80,
                }}>
                  {horario}
                </td>
                {quadrasAtivas.map(q => {
                  const cellKey = `${q.id}-${horario}`;
                  const partida = getPartidaForCell(q.numero, horario);
                  return (
                    <DroppableCell
                      key={cellKey}
                      quadra={q}
                      horario={horario}
                      partida={partida}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={() => { if (overCell === cellKey) setOverCell(null); }}
                      isOver={overCell === cellKey && !conflictCell}
                      isConflict={conflictCell === cellKey}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
