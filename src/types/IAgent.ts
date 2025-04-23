import { IAgentScenarioConsumption } from "./IAgentScenarioConsumption";

export interface IAgent {
    id: string;
    name: string;
    conversationsPerDay: number;
    billedMessagesPerDay: number;
    scenarioConsumption: IAgentScenarioConsumption;
}