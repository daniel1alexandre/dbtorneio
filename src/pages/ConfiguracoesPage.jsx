import { useState } from 'react';
import Layout from '../components/Layout';
import { Settings, Globe, Shield, Bell, Database, Wifi, Save, ChevronRight } from 'lucide-react';

const sections = [
  { id: 'torneio', label: 'Torneio', icon: Globe },
  { id: 'seguranca', label: 'Segurança', icon: Shield },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'integracao', label: 'Integrações', icon: Wifi },
  { id: 'banco', label: 'Banco de Dados', icon: Database },
];

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 48, height: 26, borderRadius: 99, cursor: 'pointer',
        background: checked ? '#006699' : '#DDD',
        position: 'relative', transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, width: 20, height: 20,
        borderRadius: '50%', background: '#fff',
        left: checked ? 25 : 3,
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderBottom: '1px solid #F0F4F8',
    }}>
      <div style={{ flex: 1, paddingRight: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

export default function ConfiguracoesPage() {
  const [section, setSection] = useState('torneio');
  const [config, setConfig] = useState({
    inscricoes_abertas: true,
    websocket_ativo: true,
    notif_pix: true,
    notif_partida: true,
    notif_email: false,
    modo_manutencao: false,
    telao_auto: true,
    tempo_aquecimento: 300,
    tempo_painel_telao: 30,
  });

  const toggle = (key) => setConfig(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <Layout title="Configurações" subtitle="Parâmetros globais da plataforma DBTorneios">
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Sidebar nav */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div className="card" style={{ padding: '8px' }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: 600, textAlign: 'left',
                  background: section === s.id ? '#003366' : 'transparent',
                  color: section === s.id ? '#fff' : '#555',
                  transition: 'all 0.2s', marginBottom: 2,
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <s.icon size={16} />
                  {s.label}
                </span>
                {section === s.id && <ChevronRight size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {section === 'torneio' && (
            <div className="card animate-fade-in">
              <div className="card-header">
                <div style={{ fontWeight: 700, fontSize: 15 }}>Configurações do Torneio</div>
              </div>
              <div className="card-body">
                <SettingRow label="Inscrições Abertas" desc="Permitir novas inscrições públicas no torneio ativo">
                  <Toggle checked={config.inscricoes_abertas} onChange={() => toggle('inscricoes_abertas')} />
                </SettingRow>
                <SettingRow label="Modo Manutenção" desc="Bloqueia acesso público e exibe página de manutenção">
                  <Toggle checked={config.modo_manutencao} onChange={() => toggle('modo_manutencao')} />
                </SettingRow>
                <SettingRow label="Telão Automático" desc="Alternância automática entre painéis no modo telão">
                  <Toggle checked={config.telao_auto} onChange={() => toggle('telao_auto')} />
                </SettingRow>
                <SettingRow label="Tempo de Aquecimento (s)" desc="Duração do timer de aquecimento antes de cada partida">
                  <input
                    className="input"
                    type="number"
                    value={config.tempo_aquecimento}
                    onChange={e => setConfig(prev => ({ ...prev, tempo_aquecimento: Number(e.target.value) }))}
                    style={{ width: 100, textAlign: 'center' }}
                  />
                </SettingRow>
                <SettingRow label="Tempo por Painel Telão (s)" desc="Tempo de exibição de cada painel no modo telão">
                  <input
                    className="input"
                    type="number"
                    value={config.tempo_painel_telao}
                    onChange={e => setConfig(prev => ({ ...prev, tempo_painel_telao: Number(e.target.value) }))}
                    style={{ width: 100, textAlign: 'center' }}
                  />
                </SettingRow>

                <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                  <button className="btn btn-ghost">Restaurar Padrões</button>
                  <button className="btn btn-primary"><Save size={14} /> Salvar Configurações</button>
                </div>
              </div>
            </div>
          )}

          {section === 'seguranca' && (
            <div className="card animate-fade-in">
              <div className="card-header">
                <div style={{ fontWeight: 700, fontSize: 15 }}>Segurança e Acesso</div>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  {[
                    { label: 'JWT Secret', value: '••••••••••••••••••••••' },
                    { label: 'Token Expiração', value: '24h' },
                    { label: 'PIX Webhook Secret', value: '••••••••••••' },
                    { label: 'Denylist Redis TTL', value: '86400s' },
                  ].map((field, i) => (
                    <div key={i}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{field.label}</label>
                      <input className="input" value={field.value} readOnly style={{ fontFamily: "'JetBrains Mono', monospace" }} />
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px', background: '#FFF8DC', borderRadius: 10, border: '1px solid #FFD700', fontSize: 13, color: '#664400' }}>
                  ⚠️ As chaves de segurança devem ser configuradas via variáveis de ambiente no servidor. Edite o arquivo <code>.env</code> na raiz do backend.
                </div>
              </div>
            </div>
          )}

          {section === 'notificacoes' && (
            <div className="card animate-fade-in">
              <div className="card-header">
                <div style={{ fontWeight: 700, fontSize: 15 }}>Notificações</div>
              </div>
              <div className="card-body">
                <SettingRow label="Notificação de PIX" desc="Alerta em tempo real ao confirmar pagamento via webhook">
                  <Toggle checked={config.notif_pix} onChange={() => toggle('notif_pix')} />
                </SettingRow>
                <SettingRow label="Notificação de Partida" desc="Alerta quando uma partida é iniciada ou finalizada">
                  <Toggle checked={config.notif_partida} onChange={() => toggle('notif_partida')} />
                </SettingRow>
                <SettingRow label="Confirmação por E-mail" desc="Enviar e-mail de confirmação de inscrição ao atleta">
                  <Toggle checked={config.notif_email} onChange={() => toggle('notif_email')} />
                </SettingRow>
                <div style={{ marginTop: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>SMTP / API de E-mail</label>
                  <input className="input" placeholder="SendGrid API Key ou configuração SMTP" style={{ marginBottom: 10 }} />
                  <input className="input" placeholder="E-mail remetente (ex: noreply@tourneybeach.com)" />
                </div>
                <div style={{ marginTop: 20 }}>
                  <button className="btn btn-primary"><Save size={14} /> Salvar</button>
                </div>
              </div>
            </div>
          )}

          {section === 'integracao' && (
            <div className="card animate-fade-in">
              <div className="card-header">
                <div style={{ fontWeight: 700, fontSize: 15 }}>Integrações Externas</div>
              </div>
              <div className="card-body">
                {[
                  { label: 'PSP PIX Client ID', placeholder: 'ID de cliente do provedor PIX' },
                  { label: 'Certificado mTLS', placeholder: 'Caminho do certificado .pem' },
                  { label: 'PIX Webhook URL', placeholder: 'https://api.tourneybeach.com/v1/pagamentos/webhook' },
                  { label: 'AWS S3 Bucket', placeholder: 'tourneybeach-media-prod' },
                  { label: 'Redis URL', placeholder: 'redis://localhost:6379' },
                ].map((field, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{field.label}</label>
                    <input className="input" placeholder={field.placeholder} />
                  </div>
                ))}
                <div style={{ marginTop: 8 }}>
                  <button className="btn btn-primary"><Save size={14} /> Salvar Integrações</button>
                </div>
              </div>
            </div>
          )}

          {section === 'banco' && (
            <div className="card animate-fade-in">
              <div className="card-header">
                <div style={{ fontWeight: 700, fontSize: 15 }}>Banco de Dados</div>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
                  {[
                    { label: 'Tabelas', value: '11' },
                    { label: 'Total de Registros', value: '2.847' },
                    { label: 'Tamanho do Banco', value: '84.2 MB' },
                    { label: 'Conexões Ativas', value: '7 / 100' },
                    { label: 'Versão PostgreSQL', value: '16.2' },
                    { label: 'Último Backup', value: 'Hoje 03:00' },
                  ].map((item, i) => (
                    <div key={i} style={{ background: '#F8FAFC', borderRadius: 10, padding: '14px 16px', border: '1px solid #E8EDF4' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#1A2332' }}>{item.value}</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-ghost btn-sm"><Database size={13} /> Executar Migrations</button>
                  <button className="btn btn-ghost btn-sm">Fazer Backup Agora</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: '#CC0000' }}>Limpar Cache Redis</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
