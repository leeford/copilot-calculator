import { CopilotSku } from "./CopilotSku";
import { IAgent } from "./IAgent";

export interface ICalculatorValues {
    copilotSku: CopilotSku;
    licenseCost: number;
    creditCost: number;
    users: number;
    workDays: number;
    agents: IAgent[];
}