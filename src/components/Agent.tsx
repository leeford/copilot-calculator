import React, { useState, useEffect } from "react";
import { Collapse } from "@fluentui/react-motion-components-preview";
import { Container } from "./Container";
import { Switch, Text, Divider, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Input, Subtitle1, Button, makeStyles } from "@fluentui/react-components";
import { CustomField } from "./CustomField";
import { IAgentScenarioConsumption } from "../types/IAgentScenarioConsumption";
import { sharedHorizontalMediumGapFlexStyles, sharedVerticalExtraSmallGapFlexStyles, sharedVerticalMediumGapFlexStyles } from "../styles/Styles";
import { CopilotSku } from "../types/CopilotSku";
import { formatNumber } from "../utils/formatUtils";
import { Add12Filled, Add12Regular, bundleIcon, Subtract12Filled, Subtract12Regular } from "@fluentui/react-icons";
import { ResultsContainer } from "./ResultsContainer";

const agentStyles = makeStyles({
    button: {
        maxWidth: "20px"
    }
});

const AddIcon = bundleIcon(Add12Filled, Add12Regular);
const SubtractIcon = bundleIcon(Subtract12Filled, Subtract12Regular);

interface IAgentProps {
    name: string;
    agentId: string;
    conversationsPerDay: number;
    updateAgent: (
        agentId: string,
        name: string,
        conversationsPerDay: number,
        billedMessagesPerDay: number,
        scenarioConsumption?: IAgentScenarioConsumption
    ) => void;
    scenarioConsumption: IAgentScenarioConsumption;
    copilotSku: CopilotSku;
    users: number;
    workDays: number;
}

// Message billing rates
const CLASSIC_ANSWER_MESSAGE_BILLING_RATE = 1;
const GENERATIVE_ANSWER_MESSAGE_BILLING_RATE = 2;
const AGENT_ACTION_MESSAGE_BILLING_RATE = 5;
const TENANT_GRAPH_GROUNDING_MESSAGE_BILLING_RATE = 10;
const AGENT_FLOW_ACTIONS_BILLING_RATE = 13;
const AI_TOOLS_BASIC_BILLING_RATE = 0.1;
const AI_TOOLS_STANDARD_BILLING_RATE = 1.5;
const AI_TOOLS_PREMIUM_BILLING_RATE = 10;

// Strings
const INCLUDED_WITH_LICENSE = "(Included with M365 Copilot license)";

interface ScenarioConfig {
    key: keyof IAgentScenarioConsumption;
    name: string;
    billingRate: number;
    isIncludedWithLicense: boolean;
    supportsAutonomous?: boolean;
}

// All scenarios types
const scenarioConfigs: ScenarioConfig[] = [
    {
        key: "classicAnswers",
        name: "Classic answers",
        billingRate: CLASSIC_ANSWER_MESSAGE_BILLING_RATE,
        isIncludedWithLicense: true,
        supportsAutonomous: false
    },
    {
        key: "generativeAnswers",
        name: "Generative answers",
        billingRate: GENERATIVE_ANSWER_MESSAGE_BILLING_RATE,
        isIncludedWithLicense: true,
        supportsAutonomous: true
    },
    {
        key: "agentActions",
        name: "Agent actions",
        billingRate: AGENT_ACTION_MESSAGE_BILLING_RATE,
        isIncludedWithLicense: true,
        supportsAutonomous: true
    },
    {
        key: "tenantGraphGrounding",
        name: "Tenant graph grounding",
        billingRate: TENANT_GRAPH_GROUNDING_MESSAGE_BILLING_RATE,
        isIncludedWithLicense: true,
        supportsAutonomous: true
    },
    {
        key: "agentFlowActions",
        name: "Agent flow actions",
        billingRate: AGENT_FLOW_ACTIONS_BILLING_RATE,
        isIncludedWithLicense: false,
        supportsAutonomous: true
    },
    {
        key: "aiToolsBasic",
        name: "AI tools: Basic response",
        billingRate: AI_TOOLS_BASIC_BILLING_RATE,
        isIncludedWithLicense: false,
        supportsAutonomous: true
    },
    {
        key: "aiToolsStandard",
        name: "AI tools: Standard response",
        billingRate: AI_TOOLS_STANDARD_BILLING_RATE,
        isIncludedWithLicense: false,
        supportsAutonomous: true
    },
    {
        key: "aiToolsPremium",
        name: "AI tools: Premium response",
        billingRate: AI_TOOLS_PREMIUM_BILLING_RATE,
        isIncludedWithLicense: false,
        supportsAutonomous: true
    }
];

