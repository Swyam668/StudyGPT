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
                console.log("Data__getDashboardData", data);

                setDashboardData(data.data);
            } catch (error) {
                toast.error('Failed to fetch dashboard data.');
                console.error(error);
            } finally {
                setLoading(false)
            }
        };

        fetchDashboardData();
    }, []);

    if(loading) {
        return <Spinner />;
    }

    if(!dashboardData || !dashboardData.overview){
        return (
            <div className="">
                <div className="">
                    <div className="">
                        <TrendingUp className="" />
                    </div>
                    <p className="">No dashboard data available.</p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Documents',
            value: dashboardData.overview.totalDocuments,
            icon: FileText,
            gradient: '',
            shadowColor: ''
        },
        {
            label: 'Total Flashcards',
            value: dashboardData.overview.totalFlashcards,
            icon: BookOpen,
            gradient: '',
            shadowColor: ''
        },
        {
            label: 'Total Quizzes',
            value: dashboardData.overview.totalQuizzes,
            icon: BrainCircuit,
            gradient: '',
            shadowColor: ''
        }
    ];


    return (
        <div>DashboardPage</div>
    )
}

export default DashboardPage