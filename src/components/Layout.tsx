import { AnimatePresence, motion } from 'framer-motion';
import { Bell, LogOut, Menu, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import logoImage from '../../assets/packa-logo.png';
import { navItems, notifications } from '../data/appData';
import { useSession } from '../session';
import { ActionProvider } from './ActionMenu';
import { NotificationPanel } from './NotificationPanel';

const pageNames: Record<string, string> = {
  profil: 'Profil psa',
  zdravi: 'Zdraví',
  ockovani: 'Očkování',
  leky: 'Léky',
  alergie: 'Alergie',
  aktivity: 'Aktivity',
  vycvik: 'Výcvik',
  povely: 'Povely',
  navody: 'Návody',
  'vyber-plemene': 'Výběr plemene',
  cestovani: 'Cestování',
  kamaradi: 'Kamarádi',
  harani: 'Hárání',
  nastaveni: 'Nastavení'
};

export function Layout() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useSession();

  const breadcrumbs = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    return ['Přehled', ...parts.map(part => pageNames[part] ?? part)];
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand">
          <img className="brand-logo" src={logoImage} alt="Packa" />
          <div>
            <strong>Packa</strong>
            <small>kompletní péče o psa</small>
          </div>
        </div>
        <nav className="side-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={item.path === '/'}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setMobileOpen(true)} aria-label="Otevřít menu">
            <Menu size={20} />
          </button>
          <div>
            <div className="breadcrumbs">{breadcrumbs.join(' / ')}</div>
            <h1>{breadcrumbs[breadcrumbs.length - 1]}</h1>
          </div>
          <label className="searchbar">
            <Search size={18} />
            <input placeholder="Hledat léky, povely, trasy..." />
          </label>
          <button className="bell-button" onClick={() => setPanelOpen(value => !value)} aria-label="Upozornění">
            <Bell size={20} />
            <span>{notifications.length}</span>
          </button>
          <button className="account-button" onClick={logout} title="Odhlásit uživatele">
            <span>{user?.name?.charAt(0).toUpperCase() || user?.email.charAt(0).toUpperCase()}</span>
            <strong>{user?.name || user?.email}</strong>
            <LogOut size={16} />
          </button>
        </header>

        {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Zavřít menu"><X /></button>}

        <ActionProvider>
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              className="page"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </ActionProvider>
      </div>

      <NotificationPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  );
}