export const Agent: React.FunctionComponent<IAgentProps> = (props) => {

    const styles = agentStyles();
    const verticalExtraSmallGapFlexStyles = sharedVerticalExtraSmallGapFlexStyles();
    const verticalMediumGapFlexStyles = sharedVerticalMediumGapFlexStyles();
    const horizontalMediumGapFlexStyles = sharedHorizontalMediumGapFlexStyles();

    const [calculationVisible, setCalculationVisible] = useState<boolean>(false);
    const [localScenarioConsumption, setLocalScenarioConsumption] = useState<IAgentScenarioConsumption>(props.scenarioConsumption);
    const [agentName, setAgentName] = useState<string>(props.name);
    const [conversationsPerDay, setConversationsPerDay] = useState<number>(props.conversationsPerDay);

    // Update local state when props change
    useEffect(() => {
        setLocalScenarioConsumption(props.scenarioConsumption);
    }, [props.scenarioConsumption]);

    // Calculate messages per conversation
    const calculateMessagesPerConversation = () => {
        const isLicensed = props.copilotSku === CopilotSku.M365Copilot;

        return scenarioConfigs.reduce((total, scenario) => {
            const scenarioValue = localScenarioConsumption[scenario.key];

            // Calculate "standard" cost (free if licensed and included with license)
            const standardCost = (isLicensed && scenario.isIncludedWithLicense)
                ? 0
                : scenarioValue.standard * scenario.billingRate;

            // "autonomous" is always charged
            const autonomousCost = scenarioValue.autonomous * scenario.billingRate;

            return total + standardCost + autonomousCost;
        }, 0);
    };

    const messagesPerConversation = calculateMessagesPerConversation();

    // Update agent when local state changes
    useEffect(() => {
        const messageCount = conversationsPerDay * calculateMessagesPerConversation();
        console.log(`Agent ${props.agentId} updated: ${agentName}, conversationsPerDay: ${conversationsPerDay}, messageCount: ${messageCount}`);
        props.updateAgent(
            props.agentId,
            agentName,
            conversationsPerDay,
            messageCount,
            localScenarioConsumption
        );
    }, [
        props.agentId,
        agentName,
        conversationsPerDay,
        localScenarioConsumption,
        props.copilotSku
    ]);

    const renderMessageCost = (standardCount: number, autonomousCount: number, rate: number, isIncludedWithLicense: boolean) => {
        if (props.copilotSku === CopilotSku.M365Copilot && isIncludedWithLicense) {
            if (autonomousCount > 0) {
                return (
                    <div>
                        <Text><b>Standard:</b> 0 <i>{INCLUDED_WITH_LICENSE}</i></Text>
                        <br />
                        <Text><b>Autonomous:</b> {formatNumber(autonomousCount * rate)}</Text>
                    </div>
                );
            } else {
                return <Text>0 <i>{INCLUDED_WITH_LICENSE}</i></Text>;
            }
        } else {
            return formatNumber((standardCount + autonomousCount) * rate);
        }
    };

    const renderIncreaseDecreaseButtons = (value: number, fieldName: keyof IAgentScenarioConsumption, subField: "standard" | "autonomous") => (
        <div className={horizontalMediumGapFlexStyles.root}>
            <div className={verticalExtraSmallGapFlexStyles.root}>
                <Button
                    aria-label="Increase"
                    icon={<AddIcon />}
                    className={styles.button}
                    size="small"
                    onClick={() => {
                        setLocalScenarioConsumption((prev) => {
                            const updatedConsumption = {
                                ...prev,
                                [fieldName]: {
                                    ...prev[fieldName],
                                    [subField]: value + 1
                                }
                            };
                            return updatedConsumption;
                        });
                    }}
                />
                <Button
                    aria-label="Decrease"
                    icon={<SubtractIcon />}
                    className={styles.button}
                    size="small"
                    onClick={() => {
                        setLocalScenarioConsumption((prev) => {
                            const updatedConsumption = {
                                ...prev,
                                [fieldName]: {
                                    ...prev[fieldName],
                                    [subField]: Math.max(0, value - 1)
                                }
                            };
                            return updatedConsumption;
                        });
                    }}
                />
            </div>
            <Text>{formatNumber(value)}</Text>
        </div>
    );

    // Calculate totals for display
    const calculateTotals = () => {
        const standardTotal = scenarioConfigs.reduce((total, scenario) => {
            return total + localScenarioConsumption[scenario.key].standard;
        }, 0);

        const autonomousTotal = scenarioConfigs.reduce((total, scenario) => {
            return total + localScenarioConsumption[scenario.key].autonomous;
        }, 0);

        return {
            standardTotal,
            autonomousTotal,
            overallTotal: standardTotal + autonomousTotal
        };
    };

    const { standardTotal, autonomousTotal, overallTotal } = calculateTotals();

    const renderScenarioRows = () => {
        return scenarioConfigs.map(scenario => {
            const scenarioValue = localScenarioConsumption[scenario.key];

            return (
                <TableRow key={scenario.key}>
                    <TableCell>{scenario.name}</TableCell>
                    <TableCell>
                        {renderIncreaseDecreaseButtons(
                            scenarioValue.standard,
                            scenario.key,
                            "standard"
                        )}
                    </TableCell>
                    <TableCell>
                        {scenario.supportsAutonomous ? renderIncreaseDecreaseButtons(
                            scenarioValue.autonomous,
                            scenario.key,
                            "autonomous"
                        ) : <Text>-</Text>}
                    </TableCell>
                    <TableCell>{scenarioValue.standard + scenarioValue.autonomous}</TableCell>
                    <TableCell>{scenario.billingRate}</TableCell>
                    <TableCell>
                        {renderMessageCost(
                            scenarioValue.standard,
                            scenarioValue.autonomous,
                            scenario.billingRate,
                            scenario.isIncludedWithLicense
                        )}
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <Container
            header={agentName}
            width={800}
            nested
        >
            <CustomField
                label="Estimated total daily conversations"
                hint="The average number of daily conversations across all users with this agent."
            >
                <Input
                    type="tel"
                    value={conversationsPerDay.toString()}
                    onChange={(_, data) => {
                        setConversationsPerDay(data.value ? parseInt(data.value, 10) : 0);
                        if (isNaN(conversationsPerDay)) {
                            setConversationsPerDay(0);
                        }
                    }}
                    placeholder="Enter number of conversations"
                    contentAfter={"conversations"}
                />
            </CustomField>
            <ResultsContainer
                results={[
                    {
                        description: "Estimated message consumption per day",
                        value: `${formatNumber(conversationsPerDay * messagesPerConversation)} messages`
                    }
                ]}
            />
            <div>
                <Switch
                    label="View agent breakdown"
                    checked={calculationVisible}
                    onChange={() => setCalculationVisible((v) => !v)}
                />
            </div>
            <Collapse visible={calculationVisible}>
                <div className={verticalMediumGapFlexStyles.root}>
                    <Subtitle1>Agent</Subtitle1>
                    <Input
                        value={agentName}
                        onChange={(_, data) => {
                            setAgentName(data.value);
                        }}
                        placeholder="Enter agent name"
                        size="large"
                    />
                    <Subtitle1>Calculation</Subtitle1>
                    <Text>Message consumption is calculated based on the following scenarios:</Text>
                    <Divider />
                    <Table
                        aria-label="Message consumption table"
                        size="small"
                    >
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>Scenario</TableHeaderCell>
                                <TableHeaderCell>Standard</TableHeaderCell>
                                <TableHeaderCell>Autonomous</TableHeaderCell>
                                <TableHeaderCell>Total</TableHeaderCell>
                                <TableHeaderCell>Message Rate</TableHeaderCell>
                                <TableHeaderCell>Message Cost</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {renderScenarioRows()}
                            <TableRow appearance="neutral">
                                <TableCell><Text weight="bold">Total</Text></TableCell>
                                <TableCell><Text weight="bold">{formatNumber(standardTotal)}</Text></TableCell>
                                <TableCell><Text weight="bold">{formatNumber(autonomousTotal)}</Text></TableCell>
                                <TableCell><Text weight="bold">{formatNumber(overallTotal)}</Text></TableCell>
                                <TableCell><Text weight="bold">-</Text></TableCell>
                                <TableCell><Text weight="bold">{formatNumber(messagesPerConversation)}</Text></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <ResultsContainer
                        results={[
                            {
                                description: "Estimated message consumption per conversation",
                                value: `${formatNumber(messagesPerConversation)} messages`
                            },
                            {
                                description: "Total conversations per day",
                                calculations: props.users > 1 ? [
                                    `${formatNumber(conversationsPerDay)} total conversations across ${formatNumber(props.users)} users`
                                ] : undefined,
                                value: `${formatNumber(conversationsPerDay)} conversations`
                            },
                            {
                                description: "Total messages per day",
                                calculations: [
                                    `${formatNumber(conversationsPerDay)} (conversations) × ${formatNumber(messagesPerConversation)} (messages per conversation)`
                                ],
                                value: `${formatNumber(conversationsPerDay * messagesPerConversation)} messages`
                            }
                        ]}
                        total={{
                            description: "Total messages per month",
                            calculations: [
                                `${formatNumber(conversationsPerDay * messagesPerConversation)} (messages per day) × ${formatNumber(props.workDays)} (workdays)`
                            ],
                            value: `${formatNumber(conversationsPerDay * messagesPerConversation * props.workDays)} messages`
                        }}
                    />
                </div>
            </Collapse>
        </Container>
    );
};
