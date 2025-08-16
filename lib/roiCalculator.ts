import { Tool } from '@/types/tool';
import { UserProfile } from '@/types/user';

export interface ROICalculation {
    toolId: string;
    toolName: string;
    investment: {
        monthly: number;
        annual: number;
        setup: number;
        training: number;
        total: number;
    };
    returns: {
        timeSavings: number;
        productivityGains: number;
        costReduction: number;
        revenueIncrease: number;
        total: number;
    };
    roi: {
        percentage: number;
        paybackPeriod: number;
        netPresentValue: number;
        internalRateOfReturn: number;
    };
    breakdown: {
        timeSavings: {
            hoursPerMonth: number;
            hourlyRate: number;
            monthlyValue: number;
        };
        productivityGains: {
            efficiencyImprovement: number;
            teamSize: number;
            averageSalary: number;
            monthlyValue: number;
        };
        costReduction: {
            currentCosts: number;
            newCosts: number;
            monthlySavings: number;
        };
        revenueIncrease: {
            currentRevenue: number;
            expectedGrowth: number;
            monthlyIncrease: number;
        };
    };
    confidence: number;
    assumptions: string[];
}

export interface StackROICalculation {
    stackId: string;
    stackName: string;
    tools: ROICalculation[];
    totalInvestment: number;
    totalReturns: number;
    overallROI: number;
    paybackPeriod: number;
    riskAssessment: 'low' | 'medium' | 'high';
    recommendations: string[];
}

export class ROICalculator {
    private static instance: ROICalculator;

    public static getInstance(): ROICalculator {
        if (!ROICalculator.instance) {
            ROICalculator.instance = new ROICalculator();
        }
        return ROICalculator.instance;
    }

    /**
     * Calculate comprehensive ROI for a single tool
     */
    calculateToolROI(tool: Tool, userProfile: UserProfile): ROICalculation {
        const investment = this.calculateInvestment(tool, userProfile);
        const returns = this.calculateReturns(tool, userProfile);
        const roi = this.calculateROIMetrics(investment.total, returns.total);
        const breakdown = this.calculateBreakdown(tool, userProfile);
        const confidence = this.calculateConfidence(tool, userProfile);
        const assumptions = this.generateAssumptions(tool, userProfile);

        return {
            toolId: tool.id,
            toolName: tool.name,
            investment,
            returns,
            roi,
            breakdown,
            confidence,
            assumptions
        };
    }

    /**
     * Calculate ROI for an entire tool stack
     */
    calculateStackROI(tools: Tool[], userProfile: UserProfile): StackROICalculation {
        const toolROIs = tools.map(tool => this.calculateToolROI(tool, userProfile));

        const totalInvestment = toolROIs.reduce((sum, roi) => sum + roi.investment.total, 0);
        const totalReturns = toolROIs.reduce((sum, roi) => sum + roi.returns.total, 0);
        const overallROI = this.calculateROIMetrics(totalInvestment, totalReturns);
        const paybackPeriod = this.calculatePaybackPeriod(totalInvestment, totalReturns);
        const riskAssessment = this.assessRisk(toolROIs, userProfile);
        const recommendations = this.generateRecommendations(toolROIs, userProfile);

        return {
            stackId: this.generateId(),
            stackName: `${tools.length} Tool Stack`,
            tools: toolROIs,
            totalInvestment,
            totalReturns,
            overallROI: overallROI.percentage,
            paybackPeriod,
            riskAssessment,
            recommendations
        };
    }

    private calculateInvestment(tool: Tool, userProfile: UserProfile) {
        const monthlyCost = this.extractPrice(tool.pricing);
        const setupCost = this.estimateSetupCost(tool, userProfile);
        const trainingCost = this.estimateTrainingCost(tool, userProfile);

        return {
            monthly: monthlyCost,
            annual: monthlyCost * 12,
            setup: setupCost,
            training: trainingCost,
            total: monthlyCost * 12 + setupCost + trainingCost
        };
    }

    private calculateReturns(tool: Tool, userProfile: UserProfile) {
        const timeSavings = this.calculateTimeSavings(tool, userProfile);
        const productivityGains = this.calculateProductivityGains(tool, userProfile);
        const costReduction = this.calculateCostReduction(tool, userProfile);
        const revenueIncrease = this.calculateRevenueIncrease(tool, userProfile);

        return {
            timeSavings,
            productivityGains,
            costReduction,
            revenueIncrease,
            total: timeSavings + productivityGains + costReduction + revenueIncrease
        };
    }

