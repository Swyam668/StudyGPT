import React, { useState, useEffect } from "react";
import Spinner from '../../components/common/Spinner';
import progressService from '../../services/progressService';
import toast from 'react-hot-toast';
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock } from 'lucide-react';

const DashboardPage = () => {

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await progressService.getDashboardData();
                setDashboardData(data.data);
            } catch (error) {
                toast.error('Failed to fetch dashboard data.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <Spinner />;

    if (!dashboardData || !dashboardData.overview) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center text-slate-400">
                    <TrendingUp className="w-10 h-10 mb-3 text-cyan-400" />
                    <p>No dashboard data available.</p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Documents',
            value: dashboardData.overview.totalDocuments,
            icon: FileText,
            gradient: 'from-cyan-500/20 to-blue-500/20',
            shadowColor: 'shadow-cyan-500/20'
        },
        {
            label: 'Total Flashcards',
            value: dashboardData.overview.totalFlashcards,
            icon: BookOpen,
            gradient: 'from-teal-500/20 to-emerald-500/20',
            shadowColor: 'shadow-teal-500/20'
        },
        {
            label: 'Total Quizzes',
            value: dashboardData.overview.totalQuizzes,
            icon: BrainCircuit,
            gradient: 'from-indigo-500/20 to-purple-500/20',
            shadowColor: 'shadow-indigo-500/20'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_60%)] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 py-10 space-y-10">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Dashboard
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Track your learning progress and activity
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl p-6 bg-slate-900/60 backdrop-blur 
                            border border-slate-800 
                            transition-all duration-300 ease-out
                            hover:-translate-y-1 hover:scale-[1.02]
                            hover:border-cyan-400/50 hover:shadow-xl ${stat.shadowColor}`}

                        >
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">
                                    {stat.label}
                                </span>
                                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                                    <stat.icon className="w-5 h-5 text-cyan-300" strokeWidth={2} />
                                </div>
                            </div>
                            <div className="mt-4 text-3xl font-semibold text-white">
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-cyan-500/10">
                            <Clock className="w-5 h-5 text-cyan-400" strokeWidth={2} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            Recent Activity
                        </h3>
                    </div>

                    {dashboardData.recentActivity &&
                    (dashboardData.recentActivity.documents.length > 0 ||
                        dashboardData.recentActivity.quizzes.length > 0) ? (
                        <div className="space-y-4">
                            {[
                                ...(dashboardData.recentActivity.documents || []).map(doc => ({
                                    id: doc._id,
                                    description: doc.title,
                                    timestamp: doc.lastAccessed,
                                    link: `/documents/${doc._id}`,
                                    type: 'document'
                                })),
                                ...(dashboardData.recentActivity.quizzes || []).map(quiz => ({
                                    id: quiz._id,
                                    description: quiz.title,
                                    timestamp: quiz.lastAttempted,
                                    link: `/quizzes/${quiz._id}`,
                                    type: 'quiz'
                                }))
                            ]
                                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                .map((activity, index) => (
                                    <div
                                        key={activity.id || index}
                                        className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition"
                                    >
                                        <div>
                                            <p className="text-slate-300 text-sm">
                                                {activity.type === 'document'
                                                    ? 'Accessed Document: '
                                                    : 'Attempted Quiz: '}
                                                <span className="text-white font-medium">
                                                    {activity.description}
                                                </span>
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        {activity.link && (
                                            <a
                                                href={activity.link}
                                                className="text-cyan-400 text-sm hover:underline"
                                            >
                                                View
                                            </a>
                                        )}
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center py-10 text-slate-400">
                            <Clock className="w-8 h-8 mb-3 text-cyan-400" />
                            <p>No Recent Activity yet.</p>
                            <p className="text-sm mt-1">
                                Start learning to see your everyday progress here
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;
