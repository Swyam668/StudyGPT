import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { useParams } from "react-router-dom";
import aiService from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';
import MarkdownRenderer from '../common/MarkdownRenderer';


const ChatInterface = () => {
    const { id: documentId } = useParams();
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    // persists across renders
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        // current holds actual DOM element of the end message, now that is selected and we scroll into view
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                setInitialLoading(true);
                const response = await aiService.getChatHistory(documentId);
                setHistory(response.data);
            } catch (error) {
                console.error('Failed to fetch chat history:', error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchChatHistory();
    }, [documentId]);

    // when user types something or AI response (chat history changes (adds up)), then we scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if(!message.trim()) return;

        const userMessage = { role: 'user', content: message, timestamp: new Date() };
        setHistory(prev => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        try {
            const response = await aiService.chat(documentId, userMessage.content);
            const assistantMessage = {
                role: 'assistant',
                content: response.data.answer,
                timestamp: new Date(),
                relevantChunks: response.data.relevantChunks
            };
            setHistory(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = (msg, index) => {
        return "renderMessage";
    };

    if(initialLoading) {
        return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        
        {/* Glowing Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full 
                        bg-gradient-to-br from-cyan-400/20 to-cyan-600/5
                        shadow-[0_0_30px_rgba(34,211,238,0.35)]
                        animate-pulse">
            <MessageSquare
                className="h-9 w-9 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]"
                strokeWidth={2}
            />
        </div>

        {/* Spinner (untouched) */}
        <Spinner />

        {/* Loading Text */}
        <p className="text-xs font-medium tracking-[0.25em] uppercase
                      text-cyan-200/80
                      drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">
            Loading chat history...
        </p>
    </div>
);

    }

    return (
        <div className="h-full flex flex-col">
            {/* Message Area */}
            <div className="relative flex h-full flex-col px-6 py-6">
    {history.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            
            {/* Glowing Icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full
                            bg-gradient-to-br from-cyan-400/20 to-cyan-600/5
                            shadow-[0_0_35px_rgba(34,211,238,0.35)]
                            animate-pulse">
                <MessageSquare
                    className="h-9 w-9 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]"
                    strokeWidth={2}
                />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold tracking-wide text-cyan-100">
                Start a conversation
            </h3>

            {/* Subtitle */}
            <p className="max-w-sm text-sm text-cyan-200/70">
                Ask me anything about the document!
            </p>
        </div>
    ) : (
        history.map(renderMessage)
    )}

    {/* Typing Indicator (stays at bottom naturally) */}
    <div ref={messageEndRef}>
        {loading && (
            <div className="flex items-start gap-4 pt-4">
                
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                                bg-gradient-to-br from-cyan-400/20 to-cyan-600/5
                                shadow-[0_0_18px_rgba(34,211,238,0.3)]">
                    <Sparkles
                        className="h-4 w-4 text-cyan-300"
                        strokeWidth={2}
                    />
                </div>

                <div className="rounded-2xl border border-cyan-400/20
                                bg-cyan-950/40 px-4 py-3
                                backdrop-blur-md
                                shadow-[0_0_25px_rgba(34,211,238,0.15)]">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-cyan-300/80 animate-bounce [animation-delay:0ms]" />
                        <span className="h-2 w-2 rounded-full bg-cyan-300/80 animate-bounce [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-cyan-300/80 animate-bounce [animation-delay:300ms]" />
                    </div>
                </div>
            </div>
        )}
    </div>
</div>


            
        </div>
    )
}

export default ChatInterface