    private calculateROIMetrics(investment: number, returns: number) {
        const roiPercentage = investment > 0 ? ((returns - investment) / investment) * 100 : 0;
        const paybackPeriod = returns > 0 ? investment / (returns / 12) : Infinity;
        const npv = this.calculateNPV(investment, returns);
        const irr = this.calculateIRR(investment, returns);

        return {
            percentage: Math.round(roiPercentage * 100) / 100,
            paybackPeriod: Math.round(paybackPeriod * 100) / 100,
            netPresentValue: Math.round(npv),
            internalRateOfReturn: Math.round(irr * 100) / 100
        };
    }

    private calculateBreakdown(tool: Tool, userProfile: UserProfile) {
        const timeSavings = this.calculateTimeSavingsBreakdown(tool, userProfile);
        const productivityGains = this.calculateProductivityBreakdown(tool, userProfile);
        const costReduction = this.calculateCostReductionBreakdown(tool, userProfile);
        const revenueIncrease = this.calculateRevenueBreakdown(tool, userProfile);

        return {
            timeSavings,
            productivityGains,
            costReduction,
            revenueIncrease
        };
    }

    private calculateTimeSavings(tool: Tool, userProfile: UserProfile): number {
        const hoursPerMonth = this.estimateTimeSavings(tool);
        const hourlyRate = this.getHourlyRate(userProfile);
        return hoursPerMonth * hourlyRate * 12;
    }

    private calculateProductivityGains(tool: Tool, userProfile: UserProfile): number {
        const efficiencyImprovement = this.estimateEfficiencyImprovement(tool);
        const teamSize = this.getTeamSizeMultiplier(userProfile.teamSize);
        const averageSalary = this.getAverageSalary(userProfile);
        return (efficiencyImprovement * teamSize * averageSalary * 0.1) * 12;
    }

    private calculateCostReduction(tool: Tool, userProfile: UserProfile): number {
        const currentCosts = this.estimateCurrentCosts(tool, userProfile);
        const newCosts = this.extractPrice(tool.pricing) * 12;
        return Math.max(0, currentCosts - newCosts);
    }

    private calculateRevenueIncrease(tool: Tool, userProfile: UserProfile): number {
        const currentRevenue = this.estimateCurrentRevenue(userProfile);
        const expectedGrowth = this.estimateRevenueGrowth(tool);
        return currentRevenue * expectedGrowth;
    }

    private calculateTimeSavingsBreakdown(tool: Tool, userProfile: UserProfile) {
        const hoursPerMonth = this.estimateTimeSavings(tool);
        const hourlyRate = this.getHourlyRate(userProfile);

        return {
            hoursPerMonth,
            hourlyRate,
            monthlyValue: hoursPerMonth * hourlyRate
        };
    }

    private calculateProductivityBreakdown(tool: Tool, userProfile: UserProfile) {
        const efficiencyImprovement = this.estimateEfficiencyImprovement(tool);
        const teamSize = this.getTeamSizeMultiplier(userProfile.teamSize);
        const averageSalary = this.getAverageSalary(userProfile);

        return {
            efficiencyImprovement,
            teamSize,
            averageSalary,
            monthlyValue: (efficiencyImprovement * teamSize * averageSalary * 0.1)
        };
    }

    private calculateCostReductionBreakdown(tool: Tool, userProfile: UserProfile) {
        const currentCosts = this.estimateCurrentCosts(tool, userProfile);
        const newCosts = this.extractPrice(tool.pricing) * 12;

        return {
            currentCosts,
            newCosts,
            monthlySavings: Math.max(0, (currentCosts - newCosts) / 12)
        };
    }

    private calculateRevenueBreakdown(tool: Tool, userProfile: UserProfile) {
        const currentRevenue = this.estimateCurrentRevenue(userProfile);
        const expectedGrowth = this.estimateRevenueGrowth(tool);

        return {
            currentRevenue,
            expectedGrowth,
            monthlyIncrease: (currentRevenue * expectedGrowth) / 12
        };
    }

