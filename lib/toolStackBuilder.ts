import { Tool } from '@/types/tool';
import { ToolStack, ToolStackItem, UserProfile } from '@/types/user';
import { RecommendationContext, recommendationEngine } from './aiRecommendationEngine';

export interface StackTemplate {
    id: string;
    name: string;
    description: string;
    industry: string;
    useCase: string;
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedCost: number;
    tools: {
        category: string;
        role: string;
        priority: 'essential' | 'important' | 'nice-to-have';
        alternatives: number;
    }[];
}

export interface StackRecommendation {
    stack: ToolStack;
    confidence: number;
    reasoning: string[];
    alternatives: ToolStack[];
    estimatedROI: number;
    timeToImplement: number;
    learningCurve: 'easy' | 'medium' | 'hard';
}

export class ToolStackBuilder {
    private static instance: ToolStackBuilder;

    public static getInstance(): ToolStackBuilder {
        if (!ToolStackBuilder.instance) {
            ToolStackBuilder.instance = new ToolStackBuilder();
        }
        return ToolStackBuilder.instance;
    }

    /**
     * Generate personalized tool stack recommendations
     */
    async generateToolStack(
        userProfile: UserProfile,
        useCase: string,
        budget: number
    ): Promise<StackRecommendation[]> {
        const { tools } = await import('@/data/tools');

        // Get base recommendations for the use case
        const context: RecommendationContext = {
            userProfile,
            currentSearch: useCase,
            recentInteractions: [],
            searchHistory: [],
            sessionData: { timeOnSite: 0, pagesVisited: [] }
        };

        const recommendations = await recommendationEngine.generateRecommendations(context, 10);
        const recommendedTools = recommendations.map(rec =>
            tools.find(t => t.id === rec.toolId)
        ).filter(Boolean) as Tool[];

        // Build different stack configurations
        const stacks = await this.buildStackConfigurations(
            recommendedTools,
            userProfile,
            useCase,
            budget
        );

        // Score and rank stacks
        const scoredStacks = stacks.map(stack => this.scoreStack(stack, userProfile));
        scoredStacks.sort((a, b) => b.confidence - a.confidence);

        return scoredStacks.slice(0, 3);
    }

    /**
     * Build different stack configurations based on user needs
     */
    private async buildStackConfigurations(
        tools: Tool[],
        userProfile: UserProfile,
        useCase: string,
        budget: number
    ): Promise<ToolStack[]> {
        const stacks: ToolStack[] = [];

        // Configuration 1: Essential tools only
        const essentialStack = await this.buildEssentialStack(tools, userProfile, useCase, budget);
        if (essentialStack) stacks.push(essentialStack);

        // Configuration 2: Balanced stack
        const balancedStack = await this.buildBalancedStack(tools, userProfile, useCase, budget);
        if (balancedStack) stacks.push(balancedStack);

        // Configuration 3: Feature-rich stack
        const featureRichStack = await this.buildFeatureRichStack(tools, userProfile, useCase, budget);
        if (featureRichStack) stacks.push(featureRichStack);

        return stacks;
    }

