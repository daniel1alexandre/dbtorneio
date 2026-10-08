import { useState, useEffect } from 'react';
import { Bell, ChevronDown, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ title, subtitle }) {
  const [wsConnected, setWsConnected] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    // Simulate WS flicker
    const wsTimer = setInterval(() => {
      setWsConnected(prev => {
        if (!prev) setTimeout(() => setWsConnected(true), 800);
        return true;
      });
    }, 15000);
    return () => { clearInterval(timer); clearInterval(wsTimer); };
  }, []);

  const formatTime = (d) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (d) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  return (
    <header className="main-header">
      {/* Back Button & Title */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0',
            background: '#fff', cursor: 'pointer', color: '#555',
            transition: 'all 0.2s'
          }}
          title="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          {title && <h1 className="page-title">{title}</h1>}
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>

      {/* WS Status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px',
        borderRadius: 99, border: '1px solid',
        borderColor: wsConnected ? 'rgba(0,170,0,0.25)' : 'rgba(255,0,0,0.25)',
        background: wsConnected ? 'rgba(0,170,0,0.06)' : 'rgba(255,0,0,0.06)',
        fontSize: 12, fontWeight: 600,
        color: wsConnected ? '#006600' : '#CC0000',
      }}>
        <div style={{ position: 'relative', width: 8, height: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: wsConnected ? '#00AA00' : '#FF0000',
            position: 'relative', zIndex: 1,
          }} />
          {wsConnected && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: '#00AA00',
              animation: 'ws-ping 1.2s cubic-bezier(0,0,0.2,1) infinite',
            }} />
          )}
        </div>
        {wsConnected ? 'WebSocket Ativo' : 'Reconectando...'}
        {wsConnected && <RefreshCw size={10} style={{ animation: 'spin-slow 4s linear infinite' }} />}
      </div>

      {/* Date/Time */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#333', fontFamily: "'JetBrains Mono', monospace" }}>
          {formatTime(currentTime)}
        </div>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'capitalize' }}>
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Notifications */}
      <button style={{
        position: 'relative', width: 38, height: 38, borderRadius: 10,
        border: '1.5px solid #E2E8F0', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#006699'; e.currentTarget.style.background = '#F0F8FF'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#fff'; }}
      >
        <Bell size={17} color="#555" />
        {notifCount > 0 && (
          <div style={{
            position: 'absolute', top: -5, right: -5,
            width: 18, height: 18, borderRadius: '50%',
            background: '#FF6600', color: '#fff',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff',
          }}>
            {notifCount}
          </div>
        )}
      </button>

      {/* Profile */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 12px 6px 6px', borderRadius: 10,
        border: '1.5px solid #E2E8F0', cursor: 'pointer',
        transition: 'all 0.2s', background: '#fff',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#006699'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, #003366, #006699)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 13,
        }}>C</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Carlos D.</div>
          <div style={{ fontSize: 11, color: '#888' }}>Admin</div>
        </div>
        <ChevronDown size={14} color="#888" />
      </div>
    </header>
  );
}
