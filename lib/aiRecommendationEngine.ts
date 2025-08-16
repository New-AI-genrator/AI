import { Tool } from '@/types/tool';
import { SearchQuery, ToolInteraction, ToolRecommendation, UserProfile } from '@/types/user';

export interface RecommendationContext {
    userProfile: UserProfile;
    currentSearch?: string;
    recentInteractions: ToolInteraction[];
    searchHistory: SearchQuery[];
    sessionData: {
        timeOnSite: number;
        pagesVisited: string[];
        currentGoal?: string;
    };
}

export interface RecommendationScore {
    tool: Tool;
    score: number;
    factors: {
        budgetMatch: number;
        experienceMatch: number;
        goalAlignment: number;
        industryRelevance: number;
        popularityScore: number;
        roiPotential: number;
        learningCurve: number;
        integrationScore: number;
    };
    reasoning: string[];
    alternatives: Tool[];
    estimatedROI: number;
    timeToValue: number;
    confidence: number;
}

export class AIRecommendationEngine {
    private static instance: AIRecommendationEngine;

    public static getInstance(): AIRecommendationEngine {
        if (!AIRecommendationEngine.instance) {
            AIRecommendationEngine.instance = new AIRecommendationEngine();
        }
        return AIRecommendationEngine.instance;
    }

    /**
     * Generate personalized tool recommendations based on user profile and context
     */
    async generateRecommendations(
        context: RecommendationContext,
        limit: number = 5
    ): Promise<ToolRecommendation[]> {
        const { tools } = await import('@/data/tools');

        // Calculate recommendation scores for all tools
        const scoredTools = tools.map(tool => this.calculateToolScore(tool, context));

        // Sort by score and take top recommendations
        const topRecommendations = scoredTools
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        // Convert to ToolRecommendation format
        return topRecommendations.map(scoredTool => ({
            id: this.generateId(),
            toolId: scoredTool.tool.id,
            confidence: scoredTool.confidence,
            reasoning: scoredTool.reasoning.join('; '),
            alternatives: scoredTool.alternatives.map(t => t.id),
            estimatedROI: scoredTool.estimatedROI,
            timeToValue: scoredTool.timeToValue,
            learningCurve: this.calculateLearningCurve(scoredTool.factors.learningCurve),
            recommendedFor: this.generateRecommendationContext(scoredTool, context),
            timestamp: new Date()
        }));
    }

    /**
     * Calculate comprehensive score for a tool based on user context
     */
    private calculateToolScore(tool: Tool, context: RecommendationContext): RecommendationScore {
        const factors = {
            budgetMatch: this.calculateBudgetMatch(tool, context.userProfile),
            experienceMatch: this.calculateExperienceMatch(tool, context.userProfile),
            goalAlignment: this.calculateGoalAlignment(tool, context),
            industryRelevance: this.calculateIndustryRelevance(tool, context.userProfile),
            popularityScore: this.calculatePopularityScore(tool),
            roiPotential: this.calculateROIPotential(tool, context.userProfile),
            learningCurve: this.calculateLearningCurveScore(tool, context.userProfile),
            integrationScore: this.calculateIntegrationScore(tool, context.userProfile)
        };

        // Weighted scoring system
        const weights = {
            budgetMatch: 0.15,
            experienceMatch: 0.12,
            goalAlignment: 0.20,
            industryRelevance: 0.10,
            popularityScore: 0.08,
            roiPotential: 0.15,
            learningCurve: 0.10,
            integrationScore: 0.10
        };

        const score = Object.entries(factors).reduce((total, [key, value]) => {
            return total + (value * weights[key as keyof typeof weights]);
        }, 0);

        const reasoning = this.generateReasoning(factors, tool, context);
        const alternatives = this.findAlternatives(tool, context);
        const estimatedROI = this.estimateROI(tool, context.userProfile);
        const timeToValue = this.estimateTimeToValue(tool, context.userProfile);

        return {
            tool,
            score,
            factors,
            reasoning,
            alternatives,
            estimatedROI,
            timeToValue,
            confidence: this.calculateConfidence(factors, context)
        };
    }

    private calculateBudgetMatch(tool: Tool, profile: UserProfile): number {
        const toolPrice = this.extractPrice(tool.pricing);
        const userBudget = profile.budget.monthly;

        if (toolPrice === 0) return 1.0; // Free tools get max score
        if (toolPrice <= userBudget * 0.3) return 1.0;
        if (toolPrice <= userBudget * 0.6) return 0.8;
        if (toolPrice <= userBudget) return 0.6;
        return 0.2; // Over budget
    }

