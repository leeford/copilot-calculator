import { IAgentScenarioType } from "./IAgentScenarioType";

export interface IAgentScenarioConsumption {
    classicAnswers: IAgentScenarioType;
    generativeAnswers: IAgentScenarioType;
    agentActions: IAgentScenarioType;
    tenantGraphGrounding: IAgentScenarioType;
    agentFlowActions: IAgentScenarioType;
    aiToolsBasic: IAgentScenarioType;
    aiToolsStandard: IAgentScenarioType;
    aiToolsPremium: IAgentScenarioType;
}