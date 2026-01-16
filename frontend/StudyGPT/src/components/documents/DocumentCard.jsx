import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from 'lucide-react';
import moment from 'moment';

// helper function to format file size
const formatFileSize = (bytes) => {
    if(bytes === undefined || bytes === null) return 'N/A';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while(size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({
    document, onDelete
}) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    };

    const handleDelete = (e) => {
        // stops upward propagation, if child button in parent button, on clicking child button, both child and parent buttons will get triggered 
        e.stopPropagation();
        onDelete(document);
    };

   return (
  <div
    className="
      relative cursor-pointer rounded-2xl border border-slate-800 
      bg-slate-900/60 p-5 transition-all duration-300
      hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10
    "
    onClick={handleNavigate}
  >
    {/* Header Section */}
    <div>
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
          <FileText className="h-5 w-5 text-cyan-400" strokeWidth={2} />
        </div>

        <button
          onClick={handleDelete}
          className="
            rounded-lg p-2 text-slate-400 transition
            hover:bg-red-500/10 hover:text-red-400
          "
        >
          <Trash2 className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      {/* Title */}
      <h3
        className="
          mt-4 line-clamp-2 text-base font-semibold text-slate-100
        "
        title={document.title}
      >
        {document.title}
      </h3>

      {/* Document Info */}
      <div className="mt-1 text-xs text-slate-400">
        {document.fileSize !== undefined && (
          <span>{formatFileSize(document.fileSize)}</span>
        )}
      </div>

      {/* Stats Section */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-300">
        {document.flashcardCount !== undefined && (
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-cyan-400" strokeWidth={2} />
            <span>{document.flashcardCount} Flashcards</span>
          </div>
        )}

        {document.quizCount !== undefined && (
          <div className="flex items-center gap-1.5">
            <BrainCircuit className="h-4 w-4 text-purple-400" strokeWidth={2} />
            <span>{document.quizCount} Quizzes</span>
          </div>
        )}
      </div>
    </div>

    {/* Footer Section */}
    <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4" strokeWidth={2} />
        <span>Uploaded {moment(document.createdAt).fromNow()}</span>
      </div>
    </div>

    {/* Hover Indicator */}
    <div
      className="
        pointer-events-none absolute inset-0 rounded-2xl
        ring-1 ring-transparent transition
        hover:ring-cyan-500/20
      "
    />
  </div>
);

}

export default DocumentCard