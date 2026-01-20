import React from "react";
import{X} from "lucide-react";

const Modal = ({isOpen, onClose, title, children}) => {

    if(!isOpen) return null;

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-[92%] max-w-3xl rounded-2xl 
        border border-cyan-400/25 
        bg-gradient-to-br from-cyan-950/70 via-slate-950 to-black
        shadow-[0_0_80px_rgba(0,255,255,0.22)]
        backdrop-blur-xl
        animate-scaleIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-2
            border border-cyan-400/20
            bg-cyan-400/10 text-cyan-300
            hover:bg-cyan-400/20 hover:text-cyan-100
            hover:shadow-[0_0_18px_rgba(0,255,255,0.35)]
            transition-all"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* Header */}
        <div className="px-6 py-5 border-b border-cyan-400/10">
          <h3 className="text-lg font-semibold tracking-wide text-cyan-200">
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-cyan-100 leading-relaxed">
          {children}
        </div>

      </div>
    </div>
  );

}

export default Modal