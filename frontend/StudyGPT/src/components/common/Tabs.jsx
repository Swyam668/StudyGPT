import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-1 min-h-0 flex-col space-y-4">
      {/* Tabs Header */}
      <div
        className="
          overflow-x-auto rounded-xl border border-slate-800
          bg-slate-900/60
        "
      >
        <nav className="flex gap-1 p-1">
          {tabs.map((tab) => {
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`
                  relative flex items-center justify-center
                  rounded-lg px-4 py-2 text-sm font-medium transition
                  ${
                    activeTab === tab.name
                      ? "text-cyan-400"
                      : "text-slate-400 hover:text-slate-200"
                  }
                `}
              >
                <span className="relative z-10">{tab.label}</span>

                {activeTab === tab.name && (
                  <div className="absolute inset-0 rounded-lg bg-cyan-500/10" />
                )}

                {activeTab === tab.name && (
                  <div className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-cyan-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {tabs.map((tab) => {
          if (tab.name === activeTab) {
            return (
              <div
                key={tab.name}
                className="h-full w-full"
              >
                {tab.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};


export default Tabs;
