'use client';

import { RecommendationContext, recommendationEngine } from '@/lib/aiRecommendationEngine';
import { Tool } from '@/types/tool';
import { ToolRecommendation, UserProfile } from '@/types/user';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiMessageCircle, FiMic, FiMicOff, FiSend, FiStar, FiX } from 'react-icons/fi';

interface PremiumAIAssistantProps {
    userProfile?: UserProfile;
    onToolSelect?: (tool: Tool) => void;
}

interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    metadata?: {
        tools?: Tool[];
        recommendations?: ToolRecommendation[];
        confidence?: number;
        reasoning?: string[];
    };
}

interface AssistantState {
    isOpen: boolean;
    isListening: boolean;
    isLoading: boolean;
    messages: Message[];
    currentRecommendations: ToolRecommendation[];
    userProfile: UserProfile | null;
    sessionData: {
        timeOnSite: number;
        pagesVisited: string[];
        currentGoal?: string;
    };
}

export const PremiumAIAssistant: React.FC<PremiumAIAssistantProps> = ({
    userProfile,
    onToolSelect
}) => {
    const [state, setState] = useState<AssistantState>({
        isOpen: false,
        isListening: false,
        isLoading: false,
        messages: [],
        currentRecommendations: [],
        userProfile: null,
        sessionData: {
            timeOnSite: 0,
            pagesVisited: [],
            currentGoal: undefined
        }
    });

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize user profile and session tracking
    useEffect(() => {
        if (userProfile) {
            setState(prev => ({ ...prev, userProfile }));
        }

        // Track session data
        const startTime = Date.now();
        const interval = setInterval(() => {
            setState(prev => ({
                ...prev,
                sessionData: {
                    ...prev.sessionData,
                    timeOnSite: (Date.now() - startTime) / 1000
                }
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [userProfile]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [state.messages]);

    // Focus input when assistant opens
    useEffect(() => {
        if (state.isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [state.isOpen]);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
        const newMessage: Message = {
            ...message,
            id: generateId(),
            timestamp: new Date()
        };

        setState(prev => ({
            ...prev,
            messages: [...prev.messages, newMessage]
        }));
    }, []);

    const processUserMessage = useCallback(async (message: string) => {
        const messageLower = message.toLowerCase().trim();

        // Add user message
        addMessage({
            type: 'user',
            content: message
        });

        setState(prev => ({ ...prev, isLoading: true }));

        try {
            // Handle greetings and casual conversation
            const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
            if (greetings.some(greeting => messageLower.includes(greeting))) {
                const greetingResponse = generatePersonalizedGreeting(state.userProfile);
                addMessage({
                    type: 'assistant',
                    content: greetingResponse,
                    metadata: { confidence: 0.95 }
                });
                return;
            }

            // Handle help requests
            if (messageLower.includes('help') || messageLower.includes('what can you do')) {
                const helpResponse = generateHelpResponse(state.userProfile);
                addMessage({
                    type: 'assistant',
                    content: helpResponse,
                    metadata: { confidence: 0.9 }
                });
                return;
            }

            // Generate personalized recommendations
            if (state.userProfile) {
                const context: RecommendationContext = {
                    userProfile: state.userProfile,
                    currentSearch: message,
                    recentInteractions: [], // TODO: Get from user profile
                    searchHistory: [], // TODO: Get from user profile
                    sessionData: state.sessionData
                };

                const recommendations = await recommendationEngine.generateRecommendations(context, 3);

                if (recommendations.length > 0) {
                    const { tools } = await import('@/data/tools');
                    const recommendedTools = recommendations.map(rec =>
                        tools.find(t => t.id === rec.toolId)
                    ).filter(Boolean) as Tool[];

                    const response = generateRecommendationResponse(recommendations, recommendedTools, message);

                    addMessage({
                        type: 'assistant',
                        content: response,
                        metadata: {
                            tools: recommendedTools,
                            recommendations,
                            confidence: recommendations[0]?.confidence || 0.7,
                            reasoning: recommendations[0]?.reasoning?.split('; ') || []
                        }
                    });

                    setState(prev => ({ ...prev, currentRecommendations: recommendations }));
                } else {
                    addMessage({
                        type: 'assistant',
                        content: generateNoResultsResponse(message, state.userProfile),
                        metadata: { confidence: 0.6 }
                    });
                }
            } else {
                // Fallback for users without profile
                const fallbackResponse = generateFallbackResponse(message);
                addMessage({
                    type: 'assistant',
                    content: fallbackResponse,
                    metadata: { confidence: 0.5 }
                });
            }
        } catch (error) {
            console.error('Error processing message:', error);
            addMessage({
                type: 'assistant',
                content: 'I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.',
                metadata: { confidence: 0.3 }
            });
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [state.userProfile, state.sessionData, addMessage]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !state.isLoading) {
            processUserMessage(inputValue);
            setInputValue('');
        }
    }, [inputValue, state.isLoading, processUserMessage]);

    const toggleAssistant = () => {
        setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
    };

    const toggleVoiceInput = () => {
        setState(prev => ({ ...prev, isListening: !prev.isListening }));
        // TODO: Implement voice input functionality
    };

    const handleToolSelect = (tool: Tool) => {
        onToolSelect?.(tool);
        addMessage({
            type: 'assistant',
            content: `Great choice! I've selected ${tool.name} for you. You can now explore its features and see how it fits your needs.`,
            metadata: { tools: [tool], confidence: 0.8 }
        });
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                onClick={toggleAssistant}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <FiMessageCircle size={24} />
            </motion.button>

            {/* Assistant Panel */}
            <AnimatePresence>
                {state.isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                                    <FiStar className="text-white" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Premium AI Assistant</h3>
                                    <p className="text-sm text-gray-500">
                                        {state.userProfile ? 'Personalized' : 'General'} Mode
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleAssistant}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {state.messages.length === 0 && (
                                <div className="text-center text-gray-500 py-8">
                                    <FiMessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>Ask me anything about AI tools!</p>
                                </div>
                            )}

                            {state.messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${message.type === 'user'
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                            }`}
                                    >
                                        <p className="text-sm">{message.content}</p>

                                        {/* Tool Recommendations */}
                                        {message.metadata?.tools && message.metadata.tools.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {message.metadata.tools.map((tool) => (
                                                    <motion.div
                                                        key={tool.id}
                                                        whileHover={{ scale: 1.02 }}
                                                        className="bg-white bg-opacity-10 rounded-lg p-2 cursor-pointer"
                                                        onClick={() => handleToolSelect(tool)}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <img
                                                                src={tool.favicon || '/placeholder-logo.svg'}
                                                                alt={tool.name}
                                                                className="w-4 h-4 rounded"
                                                            />
                                                            <span className="text-xs font-medium">{tool.name}</span>
                                                        </div>
                                                        <p className="text-xs opacity-80 mt-1">{tool.description}</p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Confidence Indicator */}
                                        {message.metadata?.confidence && (
                                            <div className="mt-2 flex items-center space-x-1">
                                                <div className="flex space-x-1">
                                                    {[1, 2, 3].map((i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-1 h-1 rounded-full ${i <= message.metadata!.confidence! * 3
                                                                ? 'bg-current'
                                                                : 'bg-current opacity-30'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs opacity-60">
                                                    {Math.round(message.metadata!.confidence! * 100)}% confidence
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading Indicator */}
                            {state.isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-gray-100 p-3 rounded-2xl">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100">
                            <form onSubmit={handleSubmit} className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={toggleVoiceInput}
                                    className={`p-2 rounded-lg transition-colors ${state.isListening
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {state.isListening ? <FiMicOff size={16} /> : <FiMic size={16} />}
                                </button>

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about AI tools..."
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    disabled={state.isLoading}
                                />

                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || state.isLoading}
                                    className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    <FiSend size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// Helper functions
function generatePersonalizedGreeting(userProfile: UserProfile | null): string {
    if (!userProfile) {
        return `Hello! 👋 I'm your Premium AI Assistant. I can help you discover the perfect AI tools for your needs. What are you looking for today?`;
    }

    const { industry, role, experience } = userProfile;
    return `Hello! 👋 

I see you're a ${experience} ${role} in the ${industry} industry. Based on your profile, I can help you find AI tools that are:

• Perfect for your experience level
• Within your budget of ${userProfile.budget.currency}${userProfile.budget.monthly}/month
• Aligned with your goals: ${userProfile.primaryGoals.slice(0, 2).join(', ')}

What specific AI tools are you looking for today?`;
}

function generateHelpResponse(userProfile: UserProfile | null): string {
    const baseHelp = `I'm your Premium AI Assistant! Here's what I can do:

🔍 **Smart Recommendations**: Get personalized tool suggestions based on your profile
📊 **ROI Analysis**: See potential returns on investment for each tool
🎯 **Goal Alignment**: Find tools that match your specific objectives
💰 **Budget Optimization**: Get the best value for your budget
⚡ **Quick Comparisons**: Compare tools side-by-side instantly

Try asking me:
• "Find me video editing tools for beginners"
• "What's the best AI tool for my marketing budget?"
• "Show me tools that integrate with my current stack"`;

    if (userProfile) {
        return `${baseHelp}

Since you have a premium profile, I can also:
• Remember your preferences and past searches
• Provide industry-specific recommendations
• Calculate personalized ROI estimates
• Suggest complete tool stacks for your projects`;
    }

    return baseHelp;
}

function generateRecommendationResponse(
    recommendations: ToolRecommendation[],
    tools: Tool[],
    query: string
): string {
    const topRecommendation = recommendations[0];
    const tool = tools[0];

    let response = `I found ${recommendations.length} excellent AI tools for "${query}":\n\n`;

    response += `🎯 **Top Recommendation: ${tool.name}**\n`;
    response += `• ${tool.description}\n`;
    response += `• Confidence: ${Math.round(topRecommendation.confidence * 100)}%\n`;
    response += `• Estimated ROI: ${topRecommendation.estimatedROI}%\n`;
    response += `• Time to Value: ${topRecommendation.timeToValue} days\n`;
    response += `• Learning Curve: ${topRecommendation.learningCurve}\n\n`;

    if (topRecommendation.reasoning) {
        response += `**Why this tool?**\n${topRecommendation.reasoning}\n\n`;
    }

    if (tools.length > 1) {
        response += `**Other great options:**\n`;
        tools.slice(1).forEach((tool, index) => {
            const rec = recommendations[index + 1];
            response += `• ${tool.name} (${Math.round(rec.confidence * 100)}% match)\n`;
        });
    }

    return response;
}

function generateNoResultsResponse(query: string, userProfile: UserProfile | null): string {
    return `I couldn't find specific AI tools for "${query}". 

Here are some suggestions:
• Try being more specific (e.g., "video editing tools for beginners")
• Ask about popular categories like marketing, design, or development
• Tell me about your goals and I'll suggest relevant tools

${userProfile ? `Based on your profile, you might be interested in tools for: ${userProfile.primaryGoals.slice(0, 3).join(', ')}` : ''}`;
}

function generateFallbackResponse(query: string): string {
    return `I'd love to help you find AI tools for "${query}"! 

To get personalized recommendations, consider creating a profile so I can:
• Match tools to your experience level and budget
• Suggest tools relevant to your industry
• Provide ROI estimates based on your team size
• Remember your preferences for future searches

For now, try asking about specific categories like "marketing tools" or "design software"!`;
}

export default PremiumAIAssistant;
