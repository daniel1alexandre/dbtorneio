import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CronogramaPage from './pages/CronogramaPage';
import ArbitroPage from './pages/ArbitroPage';
import InscricoesPage from './pages/InscricoesPage';
import FinanceiroPage from './pages/FinanceiroPage';
import TelaoPage from './pages/TelaoPage';
import ChaveamentoPage from './pages/ChaveamentoPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import RegisterPage from './pages/RegisterPage';
import AtletaDashboardPage from './pages/AtletaDashboardPage';
import AdminTorneiosPage from './pages/AdminTorneiosPage';
import HomePage from './pages/HomePage';
import TorneioDetalhesPage from './pages/TorneioDetalhesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/torneio/:id" element={<TorneioDetalhesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/meus-torneios" element={<AtletaDashboardPage />} />
        <Route path="/admin-torneios" element={<AdminTorneiosPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inscricoes" element={<InscricoesPage />} />
        <Route path="/cronograma" element={<CronogramaPage />} />
        <Route path="/chaveamento" element={<ChaveamentoPage />} />
        <Route path="/arbitro" element={<ArbitroPage />} />
        <Route path="/financeiro" element={<FinanceiroPage />} />
        <Route path="/telao" element={<TelaoPage />} />
        <Route path="/configuracoes" element={<ConfiguracoesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