    private calculateExperienceMatch(tool: Tool, profile: UserProfile): number {
        const complexityMap = {
            'beginner': 0.3,
            'intermediate': 0.6,
            'expert': 0.9
        };

        const userLevel = complexityMap[profile.experience];
        const toolComplexity = this.estimateToolComplexity(tool);

        return 1 - Math.abs(userLevel - toolComplexity);
    }

    private calculateGoalAlignment(tool: Tool, context: RecommendationContext): number {
        const userGoals = context.userProfile.primaryGoals;
        const toolTags = tool.tags || [];
        const toolDescription = tool.description.toLowerCase();

        let alignmentScore = 0;
        userGoals.forEach(goal => {
            const goalLower = goal.toLowerCase();
            if (toolTags.some(tag => tag.toLowerCase().includes(goalLower))) {
                alignmentScore += 0.4;
            }
            if (toolDescription.includes(goalLower)) {
                alignmentScore += 0.3;
            }
            if (tool.category.toLowerCase().includes(goalLower)) {
                alignmentScore += 0.3;
            }
        });

        return Math.min(alignmentScore, 1.0);
    }

    private calculateIndustryRelevance(tool: Tool, profile: UserProfile): number {
        const industryKeywords = this.getIndustryKeywords(profile.industry);
        const toolText = `${tool.name} ${tool.description} ${tool.tags?.join(' ')}`.toLowerCase();

        const relevanceScore = industryKeywords.filter(keyword =>
            toolText.includes(keyword.toLowerCase())
        ).length / industryKeywords.length;

        return Math.min(relevanceScore, 1.0);
    }

    private calculatePopularityScore(tool: Tool): number {
        // Normalize rating to 0-1 scale
        return (tool.rating || 0) / 5.0;
    }

    private calculateROIPotential(tool: Tool, profile: UserProfile): number {
        const baseROI = 0.5;
        const industryMultiplier = this.getIndustryROIMultiplier(profile.industry);
        const teamSizeMultiplier = this.getTeamSizeMultiplier(profile.teamSize);

        return baseROI * industryMultiplier * teamSizeMultiplier;
    }

    private calculateLearningCurveScore(tool: Tool, profile: UserProfile): number {
        const experienceLevel = profile.experience;
        const toolComplexity = this.estimateToolComplexity(tool);

        // Higher score for tools that match user's experience level
        if (experienceLevel === 'beginner' && toolComplexity < 0.4) return 1.0;
        if (experienceLevel === 'intermediate' && toolComplexity >= 0.3 && toolComplexity <= 0.7) return 1.0;
        if (experienceLevel === 'expert' && toolComplexity > 0.6) return 1.0;

        return 0.5; // Neutral score for mismatches
    }

    private calculateIntegrationScore(tool: Tool, profile: UserProfile): number {
        const integrationNeeds = profile.toolPreferences.integrationNeeds;
        const hasIntegrations = tool.tags?.some(tag =>
            tag.toLowerCase().includes('api') ||
            tag.toLowerCase().includes('integration') ||
            tag.toLowerCase().includes('zapier')
        );

        if (integrationNeeds > 7 && hasIntegrations) return 1.0;
        if (integrationNeeds < 4 && !hasIntegrations) return 1.0;
        return 0.5;
    }

    private generateReasoning(factors: any, tool: Tool, context: RecommendationContext): string[] {
        const reasons: string[] = [];

        if (factors.budgetMatch > 0.8) {
            reasons.push(`Fits your budget of ${context.userProfile.budget.currency}${context.userProfile.budget.monthly}/month`);
        }

        if (factors.experienceMatch > 0.8) {
            reasons.push(`Perfect for ${context.userProfile.experience} level users`);
        }

        if (factors.goalAlignment > 0.7) {
            reasons.push(`Aligns with your goals: ${context.userProfile.primaryGoals.slice(0, 2).join(', ')}`);
        }

        if (factors.industryRelevance > 0.7) {
            reasons.push(`Popular in ${context.userProfile.industry} industry`);
        }

        if (factors.roiPotential > 0.7) {
            reasons.push(`High ROI potential for your team size`);
        }

        return reasons;
    }

