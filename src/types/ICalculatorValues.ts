import { CopilotSku } from "./CopilotSku";
import { IAgent } from "./IAgent";

export interface ICalculatorValues {
    copilotSku: CopilotSku;
    licenseCost: number;
    messageCost: number;
    users: number;
    averageSalary: number;
    workHours: number;
    workDays: number;
    agents: IAgent[];
}