    private calculateConfidence(tool: Tool, userProfile: UserProfile): number {
        let confidence = 0.7;

        // Higher confidence for tools with good ratings
        if (tool.rating && tool.rating >= 4.5) confidence += 0.1;
        if (tool.rating && tool.rating >= 4.0) confidence += 0.05;

        // Higher confidence for tools in user's industry
        if (this.isIndustryRelevant(tool, userProfile.industry)) confidence += 0.1;

        // Higher confidence for tools matching user's experience level
        if (this.matchesExperienceLevel(tool, userProfile.experience)) confidence += 0.05;

        return Math.min(confidence, 1.0);
    }

    private generateAssumptions(tool: Tool, userProfile: UserProfile): string[] {
        const assumptions: string[] = [];

        assumptions.push(`Based on ${userProfile.industry} industry averages`);
        assumptions.push(`Assumes ${userProfile.teamSize} team size`);
        assumptions.push(`Uses ${userProfile.experience} level implementation timeline`);
        assumptions.push('ROI calculated over 12-month period');
        assumptions.push('Includes setup and training costs');

        if (tool.rating && tool.rating < 4.0) {
            assumptions.push('Lower confidence due to tool rating');
        }

        return assumptions;
    }

    private calculatePaybackPeriod(investment: number, annualReturns: number): number {
        if (annualReturns <= 0) return Infinity;
        return investment / (annualReturns / 12);
    }

    private calculateNPV(investment: number, returns: number): number {
        const discountRate = 0.1; // 10% discount rate
        return -investment + (returns / Math.pow(1 + discountRate, 1));
    }

    private calculateIRR(investment: number, returns: number): number {
        // Simplified IRR calculation
        if (investment <= 0 || returns <= 0) return 0;
        return (returns - investment) / investment;
    }

    private assessRisk(toolROIs: ROICalculation[], userProfile: UserProfile): 'low' | 'medium' | 'high' {
        const avgConfidence = toolROIs.reduce((sum, roi) => sum + roi.confidence, 0) / toolROIs.length;
        const totalInvestment = toolROIs.reduce((sum, roi) => sum + roi.investment.total, 0);
        const budgetRatio = totalInvestment / (userProfile.budget.annual * 12);

        if (avgConfidence > 0.8 && budgetRatio < 0.3) return 'low';
        if (avgConfidence > 0.6 && budgetRatio < 0.6) return 'medium';
        return 'high';
    }

    private generateRecommendations(toolROIs: ROICalculation[], userProfile: UserProfile): string[] {
        const recommendations: string[] = [];

        const highROITools = toolROIs.filter(roi => roi.roi.percentage > 200);
        if (highROITools.length > 0) {
            recommendations.push(`Prioritize ${highROITools[0].toolName} - highest ROI at ${highROITools[0].roi.percentage}%`);
        }

        const quickPaybackTools = toolROIs.filter(roi => roi.roi.paybackPeriod < 6);
        if (quickPaybackTools.length > 0) {
            recommendations.push(`Start with ${quickPaybackTools[0].toolName} - pays back in ${quickPaybackTools[0].roi.paybackPeriod} months`);
        }

        const totalInvestment = toolROIs.reduce((sum, roi) => sum + roi.investment.total, 0);
        if (totalInvestment > userProfile.budget.annual * 0.8) {
            recommendations.push('Consider implementing tools in phases to manage budget');
        }

        return recommendations;
    }

    // Helper methods
    private extractPrice(pricing: string): number {
        const match = pricing.match(/\$?(\d+(?:\.\d{2})?)/);
        return match ? parseFloat(match[1]) : 0;
    }

    private estimateSetupCost(tool: Tool, userProfile: UserProfile): number {
        const baseSetupCost = 500;
        const complexityMultiplier = this.getComplexityMultiplier(tool);
        const teamSizeMultiplier = this.getTeamSizeMultiplier(userProfile.teamSize);

        return Math.round(baseSetupCost * complexityMultiplier * teamSizeMultiplier);
    }

    private estimateTrainingCost(tool: Tool, userProfile: UserProfile): number {
        const baseTrainingCost = 200;
        const complexityMultiplier = this.getComplexityMultiplier(tool);
        const teamSizeMultiplier = this.getTeamSizeMultiplier(userProfile.teamSize);

        return Math.round(baseTrainingCost * complexityMultiplier * teamSizeMultiplier);
    }

