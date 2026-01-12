import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { Bell, User, Menu } from 'lucide-react'

const Header = ({ toggleSidebar }) => {

  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        {/* Mobile Menu button */}
        <button
          onClick={toggleSidebar}
          className="
            flex items-center justify-center
            rounded-lg border border-slate-700
            bg-slate-800 p-2
            text-slate-300
            transition
            hover:bg-slate-700
            hover:text-cyan-400
            focus:outline-none focus:ring-2 focus:ring-cyan-400/30
            md:hidden
          "
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right section */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <button
            className="
              relative
              flex h-9 w-9 items-center justify-center
              rounded-lg border border-slate-700
              bg-slate-800
              text-slate-300
              transition
              hover:bg-slate-700
              hover:text-cyan-400
            "
          >
            <Bell size={18} strokeWidth={2} />
            <span className="
              absolute -top-1 -right-1
              h-2 w-2 rounded-full
              bg-cyan-400
            " />
          </button>

          {/* User Profile */}
          <div className="
            flex items-center gap-3
            rounded-xl border border-slate-800
            bg-slate-800/70 px-3 py-1.5
          ">
            <div className="
              flex h-9 w-9 items-center justify-center
              rounded-lg
              border border-slate-700
              bg-slate-900
              text-cyan-400
            ">
              <User size={18} strokeWidth={2.5} />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-medium text-slate-100">
                {user?.username || 'User'}
              </p>
              <p className="text-[11px] text-slate-400">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}

export default Header
