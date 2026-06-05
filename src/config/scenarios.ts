import { CopilotSku } from "../types/CopilotSku";
import { IAgentScenarioConsumption } from "../types/IAgentScenarioConsumption";

export interface ScenarioConfigItem {
    key: keyof IAgentScenarioConsumption;
    name: string;
    billingRate: number;
    isIncludedWithLicense: boolean;
    supportsAutonomous?: boolean;
}

// Credit billing rates (shared)
const CLASSIC_ANSWER_MESSAGE_BILLING_RATE = 1;
const GENERATIVE_ANSWER_MESSAGE_BILLING_RATE = 2;
const AGENT_ACTION_MESSAGE_BILLING_RATE = 5;
const TENANT_GRAPH_GROUNDING_MESSAGE_BILLING_RATE = 10;
const AGENT_FLOW_ACTIONS_BILLING_RATE = 13;
const AI_TOOLS_BASIC_BILLING_RATE = 0.1;
const AI_TOOLS_STANDARD_BILLING_RATE = 1.5;
const AI_TOOLS_PREMIUM_BILLING_RATE = 10;
const CONTENT_PROCESSING_BILLING_RATE = 8;
const VOICE_BASIC_BILLING_RATE = 10;
const VOICE_STANDARD_BILLING_RATE = 35;
const VOICE_PREMIUM_BILLING_RATE = 75;
const REASONING_MODEL_BILLING_RATE = 10; // 100 credits per 10 responses = 10 credits per 1K tokens

export const scenarioConfigs: ScenarioConfigItem[] = [
    {
        key: "classicAnswers",
        name: "Classic answers",
        billingRate: CLASSIC_ANSWER_MESSAGE_BILLING_RATE,
        isIncludedWithLicense: true,
        supportsAutonomous: false,
    },
    {
        key: "generativeAnswers",
        name: "Generative answers",
        billingRate: GENERATIVE_ANSWER_MESSAGE_BILLING_RATE,
        isIncludedWithLicense: true,
        supportsAutonomous: true,
    },
    {
        key: "agentActions",
        name: "Agent actions",
        billingRate: AGENT_ACTION_MESSAGE_BILLING_RATE,
        isIncludedWithLicense: true,
        supportsAutonomous: true,
    },
    {
        key: "tenantGraphGrounding",
        name: "Tenant graph grounding",
        billingRate: TENANT_GRAPH_GROUNDING_MESSAGE_BILLING_RATE,
        isIncludedWithLicense: true,
        supportsAutonomous: true,
    },
    {
        key: "agentFlowActions",
        name: "Agent flow actions (per 100 actions)",
        billingRate: AGENT_FLOW_ACTIONS_BILLING_RATE,
        isIncludedWithLicense: false,
        supportsAutonomous: true,
    },
    {
        key: "aiToolsBasic",
        name: "AI tools: Basic response",
        billingRate: AI_TOOLS_BASIC_BILLING_RATE,
        isIncludedWithLicense: false,
        supportsAutonomous: true,
    },
    {
        key: "aiToolsStandard",
        name: "AI tools: Standard response",
        billingRate: AI_TOOLS_STANDARD_BILLING_RATE,
        isIncludedWithLicense: false,
        supportsAutonomous: true,
    },
    {
        key: "aiToolsPremium",
        name: "AI tools: Premium response",
        billingRate: AI_TOOLS_PREMIUM_BILLING_RATE,
        isIncludedWithLicense: false,
        supportsAutonomous: true,
    },
    {
        key: "contentProcessing",
        name: "Content processing tools (per page)",
        billingRate: CONTENT_PROCESSING_BILLING_RATE,
        isIncludedWithLicense: false,
        supportsAutonomous: true,
    },
    {
        key: "voiceBasic",
        name: "Voice: Basic (classic orchestration)",
        billingRate: VOICE_BASIC_BILLING_RATE,
        isIncludedWithLicense: true,
        supportsAutonomous: false,
    },
    {
        key: "voiceStandard",
        name: "Voice: Standard (generative orchestration)",
        billingRate: VOICE_STANDARD_BILLING_RATE,
        isIncludedWithLicense: true,
        supportsAutonomous: false,
    },
    {
        key: "voicePremium",
        name: "Voice: Premium (real-time)",
        billingRate: VOICE_PREMIUM_BILLING_RATE,
        isIncludedWithLicense: true,
        supportsAutonomous: false,
    },
    {
        key: "reasoningModel",
        name: "Reasoning model surcharge",
        billingRate: REASONING_MODEL_BILLING_RATE,
        isIncludedWithLicense: false,
        supportsAutonomous: true,
    },
];

export const calculateCreditsPerConversation = (
    scenarioConsumption: IAgentScenarioConsumption,
    sku: CopilotSku
): number => {
    const isLicensed = sku === CopilotSku.M365Copilot;
    return scenarioConfigs.reduce((total, scenario) => {
        const value = scenarioConsumption[scenario.key];
        const standard = isLicensed ? 0 : value.standard * scenario.billingRate;
        const autonomous = value.autonomous * scenario.billingRate;
        return total + standard + autonomous;
    }, 0);
};
