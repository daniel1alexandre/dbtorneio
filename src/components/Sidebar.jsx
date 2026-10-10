import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Trophy, DollarSign,
  Settings, Wifi, LogOut, Users, Monitor
} from 'lucide-react';
import logo from '../assets/logo.jpg';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inscricoes', icon: Users, label: 'Inscrições' },
  { to: '/cronograma', icon: Calendar, label: 'Cronograma' },
  { to: '/chaveamento', icon: Trophy, label: 'Chaveamento' },
  { to: '/arbitro', icon: Trophy, label: 'Árbitro' },
  { to: '/financeiro', icon: DollarSign, label: 'Financeiro' },
  { to: '/telao', icon: Monitor, label: 'Modo Telão' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('@TourneyBeach:user') || '{"nome": "Desconhecido", "tipo_usuario": "N/A"}');

  const handleLogout = () => {
    localStorage.removeItem('@TourneyBeach:token');
    localStorage.removeItem('@TourneyBeach:user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            flexShrink: 0,
          }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px' }}>
              DBTorneios
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Gestão de Torneios
            </div>
          </div>
        </div>

        {/* Active tournament badge */}
        <div style={{
          marginTop: 14, padding: '8px 12px', borderRadius: 8,
          background: 'rgba(255,102,0,0.15)', border: '1px solid rgba(255,102,0,0.3)',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Torneio Ativo</div>
          <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>
            Copa Elite Copacabana 2026
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={17} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 12px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'rgba(255,255,255,0.05)',
          marginBottom: 8,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #006699, #0088CC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13,
          }}>
            {user.nome.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.nome}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'capitalize' }}>{user.tipo_usuario}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'rgba(255,255,255,0.45)', fontSize: 13,
            fontFamily: 'inherit', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,0,0,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={15} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
