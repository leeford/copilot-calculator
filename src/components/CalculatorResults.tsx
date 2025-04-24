import React, { useState } from "react";
import { MessageBar, Text, Divider, Switch, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Subtitle1, tokens, makeStyles } from "@fluentui/react-components";
import { Container } from "./Container";
import { ICalculatorValues } from "../types/ICalculatorValues";
import { CopilotSku } from "../types/CopilotSku";
import { sharedFilledPillStyles, sharedVerticalMediumGapFlexStyles, sharedVerticalSmallGapFlexStyles } from "../styles/Styles";
import { Collapse } from "@fluentui/react-motion-components-preview";
import { formatNumber } from "../utils/formatUtils";
import { ResultsContainer } from "./ResultsContainer";

interface ICalculatorResultsProps {
    values: ICalculatorValues;
}

const calculatorResultsStyles = makeStyles({
    percentBar: {
        position: "relative",
        height: "16px",
        width: "100%",
        backgroundColor: tokens.colorNeutralBackground4,
        borderRadius: tokens.borderRadiusMedium,
        "& > div": {
            position: "absolute",
            height: "100%",
            backgroundColor: tokens.colorBrandForeground1,
            borderRadius: tokens.borderRadiusMedium,
        }
    },
    percentText: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        color: tokens.colorNeutralForeground1,
    }
});

