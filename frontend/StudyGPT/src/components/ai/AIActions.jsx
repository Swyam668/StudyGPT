import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../common/MarkdownRenderer';
import Modal from "../common/Modal";

const AIActions = () => {

    const { id: documentId } = useParams();
    const [loadingAction, setLoadingAction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [concept, setConcept] = useState("");

    const handleGenerateSummary = async () => {
        setLoadingAction("summary");
        try {
            const { summary } = await aiService.generateSummary(documentId);
            // console.log("SUMMARY FROM BACKEND:", summary, typeof summary);
            setModalTitle("Generated Summary");
            setModalContent(summary);
            setIsModalOpen(true);
        } catch (error) {
            toast.error("Failed to generate summary.")
        } finally {
            setLoadingAction(null);
        }
    };

    const handleExplainConcept = async (e) => {
        e.preventDefault();
        if(!concept.trim()){
            toast.error("Please enter a concept to explain.");
            return;
        }
        setLoadingAction("explain");
        
        try {
            const { explanation } = await aiService.explainConcept(
                documentId,
                concept
            );
            setModalTitle(`Explanation of "${concept}"`);
            setModalContent(explanation);
            setIsModalOpen(true);
            setConcept("")
        } catch (error) {
            toast.error("Failed to explain concept.");
        } finally {
            setLoadingAction(null);
        }
    };


    return (
        <>
  <div className="max-w-3xl mx-auto mt-8 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-950/60 via-slate-950 to-black shadow-[0_0_40px_rgba(0,255,255,0.08)] backdrop-blur-xl">
    
    {/* Header */}
    <div className="p-6 border-b border-cyan-400/10">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/20 shadow-[0_0_15px_rgba(0,255,255,0.25)]">
          <Sparkles className="w-6 h-6 text-cyan-300" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-cyan-200 tracking-wide">
            Ask Your Study Companion
          </h3>
          <p className="text-sm text-cyan-400/70">
            Powered by StudyGPT
          </p>
        </div>
      </div>
    </div>

    <div className="p-6 grid gap-6 md:grid-cols-2">
      
      {/* Generate Summary */}
      <div className="rounded-xl border border-cyan-400/20 bg-cyan-950/30 p-5 flex flex-col justify-between hover:shadow-[0_0_25px_rgba(0,255,255,0.15)] transition-all">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
              <BookOpen className="w-5 h-5 text-cyan-300" strokeWidth={2} />
            </div>
            <h4 className="text-cyan-200 font-medium">
              Get summary of the document!
            </h4>
          </div>
          <p className="text-sm text-cyan-400/70">
            Get a concise summary of the entire document
          </p>
        </div>

        <button
          onClick={handleGenerateSummary}
          disabled={loadingAction === "summary"}
          className="mt-5 w-full rounded-lg bg-cyan-400/10 border border-cyan-400/30 py-2.5 text-cyan-200 font-medium hover:bg-cyan-400/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loadingAction === "summary" ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-cyan-300 border-t-transparent animate-spin" />
              Getting the summary ready for you...
            </span>
          ) : (
            "Summarize"
          )}
        </button>
      </div>

      {/* Explain Concept */}
      <div className="rounded-xl border border-cyan-400/20 bg-cyan-950/30 p-5 hover:shadow-[0_0_25px_rgba(0,255,255,0.15)] transition-all">
        <form onSubmit={handleExplainConcept} className="flex flex-col h-full">
          
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
              <Lightbulb className="w-5 h-5 text-cyan-300" strokeWidth={2} />
            </div>
            <h4 className="text-cyan-200 font-medium">
              Explain a Concept
            </h4>
          </div>

          <p className="text-sm text-cyan-400/70 mb-4">
            Enter a topic or concept from the document to get a detailed explanation.
          </p>

          <div className="flex gap-3 mt-auto">
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. 'Transition Matrix'"
              className="flex-1 rounded-lg bg-black/40 border border-cyan-400/20 px-3 py-2 text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.25)] disabled:opacity-50"
              disabled={loadingAction === "explain"}
            />

            <button
              type="submit"
              disabled={loadingAction === "explain" || !concept.trim()}
              className="rounded-lg bg-cyan-400/10 border border-cyan-400/30 px-5 py-2 text-cyan-200 font-medium hover:bg-cyan-400/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loadingAction === "explain" ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-300 border-t-transparent animate-spin" />
                  Loading...
                </span>
              ) : (
                "Explain"
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>


  {/* Resultant Modal */}
  <Modal
   isOpen = {isModalOpen}
   onClose={() => setIsModalOpen(false)}
   title={modalTitle}
  >
    <div className="max-h-[60vh] overflow-y-auto
    prose prose-invert prose-sm max-w-none
    prose-headings:text-cyan-200
    prose-p:text-cyan-100
    prose-strong:text-cyan-200
    prose-a:text-cyan-300
    prose-code:text-cyan-300
    prose-pre:bg-black/60
    prose-pre:border prose-pre:border-cyan-400/20
    prose-blockquote:border-cyan-400
    prose-li:text-cyan-100">
        <MarkdownRenderer content = {modalContent} />
    </div>
  </Modal>
</>

    )
}

export default AIActions