import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-canvas-base text-canvas-ink">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(29,78,216,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.5),transparent_65%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.12),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.45),transparent_65%)]" />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