    private findAlternatives(tool: Tool, context: RecommendationContext): Tool[] {
        // Find similar tools in the same category
        const { tools } = require('@/data/tools');
        return tools
            .filter((t: Tool) =>
                t.id !== tool.id &&
                t.category === tool.category &&
                t.rating !== undefined && t.rating >= 4.0
            )
            .slice(0, 3);
    }

    private estimateROI(tool: Tool, profile: UserProfile): number {
        const baseROI = 150; // 150% average ROI
        const industryMultiplier = this.getIndustryROIMultiplier(profile.industry);
        const teamSizeMultiplier = this.getTeamSizeMultiplier(profile.teamSize);

        return Math.round(baseROI * industryMultiplier * teamSizeMultiplier);
    }

    private estimateTimeToValue(tool: Tool, profile: UserProfile): number {
        const complexity = this.estimateToolComplexity(tool);
        const experience = profile.experience;

        let baseDays = 30;
        if (complexity < 0.3) baseDays = 7;
        else if (complexity < 0.6) baseDays = 14;
        else baseDays = 45;

        if (experience === 'expert') baseDays *= 0.7;
        if (experience === 'beginner') baseDays *= 1.5;

        return Math.round(baseDays);
    }

    private calculateConfidence(factors: Record<string, number>, context: RecommendationContext): number {
        const factorScores = Object.values(factors) as number[];
        const averageScore = factorScores.reduce((a: number, b: number) => a + b, 0) / factorScores.length;

        // Higher confidence for users with more data
        const dataQuality = Math.min(context.recentInteractions.length / 10, 1);

        return Math.min(averageScore * (0.7 + 0.3 * dataQuality), 1.0);
    }

    // Helper methods
    private extractPrice(pricing: string): number {
        const match = pricing.match(/\$?(\d+(?:\.\d{2})?)/);
        return match ? parseFloat(match[1]) : 0;
    }

    private estimateToolComplexity(tool: Tool): number {
        // Estimate complexity based on features and description
        const complexityIndicators = [
            tool.description.includes('enterprise'),
            tool.description.includes('advanced'),
            tool.description.includes('complex'),
            tool.tags?.some(tag => tag.includes('enterprise')),
            tool.tags?.some(tag => tag.includes('advanced'))
        ];

        return complexityIndicators.filter(Boolean).length / 5;
    }

    private getIndustryKeywords(industry: string): string[] {
        const industryMap: Record<string, string[]> = {
            'Technology': ['software', 'tech', 'development', 'coding', 'programming'],
            'Marketing': ['marketing', 'advertising', 'social media', 'campaign', 'brand'],
            'Finance': ['finance', 'accounting', 'budgeting', 'investment', 'banking'],
            'Healthcare': ['health', 'medical', 'patient', 'clinical', 'diagnosis'],
            'Education': ['education', 'learning', 'teaching', 'student', 'course'],
            'E-commerce': ['ecommerce', 'retail', 'sales', 'inventory', 'shipping']
        };

        return industryMap[industry] || [industry.toLowerCase()];
    }

    private getIndustryROIMultiplier(industry: string): number {
        const multipliers: Record<string, number> = {
            'Technology': 1.5,
            'Finance': 1.3,
            'Marketing': 1.2,
            'Healthcare': 1.1,
            'Education': 0.9,
            'E-commerce': 1.4
        };

        return multipliers[industry] || 1.0;
    }

    private getTeamSizeMultiplier(teamSize: string): number {
        const multipliers: Record<string, number> = {
            'solo': 0.8,
            'small': 1.0,
            'medium': 1.2,
            'large': 1.4,
            'enterprise': 1.6
        };

        return multipliers[teamSize] || 1.0;
    }

    private calculateLearningCurve(score: number): 'easy' | 'medium' | 'hard' {
        if (score > 0.7) return 'easy';
        if (score > 0.4) return 'medium';
        return 'hard';
    }

    private generateRecommendationContext(scoredTool: RecommendationScore, context: RecommendationContext): string[] {
        const contexts: string[] = [];

        if (scoredTool.factors.budgetMatch > 0.8) {
            contexts.push('Budget-friendly option');
        }

        if (scoredTool.factors.experienceMatch > 0.8) {
            contexts.push(`Perfect for ${context.userProfile.experience} users`);
        }

        if (scoredTool.factors.goalAlignment > 0.7) {
            contexts.push('Goal-aligned solution');
        }

        return contexts;
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Export singleton instance
export const recommendationEngine = AIRecommendationEngine.getInstance();
