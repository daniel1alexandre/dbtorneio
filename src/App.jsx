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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
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
