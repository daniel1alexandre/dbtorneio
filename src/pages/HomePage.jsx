import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logo.jpg';

export default function HomePage() {
  const [torneios, setTorneios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch only tournaments with "inscricoes_abertas" status or all?
    // Let's fetch all for now
    api.get('/torneios')
      .then(res => setTorneios(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Public Header */}
      <header style={{
        background: 'var(--color-surface)', padding: '20px 40px', borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden' }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>DBTorneios</div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/login" className="btn btn-ghost">Entrar</Link>
          <Link to="/cadastro" className="btn btn-primary">Criar Conta</Link>
        </div>
      </header>

      <main style={{ flex: 1, padding: '60px 20px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', marginBottom: 16, background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Encontre o seu próximo desafio
          </h1>
          <p style={{ fontSize: 18, color: 'var(--color-text-muted)', maxWidth: 600, margin: '0 auto' }}>
            Acompanhe circuitos, participe de torneios de Beach Tennis e suba no ranking da plataforma.
          </p>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Torneios Abertos</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>Carregando torneios...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {torneios.map(t => (
              <div key={t.id} className="card" style={{ padding: 24, cursor: 'pointer', transition: 'all 0.3s ease' }} onClick={() => navigate(`/torneio/${t.id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 20, lineHeight: 1.2 }}>{t.nome}</div>
                  <span className="badge confirmada">Aberto</span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Calendar size={16} /> {new Date(t.data_inicio).toLocaleDateString('pt-BR')}
                </div>
                <div style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>📍 {t.local}</div>
                
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)', fontWeight: 600, fontSize: 14, gap: 8 }}>
                  Ver Detalhes e Participantes <ArrowRight size={16} />
                </div>
              </div>
            ))}
            {torneios.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, background: 'var(--color-surface)', borderRadius: 16, color: 'var(--color-text-muted)' }}>
                Nenhum torneio disponível no momento.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
