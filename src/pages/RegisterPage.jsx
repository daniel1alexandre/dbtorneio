import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.jpg';
import api from '../services/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '', email: '', cpf: '', telefone: '', senha: '', genero: '', nivel: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      navigate('/login', { state: { message: 'Cadastro realizado com sucesso! Faça seu login.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', padding: '20px'
    }}>
      <div className="card animate-fade-in-up" style={{ width: '100%', maxWidth: 500, padding: 40, borderRadius: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 16,
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)' }}>Crie sua Conta</div>
          <div style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>Portal do Atleta DBTorneios</div>
        </div>

        {error && (
          <div style={{ background: '#FFE8E8', color: '#CC0000', padding: 12, borderRadius: 8, fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>Nome Completo</label>
            <input
              type="text" className="input" required
              value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>E-mail</label>
              <input
                type="email" className="input" required
                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>CPF</label>
              <input
                type="text" className="input" required
                value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>Telefone</label>
              <input
                type="text" className="input"
                value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>Gênero</label>
              <select className="input" value={formData.genero} onChange={e => setFormData({ ...formData, genero: e.target.value })}>
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>Nível de Jogo</label>
              <select className="input" value={formData.nivel} onChange={e => setFormData({ ...formData, nivel: e.target.value })}>
                <option value="">Selecione</option>
                <option value="Pro">Profissional</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D (Iniciante)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>Senha</label>
              <input
                type="password" className="input" required
                value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: 16, marginTop: 10, justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : <><UserPlus size={18} /> Cadastrar Conta</>}
          </button>

          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 14, color: 'var(--color-text-muted)' }}>
            Já possui conta? <Link to="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 600, textDecoration: 'none' }}>Fazer login <ArrowRight size={14} style={{ verticalAlign: 'middle' }} /></Link>
          </div>
        </form>
      </div>
    </div>
  );
}
