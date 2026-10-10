import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import logo from '../assets/logo.jpg';
import api from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !senha) { setError('Preencha todos os campos.'); return; }
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, senha });
      localStorage.setItem('@TourneyBeach:token', response.data.token);
      localStorage.setItem('@TourneyBeach:user', JSON.stringify(response.data.user));
      
      const tipo = response.data.user.tipo_usuario;
      if (tipo === 'admin') {
        navigate('/admin-torneios');
      } else if (tipo === 'atleta') {
        navigate('/meus-torneios');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Inter', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(17,69,45,0.15) 0%, transparent 70%)',
        top: -200, right: -100, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(229,214,26,0.08) 0%, transparent 70%)',
        bottom: -100, left: -100, pointerEvents: 'none',
      }} />

      {/* Login card */}
      <div style={{
        background: 'var(--color-surface)', backdropFilter: 'blur(20px)',
        borderRadius: 24, padding: '44px 40px', width: '100%', maxWidth: 420,
        boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        border: '1px solid var(--color-border)',
        animation: 'fadeInUp 0.4s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 18,
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.5px', margin: 0 }}>
            DBTorneios
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 }}>
            Plataforma de Gestão de Torneios de Beach Tennis
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#AAA' }} />
                <input
                  className="input"
                  style={{ paddingLeft: 36 }}
                  type="email"
                  placeholder="baumann@viva.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#AAA' }} />
                <input
                  className="input"
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', padding: 4,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: '#FFF3E0', border: '1px solid #FFCC88',
                fontSize: 13, color: '#CC5500',
              }}>
                {error}
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              style={{ width: '100%', fontSize: 15, padding: '13px', marginTop: 4 }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} />
                  Entrando...
                </span>
              ) : 'Entrar no Sistema'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#555' }}>
          É atleta e quer jogar um torneio? <br/>
          <a href="/cadastro" style={{ color: '#FF6600', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: 4 }}>
            Crie sua conta aqui
          </a>
        </div>

        {/* Roles info */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #F0F4F8' }}>
          <div style={{ fontSize: 11, color: '#AAA', textAlign: 'center', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Perfis de Acesso
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Admin', 'Organizador', 'Árbitro', 'Espectador'].map((role, i) => (
              <span key={i} style={{
                padding: '3px 10px', borderRadius: 99,
                background: '#F0F4F8', color: '#555', fontSize: 11, fontWeight: 600,
              }}>
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
