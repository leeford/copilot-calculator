import { IAgent } from "../types/IAgent";

export const defaultAgents: IAgent[] = [
    {
        id: "self-service-agent",
        name: "Self service agent",
        conversationsPerDay: 0,
        billedMessagesPerDay: 0,
        scenarioConsumption: {
            classicAnswers: {
                standard: 2,
                autonomous: 0
            },
            generativeAnswers: {
                standard: 2,
                autonomous: 0
            },
            agentActions: {
                standard: 1,
                autonomous: 0
            },
            tenantGraphGrounding: {
                standard: 2,
                autonomous: 0
            },
            agentFlowActions: {
                standard: 0,
                autonomous: 0
            },
            aiToolsBasic: {
                standard: 0,
                autonomous: 0
            },
            aiToolsStandard: {
                standard: 0,
                autonomous: 0
            },
            aiToolsPremium: {
                standard: 0,
                autonomous: 0
            }
        }
    },
    {
        id: "company-knowledge-agent",
        name: "Company knowledge agent",
        scenarioConsumption: {
            classicAnswers: {
                standard: 2,
                autonomous: 0
            },
            generativeAnswers: {
                standard: 2,
                autonomous: 0
            },
            agentActions: {
                standard: 1,
                autonomous: 0
            },
            tenantGraphGrounding: {
                standard: 2,
                autonomous: 0
            },
            agentFlowActions: {
                standard: 0,
                autonomous: 0
            },
            aiToolsBasic: {
                standard: 0,
                autonomous: 0
            },
            aiToolsStandard: {
                standard: 0,
                autonomous: 0
            },
            aiToolsPremium: {
                standard: 0,
                autonomous: 0
            }
        },
        conversationsPerDay: 0,
        billedMessagesPerDay: 0
    }
]