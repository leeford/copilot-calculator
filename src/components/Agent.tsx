import React, { useState, useEffect } from "react";
import { Collapse } from "@fluentui/react-motion-components-preview";
import { Container } from "./Container";
import { Switch, Text, Divider, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Input, Subtitle1, Button, makeStyles, Caption1, tokens, Link } from "@fluentui/react-components";
import { CustomField } from "./CustomField";
import { IAgentScenarioConsumption } from "../types/IAgentScenarioConsumption";
import { sharedHorizontalMediumGapFlexStyles, sharedVerticalExtraSmallGapFlexStyles, sharedVerticalMediumGapFlexStyles } from "../styles/Styles";
import { CopilotSku } from "../types/CopilotSku";
import { formatNumber } from "../utils/formatUtils";
import { Add12Filled, Add12Regular, bundleIcon, Subtract12Filled, Subtract12Regular } from "@fluentui/react-icons";
import { ResultsContainer } from "./ResultsContainer";
import { calculateCreditsPerConversation, scenarioConfigs } from "../config/scenarios";

const scenarioFootnotes: { keys: (keyof IAgentScenarioConsumption)[]; note: string; link?: { text: string; url: string } }[] = [
    {
        keys: ["aiToolsBasic", "aiToolsStandard", "aiToolsPremium"],
        note: "Actual cost is token-based (~1,000 tokens assumed per response). It is possible to be significantly over- or under-estimating credit consumption.",
        link: { text: "Learn about AI tools billing", url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management#copilot-credits-billing-rates" },
    },
    {
        keys: ["reasoningModel"],
        note: "An additional surcharge applied on top of the feature rate (e.g. generative answer) when a reasoning model is used — total cost = feature rate + this surcharge. Billed at 100 credits per 10 responses (10 credits/1K tokens); actual token usage for reasoning models is typically far higher than standard models.",
        link: { text: "Learn about reasoning model billing", url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management#reasoning-model-billing-rates" },
    },
];

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
        billedCreditsPerDay: number,
        scenarioConsumption?: IAgentScenarioConsumption
    ) => void;
    scenarioConsumption: IAgentScenarioConsumption;
    copilotSku: CopilotSku;
    users: number;
    workDays: number;
}


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

    // Calculate credits per conversation
    const calculateMessagesPerConversation = () => calculateCreditsPerConversation(localScenarioConsumption, props.copilotSku);

    const messagesPerConversation = calculateMessagesPerConversation();

    // Update agent when local state changes
    useEffect(() => {
        const messageCount = conversationsPerDay * calculateMessagesPerConversation();
        console.log(`Agent ${props.agentId} updated: ${agentName}, conversationsPerDay: ${conversationsPerDay}, creditCount: ${messageCount}`);
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

    const renderMessageCost = (standardCount: number, autonomousCount: number, rate: number, _isIncludedWithLicense: boolean) => {
        // If M365 Copilot is licensed, ALL standard counts are included (free). Only autonomous billed.
        if (props.copilotSku === CopilotSku.M365Copilot) {
            if (autonomousCount > 0) {
                return (
                    <div>
                        <Text><b>Standard:</b> 0</Text>
                        <br />
                        <Text><b>Autonomous:</b> {formatNumber(autonomousCount * rate)}</Text>
                    </div>
                );
            } else {
                return <Text>0</Text>;
            }
        }

        // Not licensed (Copilot Chat): both standard and autonomous billed
        return formatNumber((standardCount + autonomousCount) * rate);
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
        const m365Offset = props.copilotSku === CopilotSku.M365Copilot ? 1 : 0;
        return scenarioConfigs.map(scenario => {
            const scenarioValue = localScenarioConsumption[scenario.key];
            const footnoteIndex = scenarioFootnotes.findIndex(f => f.keys.includes(scenario.key));

            return (
                <TableRow key={scenario.key}>
                    <TableCell>
                        <div>
                            <Text>{scenario.name}{footnoteIndex >= 0 && <sup> {footnoteIndex + 1 + m365Offset}</sup>}</Text>
                            {scenario.creditRateLabel && (
                                <Caption1 style={{ display: "block", color: tokens.colorNeutralForeground3 }}>
                                    {scenario.creditRateLabel}
                                </Caption1>
                            )}
                        </div>
                    </TableCell>
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
            width={900}
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
                        description: "Estimated Copilot credit consumption per day",
                        value: `${formatNumber(conversationsPerDay * messagesPerConversation)} credits`
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
                    <Text>Credit consumption is calculated based on the following scenarios:</Text>
                    <Divider />
                    <Table
                        aria-label="Credit consumption table"
                        size="small"
                    >
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>Scenario</TableHeaderCell>
                                <TableHeaderCell>Standard{props.copilotSku === CopilotSku.M365Copilot && <sup> 1</sup>}</TableHeaderCell>
                                <TableHeaderCell>Autonomous</TableHeaderCell>
                                <TableHeaderCell>Total</TableHeaderCell>
                                <TableHeaderCell>Credit Rate</TableHeaderCell>
                                <TableHeaderCell>Credits</TableHeaderCell>
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
                    {props.copilotSku === CopilotSku.M365Copilot && (
                        <Caption1 style={{ display: "block", color: tokens.colorNeutralForeground3, marginBottom: tokens.spacingVerticalXS }}>
                            <sup>1</sup> With an M365 Copilot license, all standard usage is included at no additional cost. Only autonomous usage is billed.
                        </Caption1>
                    )}
                    <div>
                        {scenarioFootnotes.map((footnote, index) => (
                            <Caption1 key={index} style={{ display: "block", color: tokens.colorNeutralForeground3, marginBottom: tokens.spacingVerticalXS }}>
                                {footnote.link && (
                                    <Link href={footnote.link.url} target="_blank" rel="noopener noreferrer" inline>
                                        {footnote.link.text}
                                    </Link>
                                )}
                            </Caption1>
                        ))}
                    </div>
                    <ResultsContainer
                        results={[
                            {
                                description: "Estimated Copilot credit consumption per conversation",
                                value: `${formatNumber(messagesPerConversation)} credits`
                            },
                            {
                                description: "Total conversations per day",
                                calculations: props.users > 1 ? [
                                    `${formatNumber(conversationsPerDay)} total conversations across ${formatNumber(props.users)} users`
                                ] : undefined,
                                value: `${formatNumber(conversationsPerDay)} conversations`
                            },
                            {
                                description: "Total credits per day",
                                calculations: [
                                    `${formatNumber(conversationsPerDay)} (conversations) × ${formatNumber(messagesPerConversation)} (credits per conversation)`
                                ],
                                value: `${formatNumber(conversationsPerDay * messagesPerConversation)} credits`
                            }
                        ]}
                        total={{
                            description: "Total credits per month",
                            calculations: [
                                `${formatNumber(conversationsPerDay * messagesPerConversation)} (credits per day) × ${formatNumber(props.workDays)} (workdays)`
                            ],
                            value: `${formatNumber(conversationsPerDay * messagesPerConversation * props.workDays)} credits`
                        }}
                    />
                </div>
            </Collapse>
        </Container>
    );
};
