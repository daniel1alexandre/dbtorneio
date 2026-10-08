import { useState } from 'react';
import Layout from '../components/Layout';
import { financeiro, dailyFinanceiro } from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Plus, Download, FileText, Table } from 'lucide-react';

const CATEGORY_COLORS = {
  Inscrição: '#006699',
  Patrocínio: '#003366',
  Infraestrutura: '#FF6600',
  'Operação de Quadra': '#CC4400',
  Premiação: '#FF0000',
  Equipe: '#FF8833',
  Brindes: '#FFB366',
};

const despesasPie = [
  { name: 'Infraestrutura', value: 8000, color: '#FF6600' },
  { name: 'Arbitragem', value: 3200, color: '#CC4400' },
  { name: 'Premiações', value: 4500, color: '#FF0000' },
  { name: 'Equipe', value: 2200, color: '#FF8833' },
  { name: 'Brindes', value: 1300, color: '#FFB366' },
];

function MetricCard({ label, value, sub, color, icon: Icon, animate = true }) {
  return (
    <div className={`animate-fade-in-up`} style={{
      background: '#fff', borderRadius: 14, padding: '20px 22px',
      border: '1px solid #E8EDF4', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}, ${color}BB)`,
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            {label}
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#1A2332', letterSpacing: '-0.5px' }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: '#AAA', marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={color} />
        </div>
      </div>
    </div>
  );
}

function LancamentoRow({ item, index }) {
  const isTipo = item.tipo?.startsWith('receita') || item.tipo === 'patrocinio';
  return (
    <tr className="animate-slide-up" style={{ animationDelay: `${index * 40}ms` }}>
      <td style={{ fontSize: 12, color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>
        {new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR')}
      </td>
      <td style={{ fontWeight: 600, color: '#333' }}>{item.descricao}</td>
      <td>
        <span style={{
          padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
          background: (CATEGORY_COLORS[item.categoria] || '#888') + '18',
          color: CATEGORY_COLORS[item.categoria] || '#888',
        }}>
          {item.categoria}
        </span>
      </td>
      <td>
        <span style={{
          fontWeight: 800, fontSize: 14,
          color: isTipo ? '#00AA00' : '#CC0000',
        }}>
          {isTipo ? '+' : '−'} R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </td>
    </tr>
  );
}

export default function FinanceiroPage() {
  const [tab, setTab] = useState('visao_geral');
  const [modalOpen, setModalOpen] = useState(false);

  const formatCurrency = (v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  const allLancamentos = [...financeiro.receitas, ...financeiro.despesas].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <Layout title="Financeiro" subtitle="Balanço consolidado e controle de receitas e despesas">
      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Receita Total" value={formatCurrency(financeiro.receita_total)} sub="Todas as fontes" color="#00AA00" icon={TrendingUp} />
        <MetricCard label="Despesa Total" value={formatCurrency(financeiro.despesa_total)} sub="Custos operacionais" color="#FF0000" icon={TrendingDown} />
        <MetricCard label="Lucro Líquido" value={formatCurrency(financeiro.lucro)} sub="Margem realizada" color="#006699" icon={DollarSign} />
        <MetricCard label="Taxa Conversão PIX" value={`${financeiro.taxa_conversao}%`} sub="Sobre cobranças emitidas" color="#FF6600" icon={Percent} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', padding: 4, borderRadius: 12, border: '1px solid #E8EDF4', width: 'fit-content' }}>
        {[
          { id: 'visao_geral', label: 'Visão Geral' },
          { id: 'extrato', label: 'Extrato' },
          { id: 'graficos', label: 'Gráficos' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              background: tab === t.id ? '#003366' : 'transparent',
              color: tab === t.id ? '#fff' : '#888',
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Visão Geral */}
      {tab === 'visao_geral' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="animate-fade-in">
          {/* Receitas */}
          <div className="card">
            <div className="card-header">
              <div style={{ fontWeight: 700, fontSize: 15, color: '#00AA00', display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={18} color="#00AA00" />
                Receitas
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, color: '#00AA00' }}>
                {formatCurrency(financeiro.receita_total)}
              </span>
            </div>
            <div className="card-body" style={{ padding: '12px 0' }}>
              {financeiro.receitas.map((r, i) => (
                <div key={r.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 24px', borderBottom: i < financeiro.receitas.length - 1 ? '1px solid #F5F8FB' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{r.descricao}</div>
                    <div style={{ fontSize: 11, color: '#AAA', marginTop: 2 }}>{r.data}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#00AA00', fontSize: 14 }}>
                    +{formatCurrency(r.valor)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Despesas */}
          <div className="card">
            <div className="card-header">
              <div style={{ fontWeight: 700, fontSize: 15, color: '#CC0000', display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingDown size={18} color="#CC0000" />
                Despesas
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, color: '#CC0000' }}>
                {formatCurrency(financeiro.despesa_total)}
              </span>
            </div>
            <div className="card-body" style={{ padding: '12px 0' }}>
              {financeiro.despesas.map((d, i) => (
                <div key={d.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 24px', borderBottom: i < financeiro.despesas.length - 1 ? '1px solid #F5F8FB' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{d.descricao}</div>
                    <div style={{ fontSize: 11, color: '#AAA', marginTop: 2 }}>
                      <span style={{ padding: '1px 7px', borderRadius: 99, background: (CATEGORY_COLORS[d.categoria] || '#888') + '18', color: CATEGORY_COLORS[d.categoria] || '#888', fontSize: 10, fontWeight: 600 }}>
                        {d.categoria}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#CC0000', fontSize: 14 }}>
                    −{formatCurrency(d.valor)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Extrato */}
      {tab === 'extrato' && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2332' }}>Extrato Completo</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setModalOpen(true)}>
                <Plus size={13} /> Novo Lançamento
              </button>
              <button className="btn btn-ghost btn-sm">
                <FileText size={13} /> PDF
              </button>
              <button className="btn btn-ghost btn-sm">
                <Table size={13} /> XLSX
              </button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {allLancamentos.map((item, i) => <LancamentoRow key={item.id} item={item} index={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gráficos */}
      {tab === 'graficos' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }} className="animate-fade-in">
          <div className="card">
            <div className="card-header">
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2332' }}>Receitas vs Despesas por Dia</div>
            </div>
            <div style={{ padding: '20px 16px 12px' }}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dailyFinanceiro} barGap={4} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
                  <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`R$ ${v.toLocaleString('pt-BR')}`, '']} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="receita" name="Receita" fill="#00AA00" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="despesa" name="Despesa" fill="#FF6600" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2332' }}>Distribuição de Despesas</div>
            </div>
            <div style={{ padding: '16px' }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={despesasPie} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                    {despesasPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`R$ ${v.toLocaleString('pt-BR')}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {despesasPie.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#555' }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                      {item.name}
                    </div>
                    <span style={{ fontWeight: 700, color: '#333' }}>R$ {item.value.toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Lançamento */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: 800, fontSize: 17 }}>Novo Lançamento</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Tipo</label>
                  <select className="input">
                    <option value="receita_inscricao">Receita de Inscrição</option>
                    <option value="patrocinio">Patrocínio</option>
                    <option value="despesa_quadra">Despesa de Quadra</option>
                    <option value="despesa_arbitragem">Despesa de Arbitragem</option>
                    <option value="despesa_equipe">Despesa de Equipe</option>
                    <option value="despesa_premio">Despesa de Premiação</option>
                    <option value="brinde">Brinde</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Descrição</label>
                  <input className="input" placeholder="Ex: Locação de equipamentos" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Valor (R$)</label>
                    <input className="input" type="number" placeholder="0,00" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Data</label>
                    <input className="input" type="date" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Categoria Contábil</label>
                  <input className="input" placeholder="Ex: Operação de Quadra" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setModalOpen(false)}>Registrar Lançamento</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