export const CalculatorResults: React.FC<ICalculatorResultsProps> = (props) => {

    const styles = calculatorResultsStyles();
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
        // Combine total daily messages from all agents
        const totalDailyMessages = props.values.agents.reduce(
            (total, agent) => total + agent.billedMessagesPerDay,
            0
        );

        // Calculate monthly cost based on workdays
        const agentCost = totalDailyMessages * props.values.workDays * props.values.messageCost;
        return { agentCost, totalDailyMessages };
    };

    const calculateBreakEvenTime = () => {
        if (props.values.users === 0) return 0;

        // Calculate cost per user per day
        const monthlyCostPerUser = (licenseCost + agentCost) / props.values.users;
        const dailyCostPerUser = monthlyCostPerUser / props.values.workDays;

        // Calculate hourly rate from annual salary
        const hourlyRate = (props.values.averageSalary / 12) / (props.values.workDays * props.values.workHours);
        const breakEvenMinutesPerDay = (dailyCostPerUser / hourlyRate) * 60;

        return breakEvenMinutesPerDay;
    };

    // Calculate license and agent costs first...
    const licenseCost = calculateLicenseCost();
    const { agentCost, totalDailyMessages } = calculateAgentCost();

    // ...then calculate total cost
    const totalCost = licenseCost + agentCost;

    // Calculate per-agent costs
    const calculatePerAgentCosts = () => {
        return props.values.agents.map(agent => {
            const dailyMessages = agent.billedMessagesPerDay;
            const monthlyMessages = dailyMessages * props.values.workDays;
            const monthlyCost = monthlyMessages * props.values.messageCost;
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
    const breakEvenMinutesPerDay = calculateBreakEvenTime();

    const renderPercentageBar = (percent: number) => {
        const barWidth = Math.max(percent, 2);

        // Determine text color based on the fill percentage
        const textColor = barWidth > 50 ? tokens.colorNeutralForegroundStaticInverted : tokens.colorNeutralForeground1;

        return (
            <div className={styles.percentBar}>
                <div
                    style={{
                        width: `${barWidth}%`
                    }}
                />
                <Text
                    className={styles.percentText}
                    style={{
                        color: textColor
                    }}
                >
                    {percent.toFixed(1)}%
                </Text>
            </div>
        );
    };

    return (
        <Container
            icon={<p className={filledPillStyles.root}>RESULT</p>}
            header="The bottom line"
            description="Based on the information you provided, here are the estimated costs and break-even points for your M365 Copilot deployment."
            width={800}
        >
            <ResultsContainer
                results={[
                    {
                        description: "Estimated monthly licensing costs",
                        value: `$${formatNumber(licenseCost)}`,
                    },
                    {
                        description: "Estimated monthly agent costs",
                        value: `$${formatNumber(agentCost)}`,
                    },
                    {
                        description: "Break-even point",
                        value: `${breakEvenMinutesPerDay.toFixed(1)} minutes saved per user, per day (${((breakEvenMinutesPerDay / (props.values.workHours * 60)) * 100).toFixed(1)}% of workday)`,
                    },
                ]}
                total={{
                    description: "Total estimated monthly cost",
                    value: `$${formatNumber(totalCost)}`,
                }}
            />
            <div className={verticalMediumGapFlexStyles.root}>
                <div>
                    <Switch
                        label="View breakdown"
                        checked={calculationVisible}
                        onChange={() => setCalculationVisible((v) => !v)}
                    />
                </div>
                <Collapse visible={calculationVisible}>
                    <div className={verticalMediumGapFlexStyles.root}>
                        <div className={verticalSmallGapFlexStyles.root}>
                            <Subtitle1>Totals</Subtitle1>
                            <Text>The totals are calculated in the following way:</Text>
                            <ResultsContainer
                                results={[
                                    {
                                        description: "Estimated monthly licensing costs",
                                        calculations: [`${props.values.users.toLocaleString()} (users) × $${formatNumber(props.values.licenseCost)} (per license)`],
                                        value: `$${formatNumber(licenseCost)}`,
                                    },
                                    {
                                        description: "Estimated monthly agent costs",
                                        calculations: [`${totalDailyMessages} (messages) × $${formatNumber(props.values.messageCost)} (per message) × ${props.values.workDays} (workdays)`],
                                        value: `$${formatNumber(agentCost)}`,
                                    },
                                    {
                                        description: "Break-even point",
                                        calculations: [
                                            `Daily cost (per user): $${formatNumber((totalCost / props.values.users) / props.values.workDays)}`,
                                            `Hourly rate (per user): $${formatNumber((props.values.averageSalary / 12) / (props.values.workDays * props.values.workHours))}`,
                                            `($${formatNumber((totalCost / props.values.users) / props.values.workDays)} ÷ $${formatNumber((props.values.averageSalary / 12) / (props.values.workDays * props.values.workHours))} × 60 minutes)`,
                                        ],
                                        value: `${breakEvenMinutesPerDay.toFixed(1)} minutes saved per user, per day (${((breakEvenMinutesPerDay / (props.values.workHours * 60)) * 100).toFixed(1)}% of workday)`,
                                    }
                                ]}
                                total={{
                                    description: "Total estimated monthly cost",
                                    calculations: [`$${formatNumber(licenseCost)} (licenses) + $${formatNumber(agentCost)} (agents)`],
                                    value: `$${formatNumber(totalCost)}`,
                                }}
                            />
                        </div>
                        <Divider />
                        <div className={verticalSmallGapFlexStyles.root}>
                            <Subtitle1>Assumptions</Subtitle1>
                            <Text>This calculation is based on the following assumptions:</Text>
                            <ul>
                                <li>
                                    <Text>{props.values.users.toLocaleString()} users working {props.values.workHours} hours per day, {props.values.workDays} days per month, at an average salary of ${formatNumber(props.values.averageSalary)}</Text>
                                </li>
                                <li>
                                    <Text>Copilot license costs: ${formatNumber(props.values.licenseCost)} per user, per month</Text>
                                </li>
                                <li>
                                    <Text>Agent costs: ${formatNumber(props.values.messageCost)} per message</Text>
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
                                                <TableCell>{formatNumber(agentCost.monthlyMessages)} messages</TableCell>
                                                <TableCell>${formatNumber(agentCost.monthlyCost)}</TableCell>
                                                <TableCell>
                                                    {renderPercentageBar(agentCost.percentOfTotal)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    <TableRow appearance="neutral">
                                        <TableCell><Text weight="semibold">Total</Text></TableCell>
                                        <TableCell><Text weight="semibold">{formatNumber(totalDailyMessages * props.values.workDays)}</Text></TableCell>
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