import React from "react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div
      className="
        flex flex-col gap-3
        rounded-2xl border border-slate-800 bg-slate-900/60
        px-6 py-4
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      <div>
        <h1
          className="
            text-xl font-semibold text-slate-100
            sm:text-2xl
          "
        >
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
