import { Caption1, makeStyles, Text, tokens } from "@fluentui/react-components";
import React from "react";
import { sharedTitleStyles } from "../styles/Styles";

interface IResult {
    description: string;
    value: string;
    calculations?: string[];
}

interface IResultsContainerProps {
    results: IResult[];
    total?: IResult;
}

const resultsContainerStyles = makeStyles({
    root: {
        backgroundColor: tokens.colorNeutralBackground4,
        padding: tokens.spacingVerticalL,
        borderRadius: tokens.borderRadiusMedium,
        marginBottom: tokens.spacingVerticalM,
    },
    resultRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: tokens.spacingVerticalS,
        "&:not(:last-child)": {
            borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        }
    },
    resultDescription: {
        flexShrink: 0,
        paddingRight: tokens.spacingHorizontalL,
        width: "50%",
        overflow: "hidden"
    },
    resultValue: {
        flexShrink: 0,
        width: "40%",
        textAlign: "right"
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: tokens.spacingVerticalM,
        backgroundColor: tokens.colorNeutralBackgroundInverted,
        color: tokens.colorNeutralForegroundInverted,
        borderRadius: tokens.borderRadiusMedium,
        marginTop: tokens.spacingVerticalM,
    },
    calculationsColumn: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalXS,
        flexGrow: 1,
        paddingRight: tokens.spacingHorizontalL,
    }
});

export const ResultsContainer: React.FC<IResultsContainerProps> = (props) => {
    const styles = resultsContainerStyles();
    const titleStyles = sharedTitleStyles();

    return (
        <div className={styles.root}>
            {props.results.map((result) => (
                <div key={result.description} className={styles.resultRow}>
                    <div className={styles.resultDescription}>
                        <Text weight="semibold">{result.description}</Text>
                        <div className={styles.calculationsColumn}>
                            {result.calculations?.map((calculation) => (
                                <Caption1 key={calculation}>{calculation}</Caption1>
                            ))}
                        </div>
                    </div>
                    <Text weight="bold" wrap className={styles.resultValue}>{result.value}</Text>
                </div>
            ))}
            {props.total && (
                <div className={styles.totalRow}>
                    <div className={styles.resultDescription}>
                        <Text weight="semibold">{props.total.description}</Text>
                        <div className={styles.calculationsColumn}>
                            {props.total.calculations?.map((calculation) => (
                                <Caption1 key={calculation}>{calculation}</Caption1>
                            ))}
                        </div>
                    </div>
                    <Text weight="bold" wrap className={titleStyles.root}>{props.total.value}</Text>
                </div>
            )}
        </div>
    );
};