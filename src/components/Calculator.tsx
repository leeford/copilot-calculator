import React, { useState } from "react";
import { CompoundButton, Input, Text } from "@fluentui/react-components";
import { Container } from "./Container";
import { sharedCompoundButtonStyles, sharedFilledPillStyles, sharedHorizontalMediumGapWrapFlexStyles, sharedVerticalMediumGapFlexStyles } from "../styles/Styles";
import { CustomField } from "./CustomField";
import { Agent } from "./Agent";
import { CalculatorResults } from "./CalculatorResults";
import { CopilotSku } from "../types/CopilotSku";
import { ICalculatorValues } from "../types/ICalculatorValues";
import { IAgentScenarioConsumption } from "../types/IAgentScenarioConsumption";
import { defaultAgents } from "../config/agents";

// Default values for the calculator
const NUMBER_OF_USERS = 100;
const AVERAGE_SALARY = 35000;
const LICENSE_COST_PER_USER = 30; // USD
const MESSAGE_COST = 0.01; // USD
const WORK_HOURS = 7;
const WORK_DAYS = 20;

export const Calculator: React.FC = () => {

    const filledPillStyles = sharedFilledPillStyles();
    const compoundButtonStyles = sharedCompoundButtonStyles();
    const horizontalMediumGapWrapFlexStyles = sharedHorizontalMediumGapWrapFlexStyles();
    const verticalMediumGapFlexStyles = sharedVerticalMediumGapFlexStyles();

    const [values, setValues] = useState<ICalculatorValues>({
        copilotSku: CopilotSku.M365Copilot,
        users: NUMBER_OF_USERS,
        averageSalary: AVERAGE_SALARY,
        licenseCost: LICENSE_COST_PER_USER,
        messageCost: MESSAGE_COST,
        workHours: WORK_HOURS,
        workDays: WORK_DAYS,
        agents: defaultAgents
    });

    const updateAgent = (agentId: string, name: string, conversationsPerDay: number, billedMessagesPerDay: number, scenarioConsumption?: IAgentScenarioConsumption) => {
        setValues(prevValues => ({
            ...prevValues,
            agents: prevValues.agents.map(agent =>
                agent.id === agentId
                    ? {
                        ...agent,
                        name: name,
                        conversationsPerDay: conversationsPerDay,
                        billedMessagesPerDay: billedMessagesPerDay,
                        scenarioConsumption: scenarioConsumption || agent.scenarioConsumption
                    }
                    : agent
            )
        }));
    };

    return (
        <div className={verticalMediumGapFlexStyles.root}>
            <Container
                icon={<p className={filledPillStyles.root}>STEP 1</p>}
                header="Choose your Copilot"
                description="Pick the Copilot you want to use that best fits your needs."
                width={800}
            >
                <CustomField
                    label="Which version of Copilot do you want to use?"
                    required
                >
                    <div className={horizontalMediumGapWrapFlexStyles.root}>
                        <CompoundButton
                            secondaryContent={
                                <ul>
                                    <li>
                                        <Text>$30 per user, per month license</Text>
                                    </li>
                                    <li>
                                        <Text>Full functionality</Text>
                                    </li>
                                    <li>
                                        <Text>Use agents to extend and customize the Copilot experience (some additional charges apply)</Text>
                                    </li>
                                    <li>
                                        <Text>Use Copilot in M365 applications like Word, Excel, etc.</Text>
                                    </li>
                                </ul>
                            }
                            onClick={() => setValues({ ...values, copilotSku: CopilotSku.M365Copilot })}
                            value={CopilotSku.M365Copilot}
                            className={compoundButtonStyles.root}
                            size="large"
                            appearance={values.copilotSku === CopilotSku.M365Copilot ? "primary" : "secondary"}
                        >
                            M365 Copilot
                        </CompoundButton>
                        <CompoundButton
                            secondaryContent={
                                <ul>
                                    <li>
                                        <Text>No monthly license cost</Text>
                                    </li>
                                    <li>
                                        <Text>Reduced functionality</Text>
                                    </li>
                                    <li>
                                        <Text>Use agents to extend and customize the Copilot experience (additional charges apply)</Text>
                                    </li>
                                </ul>
                            }
                            onClick={() => setValues({ ...values, copilotSku: CopilotSku.M365CopilotChat })}
                            value={CopilotSku.M365CopilotChat}
                            className={compoundButtonStyles.root}
                            size="large"
                            appearance={values.copilotSku === CopilotSku.M365CopilotChat ? "primary" : "secondary"}
                        >
                            M365 Copilot Chat
                        </CompoundButton>
                    </div>
                </CustomField>
            </Container>
            <Container
                icon={<p className={filledPillStyles.root}>STEP 2</p>}
                header="Size your Copilot"
                description="Provide a few details about your organization to get a better estimate."
                width={800}
            >
                <CustomField
                    label="How many users do you want to use Copilot?"
                    required
                    hint="This is the number of users that will be using Copilot in your organization."
                >
                    <Input
                        value={values.users.toString()}
                        type="tel"
                        onChange={(_, data) => {
                            const parsedValue = parseInt(data.value);
                            if (isNaN(parsedValue)) {
                                setValues({ ...values, users: 0 });
                            } else {
                                setValues({ ...values, users: parsedValue });
                            }
                        }}
                        placeholder="Enter number of users"
                        contentAfter={"users"}
                    />
                </CustomField>
                <CustomField
                    label="What is the average salary of your users?"
                    required
                    hint="This is the average salary of the users that will be using Copilot in your organization. It is used to calculate the break-even point."
                >
                    <Input
                        value={values.averageSalary.toString()}
                        type="tel"
                        onChange={(_, data) => {
                            const parsedValue = parseInt(data.value);
                            if (isNaN(parsedValue)) {
                                setValues({ ...values, averageSalary: 0 });
                            } else {
                                setValues({ ...values, averageSalary: parsedValue });
                            }
                        }}
                        placeholder="Enter average salary"
                        contentBefore={"$"}
                    />
                </CustomField>
                <CustomField
                    label="How many hours do your users work per day?"
                    required
                    hint="This is the number of hours that your users work per day. It is used to calculate the break-even point."
                >
                    <Input
                        value={values.workHours.toString()}
                        type="tel"
                        onChange={(_, data) => {
                            const parsedValue = parseFloat(data.value);
                            if (isNaN(parsedValue) || parsedValue > 24) {
                                setValues({ ...values, workHours: 0 });
                            } else {
                                setValues({ ...values, workHours: parsedValue });
                            }
                        }}
                        placeholder="Enter number of hours"
                        contentAfter={"hours"}
                    />
                </CustomField>
                <CustomField
                    label="How many days do your users work per month?"
                    required
                    hint="This is the number of days that your users work per month. It is used to calculate the break-even point."
                >
                    <Input
                        value={values.workDays.toString()}
                        type="tel"
                        onChange={(_, data) => {
                            const parsedValue = parseInt(data.value);
                            if (isNaN(parsedValue) || parsedValue > 31) {
                                setValues({ ...values, workDays: 0 });
                            }
                            else {
                                setValues({ ...values, workDays: parsedValue });
                            }
                        }}
                        placeholder="Enter number of days"
                        contentAfter={"days"}
                    />
                </CustomField>
            </Container>
            <Container
                icon={<p className={filledPillStyles.root}>STEP 3</p>}
                header="Extend your Copilot"
                description="Bring in added functionality to your Copilot experience in the form of Copilot Studio agents."
                width={800}
            >
                <Text>Sizing up and predicting the cost of agents is not an exact science. <b>To simplify the process, we have provided some example agents that may fit your use-cases.</b> Bear in mind these are just a best-guess and may vary wildly in real-world scenarios.</Text>
                {values.agents.map((agent) => (
                    <Agent
                        key={agent.id}
                        name={agent.name}
                        agentId={agent.id}
                        conversationsPerDay={agent.conversationsPerDay}
                        updateAgent={updateAgent}
                        scenarioConsumption={agent.scenarioConsumption}
                        copilotSku={values.copilotSku}
                        users={values.users}
                        workDays={values.workDays}
                    />
                ))}
            </Container>
            <CalculatorResults
                values={values}
            />
        </div>
    );
};