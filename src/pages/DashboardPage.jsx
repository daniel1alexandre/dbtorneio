import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Users, DollarSign, Play, TrendingUp,
  CheckCircle, Clock, AlertTriangle, ArrowUpRight,
  Zap, Activity
} from 'lucide-react';

function StatCard({ label, value, sub, icon: Icon, color, colorClass, delay = 0 }) {
  return (
    <div className={`stat-card ${colorClass} animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}18`, border: `1.5px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} color={color} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 12, color: '#00AA00', fontWeight: 600,
          background: '#E8F5E8', padding: '3px 8px', borderRadius: 99,
        }}>
          <ArrowUpRight size={12} />
          +12%
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: '#1A2332', letterSpacing: '-1px', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: '#666', marginTop: 6, fontWeight: 500 }}>{label}</div>
      {sub && (
        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

function PixRow({ item, index }) {
  return (
    <tr className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
      <td>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#888' }}>
          {item.id}
        </span>
      </td>
      <td style={{ fontWeight: 600, color: '#333' }}>{item.atleta}</td>
      <td>
        <span style={{ fontWeight: 700, color: '#006699' }}>
          R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </td>
      <td style={{ color: '#888', fontSize: 13 }}>{item.horario}</td>
      <td>
        <span className={`badge ${item.status}`}>
          {item.status === 'confirmado' ? <CheckCircle size={10} /> : <Clock size={10} />}
          {item.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
        </span>
      </td>
    </tr>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
        padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        fontSize: 13,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: '#333' }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
            {p.name}: <strong>{p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return (
    <Layout title="Dashboard" subtitle="Carregando métricas...">
      <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Carregando dados do servidor...</div>
    </Layout>
  );

  const {
    torneio, totalVagas, vagasPreenchidas, partidas,
    inscricoes, categorias, dailyInscricoes, nivelDistribuicao, recentePix
  } = data;
  
  const ocupacao = totalVagas > 0 ? Math.round((vagasPreenchidas / totalVagas) * 100) : 0;
  const lucroEstimado = inscricoes.receitaTotal * 0.6; // Mock para a margin de 60%

  return (
    <Layout title="Dashboard" subtitle={`${torneio?.nome || 'Torneio Principal'} · ${torneio?.local || 'Sem local'}`}>
      {/* ── Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
        <StatCard
          label="Atletas Inscritos"
          value={`${vagasPreenchidas}`}
          sub={`${ocupacao}% das vagas preenchidas`}
          icon={Users}
          color="#006699"
          colorClass="blue"
          delay={0}
        />
        <StatCard
          label="Receita PIX"
          value={`R$ ${(inscricoes.receitaTotal / 1000).toFixed(1)}k`}
          sub={`${inscricoes.confirmadas} pagamentos confirmados`}
          icon={DollarSign}
          color="#FF6600"
          colorClass="orange"
          delay={100}
        />
        <StatCard
          label="Partidas"
          value={`${partidas.total}`}
          sub={`${partidas.em_andamento + partidas.aquecimento} ativas agora`}
          icon={Play}
          color="#00AA00"
          colorClass="green"
          delay={200}
        />
        <StatCard
          label="Lucro Líquido"
          value={`R$ ${(lucroEstimado / 1000).toFixed(1)}k`}
          sub={`Margem estimada de 60%`}
          icon={TrendingUp}
          color="#FFD700"
          colorClass="gold"
          delay={300}
        />
      </div>

      {/* ── Status quick bar ── */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap',
      }}>
        {[
          { icon: CheckCircle, label: 'Finalizadas', val: partidas.finalizadas, color: '#999' },
          { icon: Activity, label: 'Em Andamento', val: partidas.em_andamento, color: '#00AA00' },
          { icon: Zap, label: 'Aquecimento', val: partidas.aquecimento, color: '#FFD700' },
          { icon: AlertTriangle, label: 'PIX Pendentes', val: inscricoes.pendentes, color: '#FF6600' },
          { icon: Clock, label: 'Agendadas', val: partidas.agendadas, color: '#006699' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 10, background: '#fff',
            border: '1px solid #E8EDF4', fontSize: 13,
          }} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <item.icon size={15} color={item.color} />
            <span style={{ color: '#555', fontWeight: 500 }}>{item.label}:</span>
            <span style={{ fontWeight: 800, color: item.color, fontSize: 15 }}>{item.val}</span>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 24 }}>
        {/* Area Chart - Inscrições */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="card-header">
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2332' }}>Volume de Inscrições por Dia</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Confirmadas, pendentes e canceladas</div>
            </div>
          </div>
          <div style={{ padding: '20px 16px 8px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dailyInscricoes}>
                <defs>
                  <linearGradient id="gradConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006699" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#006699" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6600" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6600" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Area type="monotone" dataKey="confirmadas" name="Confirmadas" stroke="#006699" strokeWidth={2.5} fill="url(#gradConf)" />
                <Area type="monotone" dataKey="pendentes" name="Pendentes" stroke="#FF6600" strokeWidth={2} fill="url(#gradPend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Níveis */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          <div className="card-header">
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2332' }}>Atletas por Nível</div>
          </div>
          <div style={{ padding: '16px 8px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={nivelDistribuicao}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {nivelDistribuicao.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v + ' atletas', n]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 8px' }}>
              {nivelDistribuicao.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#555' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                    {item.name}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#333' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent PIX Table ── */}
      <div className="card animate-fade-in-up" style={{ animationDelay: '350ms' }}>
        <div className="card-header">
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2332' }}>Últimas Confirmações PIX</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Recebidos via webhook bancário</div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 99,
            background: 'rgba(0,170,0,0.08)', border: '1px solid rgba(0,170,0,0.2)',
            fontSize: 12, color: '#006600', fontWeight: 600,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00AA00', animation: 'ws-ping 1.2s infinite' }} />
            Ao Vivo
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>PIX ID</th>
                <th>Atleta</th>
                <th>Valor</th>
                <th>Horário</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentePix.map((item, i) => <PixRow key={item.id} item={item} index={i} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Categories progress ── */}
      <div className="card animate-fade-in-up" style={{ marginTop: 20, animationDelay: '450ms' }}>
        <div className="card-header">
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2332' }}>Ocupação por Categoria</div>
          <button className="btn btn-primary btn-sm">Gerenciar Chaves</button>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {categorias.map((cat, i) => {
              const pct = cat.numero_vagas > 0 ? Math.round((cat.vagas_preenchidas / cat.numero_vagas) * 100) : 0;
              const color = pct >= 100 ? '#FF6600' : pct >= 75 ? '#006699' : '#00AA00';
              return (
                <div key={cat.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{cat.nome}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>
                      {cat.vagas_preenchidas}/{cat.numero_vagas}
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}BB)` }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                    {pct}% ocupação
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
