import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { adminMenu } from '../../data/adminDashboard.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-4 rounded-md px-4 py-3 text-sm transition ${
      isActive
        ? 'bg-[#0c4a32] text-white'
        : 'text-gray-200 hover:bg-white/10'
    }`;

  const SidebarNav = ({ onNavigate }) => (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {adminMenu.map(([name, icon, path]) => (
        <NavLink
          key={name}
          to={path}
          end={path === '/admin'}
          onClick={onNavigate}
          className={navLinkClass}
        >
          <span className="w-6 text-center text-xl">{icon}</span>
          <span className="flex-1">{name}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8f7] text-gray-900">
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-64 flex-col bg-[#032d1d] text-white lg:flex">
        <Link
          to="/admin"
          className="flex h-19 items-center gap-3 border-b border-white/10 px-5"
        >
          <span className="text-4xl text-[#d8b75a]">◇</span>
          <span>
            <span className="block font-serif text-2xl font-bold">Halla Bol</span>
            <span className="block text-[8px] tracking-wider text-gray-300">
              ROOTED IN INDIA. FOR A BETTER WORLD.
            </span>
          </span>
        </Link>

        <SidebarNav />

        <div className="p-4">
          <div className="relative overflow-hidden rounded-lg border border-white/20 p-5">
            <p className="relative z-10 font-serif text-xl italic leading-6">
              Grow
              <br />
              A Better
              <br />
              Tomorrow
            </p>
            <Link
              // to="/"
              className="relative z-10 mt-5 inline-flex rounded-md border border-[#b8d8a9] px-4 py-2 text-xs transition hover:bg-white hover:text-[#073b25]"
            >
              View Website ↗
            </Link>
            <span className="absolute -bottom-5 -right-2 text-7xl opacity-40">
              🌿
            </span>
          </div>
        </div>
      </aside>

      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenu(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-[#032d1d] text-white shadow-2xl">
            <div className="flex h-19 items-center justify-between border-b border-white/10 px-5">
              <span className="font-serif text-2xl font-bold">Halla Bol</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileMenu(false)}
                className="text-2xl"
              >
                ×
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileMenu(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm lg:hidden"
              onClick={() => setMobileMenu(true)}
            >
              Menu
            </button>
            <p className="hidden text-sm text-gray-500 sm:block">
              Admin · {user?.name || 'Staff'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wide text-[#075631]">
              {user?.role}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-[#073b25] px-3 py-1.5 text-sm text-white hover:bg-[#052a1a]"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
