import React, { useState } from "react";
import { MessageBar, Text, Divider, Switch, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Subtitle1, ProgressBar, Caption1 } from "@fluentui/react-components";
import { Container } from "./Container";
import { ICalculatorValues } from "../types/ICalculatorValues";
import { CopilotSku } from "../types/CopilotSku";
import { sharedFilledPillStyles, sharedVerticalMediumGapFlexStyles, sharedVerticalSmallGapFlexStyles } from "../styles/Styles";
import { Collapse } from "@fluentui/react-motion-components-preview";
import { formatNumber } from "../utils/formatUtils";
import { ResultsContainer } from "./ResultsContainer";
import { calculateCreditsPerConversation } from "../config/scenarios";

interface ICalculatorResultsProps {
    values: ICalculatorValues;
}

export const CalculatorResults: React.FC<ICalculatorResultsProps> = (props) => {

    const filledPillStyles = sharedFilledPillStyles();
    const verticalMediumGapFlexStyles = sharedVerticalMediumGapFlexStyles();
    const verticalSmallGapFlexStyles = sharedVerticalSmallGapFlexStyles();

    const [calculationVisible, setCalculationVisible] = useState<boolean>(false);

    const calculateLicenseCost = () => {
        // If Copilot chat, the cost is 0 as its free
        if (props.values.copilotSku === CopilotSku.M365CopilotChat) {
            return 0;
        }
        const totalCost = props.values.users * props.values.licenseCost;
        return totalCost;
    };

    const calculateAgentCost = () => {
        // Combine total daily Copilot credits from all agents
        const totalDailyMessages = props.values.agents.reduce(
            (total, agent) => total + agent.billedCreditsPerDay,
            0
        );

        // Calculate monthly cost based on workdays
        const agentCost = totalDailyMessages * props.values.workDays * props.values.creditCost;
        return { agentCost, totalDailyMessages };
    };


    // Calculate license and agent costs first...
    const licenseCost = calculateLicenseCost();
    const { agentCost, totalDailyMessages } = calculateAgentCost();

    // ...then calculate total cost
    const totalCost = licenseCost + agentCost;

    // Compute alternate SKU comparison totals
    const alternateSku = props.values.copilotSku === CopilotSku.M365Copilot
        ? CopilotSku.M365CopilotChat
        : CopilotSku.M365Copilot;

    const calculateAlternateCosts = () => {
        // License cost under alternate SKU
        const altLicenseCost = alternateSku === CopilotSku.M365CopilotChat ? 0 : props.values.users * props.values.licenseCost;

        // Agent costs under alternate SKU
        const altTotalDailyCredits = props.values.agents.reduce((total, agent) => {
            const creditsPerConversation = calculateCreditsPerConversation(agent.scenarioConsumption, alternateSku);
            return total + creditsPerConversation * agent.conversationsPerDay;
        }, 0);

        const altAgentCost = altTotalDailyCredits * props.values.workDays * props.values.creditCost;
        const altTotalCost = altLicenseCost + altAgentCost;

        return { altLicenseCost, altAgentCost, altTotalCost, altTotalDailyCredits };
    };

    const { altLicenseCost, altAgentCost, altTotalCost, altTotalDailyCredits } = calculateAlternateCosts();

    // Calculate per-agent costs
    const calculatePerAgentCosts = () => {
        return props.values.agents.map(agent => {
            const dailyMessages = agent.billedCreditsPerDay;
            const monthlyMessages = dailyMessages * props.values.workDays;
            const monthlyCost = monthlyMessages * props.values.creditCost;
            // Calculate percentage of total cost for each agent
            const percentOfTotal = totalCost > 0 ? (monthlyCost / totalCost) * 100 : 0;

            return {
                id: agent.id,
                name: agent.name,
                dailyMessages,
                monthlyMessages,
                monthlyCost,
                percentOfTotal
            };
        });
    };

    const perAgentCosts = calculatePerAgentCosts();

    const renderPercentageBar = (percent: number) => {
        const value = Math.max(percent, 2) / 100;
        return <ProgressBar value={value} thickness="medium" shape="rounded" />;
    };

    return (
        <Container
            icon={<p className={filledPillStyles.root}>RESULT</p>}
            header="The bottom line"
            description="Based on the information you provided, here are the estimated monthly costs for your M365 Copilot deployment."
            width={900}
        >
            <ResultsContainer
                results={[
                    {
                        description: "Estimated monthly licensing costs",
                        calculations: [`users × $${formatNumber(props.values.licenseCost)} (per license)`],
                        value: `$${formatNumber(licenseCost)}`,
                        valueSubtext: `${props.values.users.toLocaleString()} users`,
                        altValue: `$${formatNumber(altLicenseCost)}`,
                        altValueSubtext: `${props.values.users.toLocaleString()} users`,
                    },
                    {
                        description: "Estimated monthly agent costs",
                        calculations: [`daily credits × $${formatNumber(props.values.creditCost)} (per credit) × ${props.values.workDays} (workdays)`],
                        value: `$${formatNumber(agentCost)}`,
                        valueSubtext: `${formatNumber(totalDailyMessages)} credits/day\n${formatNumber(totalDailyMessages * props.values.workDays)} credits/month`,
                        altValue: `$${formatNumber(altAgentCost)}`,
                        altValueSubtext: `${formatNumber(altTotalDailyCredits)} credits/day\n${formatNumber(altTotalDailyCredits * props.values.workDays)} credits/month`,
                    },
                ]}
                valueLabel={`${props.values.copilotSku}`}
                altValueLabel={`${alternateSku}`}
                total={{
                    description: "Total estimated monthly cost",
                    calculations: [`$${formatNumber(licenseCost)} (licenses) + $${formatNumber(agentCost)} (agents)`],
                    value: `$${formatNumber(totalCost)}`,
                    valueSubtext: `${formatNumber(totalDailyMessages)} credits/day\n${formatNumber(totalDailyMessages * props.values.workDays)} credits/month`,
                }}
                totalAlt={{ value: `$${formatNumber(altTotalCost)}`, label: `${alternateSku}`, valueSubtext: `${formatNumber(altTotalDailyCredits)} credits/day\n${formatNumber(altTotalDailyCredits * props.values.workDays)} credits/month` }}
            />
            <div className={verticalMediumGapFlexStyles.root}>
                <div>
                    <Switch
                        label="More information"
                        checked={calculationVisible}
                        onChange={() => setCalculationVisible((v) => !v)}
                    />
                </div>
                <Collapse visible={calculationVisible}>
                    <div className={verticalMediumGapFlexStyles.root}>

                        <div className={verticalSmallGapFlexStyles.root}>
                            <Subtitle1>Assumptions</Subtitle1>
                            <Text>This calculation is based on the following assumptions:</Text>
                            <ul>
                                <li>
                                    <Text>{props.values.users.toLocaleString()} users working {props.values.workDays} days per month</Text>
                                </li>
                                <li>
                                    <Text>Copilot license costs: ${formatNumber(props.values.licenseCost)} per user, per month</Text>
                                </li>
                                <li>
                                    <Text>Agent costs: ${formatNumber(props.values.creditCost)} per credit</Text>
                                </li>
                            </ul>
                        </div>
                        <Divider />
                        <div className={verticalSmallGapFlexStyles.root}>
                            <Subtitle1>Cost breakdown</Subtitle1>
                            <Text>The cost is broken down in the following way:</Text>
                            <Table aria-label="Cost breakdown table">
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell>Item</TableHeaderCell>
                                        <TableHeaderCell>Monthly Consumption</TableHeaderCell>
                                        <TableHeaderCell>Monthly Cost</TableHeaderCell>
                                        <TableHeaderCell>Split</TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {licenseCost > 0 && (
                                        <TableRow>
                                            <TableCell>M365 Copilot licenses</TableCell>
                                            <TableCell>{props.values.users.toLocaleString()} users</TableCell>
                                            <TableCell>${formatNumber(licenseCost)}</TableCell>
                                            <TableCell>
                                                {renderPercentageBar((licenseCost / totalCost) * 100)}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {perAgentCosts
                                        .filter(agentCost => agentCost.monthlyCost > 0)
                                        .map(agentCost => (
                                            <TableRow key={agentCost.id}>
                                                <TableCell>{agentCost.name}</TableCell>
                                                <TableCell>
                                                    <Text>{formatNumber(agentCost.monthlyMessages)} credits</Text>
                                                    <br />
                                                    <Caption1>{formatNumber(agentCost.dailyMessages)} credits/day</Caption1>
                                                </TableCell>
                                                <TableCell>
                                                    <Text>${formatNumber(agentCost.monthlyCost)}</Text>
                                                    <br />
                                                    <Caption1>{formatNumber(agentCost.monthlyMessages)} credits</Caption1>
                                                </TableCell>
                                                <TableCell>
                                                    {renderPercentageBar(agentCost.percentOfTotal)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    <TableRow appearance="neutral">
                                        <TableCell><Text weight="semibold">Total</Text></TableCell>
                                        <TableCell>
                                            <Text weight="semibold">{formatNumber(totalDailyMessages * props.values.workDays)} credits</Text>
                                            <br />
                                            <Caption1>{formatNumber(totalDailyMessages)} credits/day</Caption1>
                                        </TableCell>
                                        <TableCell><Text weight="semibold">${formatNumber(totalCost)}</Text></TableCell>
                                        <TableCell>{renderPercentageBar(100)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </Collapse>
                <MessageBar>
                    <Text>The above calculations are estimates and may vary based on actual usage and other factors. <b>The information provided is for educational purposes only and should not be used for any financial or legal decisions.</b></Text>
                </MessageBar>
            </div>
        </Container>
    );
};