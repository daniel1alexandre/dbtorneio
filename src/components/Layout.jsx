import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, title, subtitle }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-layout">
        <Header title={title} subtitle={subtitle} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
