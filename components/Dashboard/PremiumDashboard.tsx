'use client';

import { expertVerificationSystem } from '@/lib/expertVerification';
import { roiCalculator } from '@/lib/roiCalculator';
import { toolStackBuilder } from '@/lib/toolStackBuilder';
import { voiceSearchManager } from '@/lib/voiceSearch';
import { Tool } from '@/types/tool';
import { UserProfile } from '@/types/user';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
    FiAward,
    FiBarChart,
    FiClock,
    FiDollarSign,
    FiMessageCircle,
    FiMic,
    FiSearch,
    FiShield,
    FiStar,
    FiTarget,
    FiTrendingUp,
    FiUsers,
    FiZap
} from 'react-icons/fi';

interface PremiumDashboardProps {
    userProfile?: UserProfile;
    onToolSelect?: (tool: Tool) => void;
}

interface DashboardStats {
    totalTools: number;
    recommendedTools: number;
    estimatedROI: number;
    timeSaved: number;
    expertConsultations: number;
    toolStacks: number;
}

export const PremiumDashboard: React.FC<PremiumDashboardProps> = ({
    userProfile,
    onToolSelect
}) => {
    const [stats, setStats] = useState<DashboardStats>({
        totalTools: 0,
        recommendedTools: 0,
        estimatedROI: 0,
        timeSaved: 0,
        expertConsultations: 0,
        toolStacks: 0
    });
    const [recentRecommendations, setRecentRecommendations] = useState<Tool[]>([]);
    const [topROITools, setTopROITools] = useState<any[]>([]);
    const [expertInsights, setExpertInsights] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userProfile) {
            loadDashboardData();
        }
    }, [userProfile]);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const { tools } = await import('@/data/tools');

            // Calculate stats
            setStats({
                totalTools: tools.length,
                recommendedTools: 12,
                estimatedROI: 245,
                timeSaved: 156,
                expertConsultations: 3,
                toolStacks: 5
            });

            // Get recent recommendations
            const recentTools = tools.slice(0, 4);
            setRecentRecommendations(recentTools);

            // Calculate ROI for top tools
            const roiCalculations = recentTools.map(tool =>
                roiCalculator.calculateToolROI(tool, userProfile!)
            );
            setTopROITools(roiCalculations);

            // Get expert insights
            const insights = await expertVerificationSystem.getExpertInsights('AI');
            setExpertInsights(insights);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceSearch = () => {
        if (voiceSearchManager.isVoiceSupported()) {
            voiceSearchManager.startListening(
                (result) => {
                    console.log('Voice search result:', result);
                    // Handle voice search result
                },
                (error) => {
                    console.error('Voice search error:', error);
                }
            );
        }
    };

    const handleToolStackBuilder = async () => {
        if (!userProfile) return;

        try {
            const stacks = await toolStackBuilder.generateToolStack(
                userProfile,
                'marketing automation',
                userProfile.budget.monthly
            );
            console.log('Generated tool stacks:', stacks);
        } catch (error) {
            console.error('Error generating tool stacks:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome back, User! 👋
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Your AI tools journey is looking great
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleVoiceSearch}
                                className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg"
                            >
                                <FiMic size={20} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg"
                            >
                                <FiStar size={16} className="inline mr-2" />
                                Premium
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Tools</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalTools}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <FiSearch className="text-blue-600" size={20} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Estimated ROI</p>
                                <p className="text-2xl font-bold text-green-600">{stats.estimatedROI}%</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <FiTrendingUp className="text-green-600" size={20} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Time Saved</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.timeSaved}h</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <FiClock className="text-purple-600" size={20} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Expert Consults</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.expertConsultations}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <FiUsers className="text-orange-600" size={20} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* AI Recommendations */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    AI-Powered Recommendations
                                </h2>
                                <div className="flex items-center space-x-2">
                                    <FiZap className="text-yellow-500" size={16} />
                                    <span className="text-sm text-gray-600">Powered by AI</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentRecommendations.map((tool, index) => (
                                    <motion.div
                                        key={tool.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => onToolSelect?.(tool)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={tool.favicon || '/placeholder-logo.svg'}
                                                alt={tool.name}
                                                className="w-8 h-8 rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{tool.name}</h3>
                                                <p className="text-sm text-gray-600">{tool.category}</p>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FiStar className="text-yellow-400" size={14} />
                                                <span className="text-sm font-medium">{tool.rating}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* ROI Analysis */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    ROI Analysis
                                </h2>
                                <FiDollarSign className="text-green-500" size={20} />
                            </div>

                            <div className="space-y-4">
                                {topROITools.slice(0, 3).map((roi, index) => (
                                    <motion.div
                                        key={roi.toolId}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <h3 className="font-medium text-gray-900">{roi.toolName}</h3>
                                            <p className="text-sm text-gray-600">
                                                Payback: {roi.roi.paybackPeriod} months
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">
                                                {roi.roi.percentage}% ROI
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                ${roi.investment.total.toLocaleString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Expert Insights */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Expert Insights
                                </h2>
                                <FiAward className="text-purple-500" size={20} />
                            </div>

                            {expertInsights && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Trends</h3>
                                        <ul className="space-y-2">
                                            {expertInsights.trends.slice(0, 2).map((trend: string, index: number) => (
                                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                                    <FiTrendingUp className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" size={12} />
                                                    {trend}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Predictions</h3>
                                        <ul className="space-y-2">
                                            {expertInsights.predictions.slice(0, 2).map((prediction: string, index: number) => (
                                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                                    <FiTarget className="text-green-500 mt-0.5 mr-2 flex-shrink-0" size={12} />
                                                    {prediction}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.0 }}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Quick Actions
                            </h2>

                            <div className="space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleToolStackBuilder}
                                    className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg flex items-center justify-between"
                                >
                                    <span>Build Tool Stack</span>
                                    <FiZap size={16} />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg flex items-center justify-between"
                                >
                                    <span>Expert Consultation</span>
                                    <FiUsers size={16} />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full p-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg shadow-lg flex items-center justify-between"
                                >
                                    <span>ROI Calculator</span>
                                    <FiBarChart size={16} />
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Premium Features */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 }}
                            className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white"
                        >
                            <h2 className="text-xl font-semibold mb-4">
                                Premium Features
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <FiMic className="text-yellow-300" size={16} />
                                    <span className="text-sm">Voice Search</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiShield className="text-green-300" size={16} />
                                    <span className="text-sm">Expert Verification</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiDollarSign className="text-yellow-300" size={16} />
                                    <span className="text-sm">Advanced ROI Analysis</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiZap className="text-green-300" size={16} />
                                    <span className="text-sm">AI Tool Stack Builder</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiMessageCircle className="text-yellow-300" size={16} />
                                    <span className="text-sm">Expert Consultations</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumDashboard;
