import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volleyball, LogOut, Plus, ShieldAlert, Settings } from 'lucide-react';
import api from '../services/api';

export default function AdminTorneiosPage() {
  const [torneios, setTorneios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTorneio, setNewTorneio] = useState({
    nome: '', descricao: '', data_inicio: '', data_fim: '', local: '', numero_quadras: 4, horario_inicio: '08:00', horario_fim: '22:00'
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('@TourneyBeach:user') || '{}');

  useEffect(() => {
    if (user.tipo_usuario !== 'admin') {
      navigate('/dashboard'); // Redireciona não-admins
      return;
    }
    
    api.get('/torneios')
      .then(res => setTorneios(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate, user.tipo_usuario]);

  const handleLogout = () => {
    localStorage.removeItem('@TourneyBeach:token');
    localStorage.removeItem('@TourneyBeach:user');
    navigate('/login');
  };

  const handleCreateTorneio = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/torneios', newTorneio);
      setTorneios([res.data, ...torneios]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao criar torneio');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Navbar Admin Master */}
      <header style={{
        background: 'var(--color-surface)', padding: '16px 40px', borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--color-danger), #FF6600)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Master Admin</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Controle Global de Torneios</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 14 }}>{user.nome}</div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: 'var(--color-primary-light)' }}>Gerenciamento de Torneios</h1>
            <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0' }}>Crie novos eventos e defina os organizadores responsáveis.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Novo Torneio
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>Carregando torneios...</div>
        ) : (
          <div className="card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome do Torneio</th>
                  <th>Local</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Organizador ID</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {torneios.map(t => (
                  <tr key={t.id}>
                    <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{t.id.slice(0, 8)}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{t.nome}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{t.local}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{new Date(t.data_inicio).toLocaleDateString()}</td>
                    <td><span className="badge confirmada">{t.status}</span></td>
                    <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{t.criado_por?.slice(0, 8) || 'N/A'}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}>
                        <Settings size={14} /> Gerenciar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal Criar Torneio */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>Novo Torneio</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm">X</button>
            </div>
            <div className="modal-body">
              <form id="create-torneio" onSubmit={handleCreateTorneio} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Nome do Torneio</label>
                  <input className="input" required value={newTorneio.nome} onChange={e => setNewTorneio({...newTorneio, nome: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Descrição</label>
                  <textarea className="input" required value={newTorneio.descricao} onChange={e => setNewTorneio({...newTorneio, descricao: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Data Início</label>
                    <input type="date" className="input" required value={newTorneio.data_inicio} onChange={e => setNewTorneio({...newTorneio, data_inicio: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Data Fim</label>
                    <input type="date" className="input" required value={newTorneio.data_fim} onChange={e => setNewTorneio({...newTorneio, data_fim: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Local</label>
                  <input className="input" required value={newTorneio.local} onChange={e => setNewTorneio({...newTorneio, local: e.target.value})} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">Cancelar</button>
              <button type="submit" form="create-torneio" className="btn btn-primary">Criar Torneio</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