    private estimateTimeSavings(tool: Tool): number {
        const categorySavings: Record<string, number> = {
            'Marketing': 20,
            'Design': 15,
            'Development': 25,
            'Analytics': 18,
            'Automation': 30,
            'Communication': 12,
            'Project Management': 22,
            'Finance': 16
        };

        return categorySavings[tool.category] || 15;
    }

    private estimateEfficiencyImprovement(tool: Tool): number {
        const baseImprovement = 0.15; // 15% base improvement
        const ratingMultiplier = (tool.rating || 4.0) / 5.0;

        return baseImprovement * ratingMultiplier;
    }

    private estimateCurrentCosts(tool: Tool, userProfile: UserProfile): number {
        // Estimate what they might be spending on similar tools/services
        const categoryCosts: Record<string, number> = {
            'Marketing': 2000,
            'Design': 1500,
            'Development': 3000,
            'Analytics': 1800,
            'Automation': 2500,
            'Communication': 800,
            'Project Management': 1200,
            'Finance': 1000
        };

        return categoryCosts[tool.category] || 1500;
    }

    private estimateCurrentRevenue(userProfile: UserProfile): number {
        const industryRevenue: Record<string, number> = {
            'Technology': 500000,
            'Finance': 800000,
            'Marketing': 300000,
            'Healthcare': 600000,
            'Education': 200000,
            'E-commerce': 400000
        };

        return industryRevenue[userProfile.industry] || 300000;
    }

    private estimateRevenueGrowth(tool: Tool): number {
        const categoryGrowth: Record<string, number> = {
            'Marketing': 0.25,
            'Design': 0.15,
            'Development': 0.30,
            'Analytics': 0.20,
            'Automation': 0.35,
            'Communication': 0.10,
            'Project Management': 0.18,
            'Finance': 0.12
        };

        return categoryGrowth[tool.category] || 0.15;
    }

    private getHourlyRate(userProfile: UserProfile): number {
        const industryRates: Record<string, number> = {
            'Technology': 75,
            'Finance': 85,
            'Marketing': 60,
            'Healthcare': 70,
            'Education': 45,
            'E-commerce': 65
        };

        return industryRates[userProfile.industry] || 60;
    }

    private getAverageSalary(userProfile: UserProfile): number {
        const industrySalaries: Record<string, number> = {
            'Technology': 120000,
            'Finance': 140000,
            'Marketing': 90000,
            'Healthcare': 110000,
            'Education': 70000,
            'E-commerce': 100000
        };

        return industrySalaries[userProfile.industry] || 90000;
    }

    private getComplexityMultiplier(tool: Tool): number {
        const complexityIndicators = [
            tool.description.includes('enterprise'),
            tool.description.includes('advanced'),
            tool.description.includes('complex'),
            tool.tags?.some(tag => tag.includes('enterprise')),
            tool.tags?.some(tag => tag.includes('advanced'))
        ];

        const complexityScore = complexityIndicators.filter(Boolean).length / 5;
        return 0.5 + complexityScore * 1.5; // 0.5 to 2.0
    }

    private getTeamSizeMultiplier(teamSize: string): number {
        const multipliers: Record<string, number> = {
            'solo': 0.5,
            'small': 1.0,
            'medium': 1.5,
            'large': 2.0,
            'enterprise': 3.0
        };

        return multipliers[teamSize] || 1.0;
    }

    private isIndustryRelevant(tool: Tool, industry: string): boolean {
        const toolText = `${tool.name} ${tool.description} ${tool.tags?.join(' ')}`.toLowerCase();
        const industryKeywords = this.getIndustryKeywords(industry);

        return industryKeywords.some(keyword => toolText.includes(keyword.toLowerCase()));
    }

    private matchesExperienceLevel(tool: Tool, experience: string): boolean {
        const complexity = this.getComplexityMultiplier(tool);

        if (experience === 'beginner' && complexity < 1.2) return true;
        if (experience === 'intermediate' && complexity >= 1.0 && complexity <= 1.8) return true;
        if (experience === 'expert' && complexity > 1.5) return true;

        return false;
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

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Export singleton instance
export const roiCalculator = ROICalculator.getInstance();
