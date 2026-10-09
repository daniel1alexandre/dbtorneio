import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Search, Filter, Plus, CheckCircle, Clock, XCircle, Eye, Download, QrCode } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    confirmada: { label: 'Confirmada', icon: CheckCircle, color: '#006600', bg: '#E8F5E8' },
    pendente: { label: 'Pendente', icon: Clock, color: '#CC5500', bg: '#FFF3E0' },
    cancelada: { label: 'Cancelada', icon: XCircle, color: '#CC0000', bg: '#FFE8E8' },
  };
  const cfg = map[status] || map.pendente;
  return (
    <span className={`badge ${status}`} style={{ background: cfg.bg, color: cfg.color }}>
      <cfg.icon size={10} />
      {cfg.label}
    </span>
  );
}

export default function InscricoesPage() {
  const [search, setSearch] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInsc, setSelectedInsc] = useState(null);
  
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca do banco de dados
    api.get('/inscricoes')
      .then(res => {
        const data = res.data.map(i => ({
          id: i.id,
          status: i.status,
          atleta: i.atleta_nome,
          parceiro: i.parceiro_nome,
          categoria: i.categoria_nome,
          valor_pago: parseFloat(i.valor_pago),
          data_inscricao: i.data_inscricao,
          data_pagamento: i.data_pagamento,
          pix_id: i.pix_id
        }));
        setInscricoes(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categoriasUnicas = Array.from(new Set(inscricoes.map(i => i.categoria)));

  const filtered = inscricoes.filter(i => {
    const matchSearch = !search || i.atleta.toLowerCase().includes(search.toLowerCase()) || i.parceiro?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filtroStatus === 'todas' || i.status === filtroStatus;
    const matchCat = filtroCategoria === 'todas' || i.categoria === filtroCategoria;
    return matchSearch && matchStatus && matchCat;
  });

  const totais = {
    confirmadas: inscricoes.filter(i => i.status === 'confirmada').length,
    pendentes: inscricoes.filter(i => i.status === 'pendente').length,
    canceladas: inscricoes.filter(i => i.status === 'cancelada').length,
    receita: inscricoes.reduce((a, i) => a + i.valor_pago, 0),
  };

  return (
    <Layout title="Inscrições" subtitle="Gerenciar inscrições e pagamentos do torneio">
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Carregando inscrições...</div>
      ) : (
        <>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Confirmadas', value: totais.confirmadas, color: '#00AA00', bg: '#E8F5E8', icon: CheckCircle },
          { label: 'Pendentes', value: totais.pendentes, color: '#FF6600', bg: '#FFF3E0', icon: Clock },
          { label: 'Canceladas', value: totais.canceladas, color: '#CC0000', bg: '#FFE8E8', icon: XCircle },
          { label: 'Receita PIX', value: `R$ ${totais.receita.toLocaleString('pt-BR')}`, color: '#006699', bg: '#E8F4FD', icon: CheckCircle },
        ].map((item, i) => (
          <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms`, background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #E8EDF4', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <item.icon size={20} color={item.color} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1A2332' }}>{item.value}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="card">
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #F0F4F8',
          display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input
              className="input"
              style={{ paddingLeft: 36 }}
              placeholder="Buscar atleta ou parceiro..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <select className="input" style={{ width: 'auto' }} value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="todas">Todos os status</option>
            <option value="confirmada">Confirmadas</option>
            <option value="pendente">Pendentes</option>
            <option value="cancelada">Canceladas</option>
          </select>

          {/* Category filter */}
          <select className="input" style={{ width: 'auto' }} value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="todas">Todas as categorias</option>
            {categoriasUnicas.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {/* Actions */}
          <button className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
            <Download size={14} />
            Exportar
          </button>
          <button className="btn btn-primary btn-sm" style={{ gap: 6 }}>
            <Plus size={14} />
            Nova Inscrição
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Atleta Principal</th>
                <th>Parceiro</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Valor Pago</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((insc, i) => (
                <tr key={insc.id} className="animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#AAA' }}>
                      #{(i + 1).toString().padStart(3, '0')}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#1A2332' }}>{insc.atleta}</td>
                  <td style={{ color: '#555' }}>{insc.parceiro || <span style={{ color: '#CCC', fontStyle: 'italic' }}>Individual</span>}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                      background: '#F0F4F8', color: '#555',
                    }}>
                      {insc.categoria}
                    </span>
                  </td>
                  <td><StatusBadge status={insc.status} /></td>
                  <td>
                    {insc.valor_pago > 0
                      ? <span style={{ fontWeight: 700, color: '#006699' }}>R$ {insc.valor_pago.toFixed(2)}</span>
                      : <span style={{ color: '#CCC', fontSize: 12 }}>—</span>
                    }
                  </td>
                  <td style={{ fontSize: 12, color: '#888' }}>
                    {new Date(insc.data_inscricao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '5px 10px' }}
                        title="Ver detalhes"
                        onClick={() => { setSelectedInsc(insc); setModalOpen(true); }}
                      >
                        <Eye size={13} />
                      </button>
                      {insc.status === 'pendente' && (
                        <button className="btn btn-sm" style={{ padding: '5px 10px', background: '#FFF3E0', color: '#CC5500', border: '1px solid #FFCC88' }} title="Ver QR Code">
                          <QrCode size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#AAA', fontSize: 14 }}>
              Nenhuma inscrição encontrada com os filtros selecionados.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F4F8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#888' }}>
          <span>Exibindo <strong style={{ color: '#333' }}>{filtered.length}</strong> de {inscricoes.length} inscrições</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm">← Anterior</button>
            <button className="btn btn-ghost btn-sm">Próximo →</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedInsc && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: '#1A2332' }}>Detalhes da Inscrição</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
                  {selectedInsc.id}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Atleta', value: selectedInsc.atleta },
                  { label: 'Parceiro', value: selectedInsc.parceiro || '—' },
                  { label: 'Categoria', value: selectedInsc.categoria },
                  { label: 'Status', value: <StatusBadge status={selectedInsc.status} /> },
                  { label: 'Valor Pago', value: selectedInsc.valor_pago > 0 ? `R$ ${selectedInsc.valor_pago.toFixed(2)}` : '—' },
                  { label: 'Data Pagamento', value: selectedInsc.data_pagamento ? new Date(selectedInsc.data_pagamento).toLocaleString('pt-BR') : '—' },
                  { label: 'PIX ID', value: selectedInsc.pix_id || '—' },
                  { label: 'Data Inscrição', value: new Date(selectedInsc.data_inscricao).toLocaleString('pt-BR') },
                ].map((row, i) => (
                  <div key={i} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>{row.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{row.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Fechar</button>
              <button className="btn btn-primary">Editar Inscrição</button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </Layout>
  );
}