    private async buildEssentialStack(
        tools: Tool[],
        userProfile: UserProfile,
        useCase: string,
        budget: number
    ): Promise<ToolStack | null> {
        const essentialTools = tools
            .filter(tool => this.isEssentialForUseCase(tool, useCase))
            .slice(0, 3);

        if (essentialTools.length === 0) return null;

        const stackItems: ToolStackItem[] = essentialTools.map(tool => ({
            toolId: tool.id,
            role: this.getToolRole(tool, useCase),
            priority: 'essential' as const,
            integrationNotes: this.generateIntegrationNotes(tool, essentialTools)
        }));

        const estimatedCost = this.calculateStackCost(essentialTools);
        if (estimatedCost > budget) return null;

        return {
            id: this.generateId(),
            userId: userProfile.userId,
            name: `${useCase} Essential Stack`,
            description: `Core tools to get started with ${useCase}`,
            tools: stackItems,
            estimatedCost,
            estimatedROI: this.calculateStackROI(essentialTools, userProfile),
            complexity: 'simple',
            useCase,
            isPublic: false,
            likes: 0,
            shares: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    private async buildBalancedStack(
        tools: Tool[],
        userProfile: UserProfile,
        useCase: string,
        budget: number
    ): Promise<ToolStack | null> {
        const balancedTools = tools
            .filter(tool => this.isBalancedForUseCase(tool, useCase))
            .slice(0, 5);

        if (balancedTools.length === 0) return null;

        const stackItems: ToolStackItem[] = balancedTools.map((tool, index) => ({
            toolId: tool.id,
            role: this.getToolRole(tool, useCase),
            priority: index < 3 ? 'essential' as const : 'important' as const,
            integrationNotes: this.generateIntegrationNotes(tool, balancedTools)
        }));

        const estimatedCost = this.calculateStackCost(balancedTools);
        if (estimatedCost > budget) return null;

        return {
            id: this.generateId(),
            userId: userProfile.userId,
            name: `${useCase} Balanced Stack`,
            description: `Complete solution for ${useCase} with essential and important tools`,
            tools: stackItems,
            estimatedCost,
            estimatedROI: this.calculateStackROI(balancedTools, userProfile),
            complexity: 'moderate',
            useCase,
            isPublic: false,
            likes: 0,
            shares: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    private async buildFeatureRichStack(
        tools: Tool[],
        userProfile: UserProfile,
        useCase: string,
        budget: number
    ): Promise<ToolStack | null> {
        const featureRichTools = tools
            .filter(tool => this.isFeatureRichForUseCase(tool, useCase))
            .slice(0, 7);

        if (featureRichTools.length === 0) return null;

        const stackItems: ToolStackItem[] = featureRichTools.map((tool, index) => ({
            toolId: tool.id,
            role: this.getToolRole(tool, useCase),
            priority: index < 3 ? 'essential' as const : index < 5 ? 'important' as const : 'nice-to-have' as const,
            integrationNotes: this.generateIntegrationNotes(tool, featureRichTools)
        }));

        const estimatedCost = this.calculateStackCost(featureRichTools);
        if (estimatedCost > budget) return null;

        return {
            id: this.generateId(),
            userId: userProfile.userId,
            name: `${useCase} Premium Stack`,
            description: `Comprehensive solution for ${useCase} with advanced features`,
            tools: stackItems,
            estimatedCost,
            estimatedROI: this.calculateStackROI(featureRichTools, userProfile),
            complexity: 'complex',
            useCase,
            isPublic: false,
            likes: 0,
            shares: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    private scoreStack(stack: ToolStack, userProfile: UserProfile): StackRecommendation {
        const reasoning: string[] = [];
        let confidence = 0.7;

        // Budget alignment
        if (stack.estimatedCost <= userProfile.budget.monthly * 0.8) {
            confidence += 0.1;
            reasoning.push('Fits within your budget');
        }

        // Experience level match
        if ((userProfile.experience === 'expert' && stack.complexity === 'complex') ||
            (userProfile.experience === 'intermediate' && stack.complexity === 'moderate') ||
            (userProfile.experience === 'beginner' && stack.complexity === 'simple')) {
            confidence += 0.1;
            reasoning.push(`Matches your ${userProfile.experience} experience level`);
        }

        // Goal alignment
        const goalAlignment = this.calculateGoalAlignment(stack, userProfile);
        if (goalAlignment > 0.7) {
            confidence += 0.1;
            reasoning.push('Aligns with your primary goals');
        }

        // ROI potential
        if (stack.estimatedROI > 200) {
            confidence += 0.1;
            reasoning.push('High ROI potential');
        }

        confidence = Math.min(confidence, 1.0);

        return {
            stack,
            confidence,
            reasoning,
            alternatives: [], // TODO: Generate alternatives
            estimatedROI: stack.estimatedROI,
            timeToImplement: this.estimateImplementationTime(stack),
            learningCurve: this.calculateLearningCurve(stack)
        };
    }

    private isEssentialForUseCase(tool: Tool, useCase: string): boolean {
        const useCaseLower = useCase.toLowerCase();
        const toolText = `${tool.name} ${tool.description} ${tool.tags?.join(' ')}`.toLowerCase();

        // Check if tool is directly related to the use case
        return toolText.includes(useCaseLower) ||
            tool.category.toLowerCase().includes(useCaseLower) ||
            tool.tags?.some(tag => tag.toLowerCase().includes(useCaseLower));
    }

    private isBalancedForUseCase(tool: Tool, useCase: string): boolean {
        return this.isEssentialForUseCase(tool, useCase) ||
            (tool.rating ? tool.rating >= 4.0 : false);
    }

    private isFeatureRichForUseCase(tool: Tool, useCase: string): boolean {
        return this.isBalancedForUseCase(tool, useCase) ||
            (tool.rating ? tool.rating >= 3.5 : false);
    }

    private getToolRole(tool: Tool, useCase: string): string {
        const roles: Record<string, string> = {
            'marketing': 'Marketing Automation',
            'design': 'Design & Creative',
            'development': 'Development & Coding',
            'analytics': 'Data & Analytics',
            'automation': 'Workflow Automation',
            'communication': 'Team Communication',
            'project management': 'Project Management',
            'finance': 'Financial Management'
        };

        return roles[useCase.toLowerCase()] || tool.category;
    }

    private generateIntegrationNotes(tool: Tool, allTools: Tool[]): string {
        const integrations = allTools.filter(t => t.id !== tool.id);
        if (integrations.length === 0) return 'Standalone tool';

        const integrationNames = integrations.slice(0, 2).map(t => t.name).join(', ');
        return `Integrates with: ${integrationNames}${integrations.length > 2 ? ' and more' : ''}`;
    }

    private calculateStackCost(tools: Tool[]): number {
        return tools.reduce((total, tool) => {
            const price = this.extractPrice(tool.pricing);
            return total + price;
        }, 0);
    }

    private calculateStackROI(tools: Tool[], userProfile: UserProfile): number {
        const baseROI = 150;
        const industryMultiplier = this.getIndustryROIMultiplier(userProfile.industry);
        const teamSizeMultiplier = this.getTeamSizeMultiplier(userProfile.teamSize);
        const toolCountMultiplier = Math.min(tools.length / 3, 1.5);

        return Math.round(baseROI * industryMultiplier * teamSizeMultiplier * toolCountMultiplier);
    }

    private calculateGoalAlignment(stack: ToolStack, userProfile: UserProfile): number {
        const userGoals = userProfile.primaryGoals;
        let alignmentScore = 0;

        userGoals.forEach(goal => {
            if (stack.description.toLowerCase().includes(goal.toLowerCase()) ||
                stack.useCase.toLowerCase().includes(goal.toLowerCase())) {
                alignmentScore += 0.3;
            }
        });

        return Math.min(alignmentScore, 1.0);
    }

    private estimateImplementationTime(stack: ToolStack): number {
        const complexityMultipliers = {
            'simple': 1,
            'moderate': 1.5,
            'complex': 2.5
        };

        const baseTime = 14; // 2 weeks base
        return Math.round(baseTime * complexityMultipliers[stack.complexity]);
    }

    private calculateLearningCurve(stack: ToolStack): 'easy' | 'medium' | 'hard' {
        const complexityMap: Record<string, 'easy' | 'medium' | 'hard'> = {
            'simple': 'easy',
            'moderate': 'medium',
            'complex': 'hard'
        };
        return complexityMap[stack.complexity] || 'medium';
    }

    private extractPrice(pricing: string): number {
        const match = pricing.match(/\$?(\d+(?:\.\d{2})?)/);
        return match ? parseFloat(match[1]) : 0;
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

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Export singleton instance
export const toolStackBuilder = ToolStackBuilder.getInstance();
