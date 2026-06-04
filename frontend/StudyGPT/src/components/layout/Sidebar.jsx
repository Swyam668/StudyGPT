import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, User, LogOut, BrainCircuit, BookOpen, X } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {

  const { logout } = useAuth()
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login')
  };

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { to: '/documents', icon: FileText, text: 'Documents' },
    { to: '/flashcards', icon: BookOpen, text: 'Flashcards' },
    { to: '/profile', icon: User, text: 'Profile' }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`
          fixed inset-0 z-30 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          md:hidden
        `}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64
          flex flex-col justify-between
          bg-slate-900/90 border-r border-slate-800 backdrop-blur-md
          p-6
          transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex-shrink-0
        `}
      >

        {/* Logo + Close (mobile) */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-cyan-400">
              <BrainCircuit size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-semibold text-slate-100">StudyGPT</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-slate-400 hover:text-cyan-400 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <NavLink
            // useful for react in optimization (link.to is used as key) -- to identify which items in this list have changes, or added, or removed -- only for internal use, no external significance
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition
                ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800 hover:text-cyan-400'}`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={18}
                    strokeWidth={2.5}
                    className={isActive ? 'text-cyan-400' : 'text-slate-400'}
                  />
                  {link.text}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="
              flex w-full items-center gap-2 rounded-lg
              border border-slate-700 bg-slate-800
              px-3 py-2 text-sm text-slate-300
              hover:bg-red-500/20 hover:text-red-400
              transition
            "
          >
            <LogOut size={18} strokeWidth={2.5} className="text-red-400" />
            LogOut
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
