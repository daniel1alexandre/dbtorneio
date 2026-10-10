import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.jpg';
import api from '../services/api';

export default function TorneioDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('@TourneyBeach:user') || 'null');

  useEffect(() => {
    api.get(`/torneios/${id}/detalhes`)
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        alert('Erro ao buscar torneio');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleInscricao = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.tipo_usuario !== 'atleta') {
      alert('Apenas atletas podem se inscrever.');
      return;
    }
    // TODO: Abrir modal ou página de inscrição passando o id do torneio e categorias
    alert('Funcionalidade de Seleção de Categoria/Parceiro em desenvolvimento.');
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>Carregando torneio...</div>;
  if (!data) return <div style={{ padding: 40, textAlign: 'center' }}>Torneio não encontrado.</div>;

  const { torneio, categorias } = data;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--color-surface)', padding: '20px 40px', borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden' }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>DBTorneios</div>
        </div>
        {user ? (
          <div style={{ color: 'var(--color-text-muted)' }}>Olá, {user.nome}</div>
        ) : (
          <button onClick={() => navigate('/login')} className="btn btn-ghost">Entrar</button>
        )}
      </header>

      <main style={{ flex: 1, padding: '40px 20px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <div className="card" style={{ marginBottom: 32, overflow: 'visible' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-surface))', padding: '40px 32px', borderBottom: '1px solid var(--color-border)' }}>
            <span className="badge confirmada" style={{ marginBottom: 12 }}>Inscrições Abertas</span>
            <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>{torneio.nome}</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 16, maxWidth: 600, lineHeight: 1.5 }}>
              {torneio.descricao}
            </p>
            
            <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text)' }}>
                <Calendar size={18} color="var(--color-primary)" />
                {new Date(torneio.data_inicio).toLocaleDateString()} a {new Date(torneio.data_fim).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text)' }}>
                <MapPin size={18} color="var(--color-accent)" />
                {torneio.local}
              </div>
            </div>
          </div>
          
          <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface)' }}>
            <div>
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Status atual</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-success)' }}>Preparando Chaveamento</div>
            </div>
            <button onClick={handleInscricao} className="btn btn-primary" style={{ padding: '12px 32px', fontSize: 16 }}>
              Fazer Inscrição <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Inscritos por Categoria</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {categorias.map(cat => (
            <div key={cat.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{cat.nome}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{cat.vagas_preenchidas} / {cat.numero_vagas} vagas</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 8, fontSize: 14, fontWeight: 700, color: 'var(--color-accent)' }}>
                  R$ {cat.valor_inscricao}
                </div>
              </div>
              
              {cat.inscricoes.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
                  {cat.inscricoes.map(insc => (
                    <div key={insc.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)', padding: '10px 16px', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={16} color="var(--color-primary-light)" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{insc.atleta1}</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{insc.atleta2 || 'Aguardando Parceiro'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 8, color: 'var(--color-text-muted)', fontSize: 14 }}>
                  Nenhuma dupla inscrita nesta categoria ainda.
                </div>
              )}
            </div>
          ))}
          {categorias.length === 0 && (
            <div style={{ color: 'var(--color-text-muted)' }}>Nenhuma categoria configurada para este torneio.</div>
          )}
        </div>
      </main>
    </div>
  );
}
