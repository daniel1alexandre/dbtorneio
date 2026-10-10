import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, LogOut, CheckCircle, Clock } from 'lucide-react';
import logo from '../assets/logo.jpg';
import api from '../services/api';

export default function AtletaDashboardPage() {
  const [torneios, setTorneios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('@TourneyBeach:user') || '{}');

  useEffect(() => {
    // Busca torneios abertos
    api.get('/torneios')
      .then(res => setTorneios(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('@TourneyBeach:token');
    localStorage.removeItem('@TourneyBeach:user');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar Atleta */}
      <header style={{
        background: 'var(--color-surface)', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden' }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>DBTorneios</div>
          <div style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>Portal do Atleta</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 14 }}>Olá, <strong style={{ color: '#FFD700' }}>{user.nome}</strong></div>
          <button onClick={handleLogout} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
            padding: '6px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
          }}>
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', marginBottom: 8 }}>Torneios Disponíveis</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 30 }}>Escolha um evento e faça sua inscrição.</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>Carregando torneios...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {torneios.map(t => (
              <div key={t.id} className="card" style={{
                padding: 24, display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-text)', lineHeight: 1.2 }}>{t.nome}</div>
                  <div style={{ background: '#E8F5E8', color: '#00AA00', padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                    ABERTO
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Calendar size={14} /> {new Date(t.data_inicio).toLocaleDateString('pt-BR')} - {new Date(t.data_fim).toLocaleDateString('pt-BR')}
                </div>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>📍 {t.local}</div>
                
                <div style={{ marginTop: 'auto' }}>
                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Fazer Inscrição
                  </button>
                </div>
              </div>
            ))}
            {torneios.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#888', background: '#fff', borderRadius: 12 }}>
                Nenhum torneio com inscrições abertas no momento.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
