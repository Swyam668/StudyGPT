import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import documentService from '../../services/documentService';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/ChatInterface";


const DocumentDetailPage = () => {

    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Content');


    useEffect(() => {
        const fetchDocumentDetails = async () => {
            try {
                const data = await documentService.getDocumentById(id);
                setDocument(data);
            } catch (error) {
                toast.error('Failed to fetch document details.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocumentDetails();
    }, [id]);
    // making the effect re-run when id (i.e., document) changes

    // Helper function to get full PDF URL
    const getPdfUrl = () => {
        if(!document?.data?.filePath) return null;

        const filePath = document.data.filePath;

        if(filePath.startsWith('http://') || filePath.startsWith('https://')) {
            return filePath;
        }
        
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    };

    const renderContent = () => {
    if (loading) {
        return <Spinner />;
    }

    if (!document || !document.data || !document.data.filePath) {
        return (
        <div
            className="
            rounded-xl border border-slate-800 bg-slate-900/60
            p-6 text-center text-sm text-slate-400
            "
        >
            PDF not available.
        </div>
        );
    }

    const pdfUrl = getPdfUrl();

    return (
        <div
        className="
            flex h-full flex-col overflow-hidden
            rounded-2xl border border-slate-800 bg-slate-900/60
        "
        >
        {/* Viewer Header */}
        <div
            className="
            flex items-center justify-between border-b border-slate-800
            bg-slate-900/80 px-4 py-3
            "
        >
            <span className="text-sm font-medium text-slate-200">
            Document Viewer
            </span>

            <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
                inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5
                text-xs font-medium text-cyan-400 transition
                hover:bg-cyan-500/10
            "
            >
            <ExternalLink size={16} />
            Open in new tab
            </a>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 bg-slate-950">
            <iframe
            src={pdfUrl}
            className="h-full w-full"
            title="PDF Viewer"
            frameBorder="0"
            style={{
                colorScheme: 'light',
            }}
            />
        </div>
        </div>
    );
    };


    const renderChat = () => {
        return <ChatInterface />
    };

    const renderAIActions = () => {
        return "renderAIActions";
    };

    const renderFlashcardsTab = () => {
        return "renderFlashcardsTab";
    };

    const renderQuizzesTab = () => {
        return "renderQuizzesTab";
    };
    
    const tabs = [
        {name: 'Content', label: 'Content', content: renderContent() },
        {name: 'Chat', label: 'Chat', content: renderChat() },
        {name: 'AIActions', label: 'AIActions', content: renderAIActions() },
        {name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab() },
        {name: 'Quizzes', label: 'Quizzes', content: renderQuizzesTab() },
    ];

    if(loading) {
        return <Spinner />;
    }

    if(!document) {
        return <div className="">Document not found.</div>;
    }



    return (
        <div className="flex min-h-screen flex-col space-y-4">
  <div>
    <Link
      to="/documents"
      className="
        inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5
        text-sm font-medium text-slate-400 transition
        hover:bg-slate-800 hover:text-cyan-400
      "
    >
      <ArrowLeft size={16} />
      Back to document library
    </Link>
  </div>

  <PageHeader title={document.data.title} />

  <div
  className="
    flex flex-1 min-h-0
    rounded-xl border border-slate-800 bg-slate-900/60
    px-4 py-2
  "
>

    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  </div>
</div>

    )
}

export default DocumentDetailPage