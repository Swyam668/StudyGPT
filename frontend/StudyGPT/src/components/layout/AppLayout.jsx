import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = ({ children }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">

      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <main
          className="
            flex-1
            overflow-y-auto
            px-4 py-6
            md:px-6
            text-slate-100
          "
        >
          {children}
        </main>

      </div>
    </div>
  )
}

export default AppLayout
