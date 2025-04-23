import { makeStyles, Text, tokens } from "@fluentui/react-components";
import React from "react";

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
        width: "33%",
        overflow: "hidden"
    },
    resultCalculation: {
        flexShrink: 0,
        paddingRight: tokens.spacingHorizontalL,
        width: "33%",
        overflow: "hidden",
    },
    resultValue: {
        flexShrink: 0,
        width: "33%",
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
    },
    calculationItem: {
        fontSize: tokens.fontSizeBase200,
        display: "block",
    }
});

export const ResultsContainer: React.FC<IResultsContainerProps> = (props) => {
    const styles = resultsContainerStyles();

    return (
        <div className={styles.root}>
            {props.results.map((result) => (
                <div key={result.description} className={styles.resultRow}>
                    <Text weight="semibold" className={styles.resultDescription}>{result.description}</Text>
                    <div className={styles.calculationsColumn}>
                        {result.calculations?.map((calculation) => (
                            <Text key={calculation} className={styles.calculationItem}>{calculation}</Text>
                        ))}
                    </div>
                    <Text weight="bold" wrap className={styles.resultValue}>{result.value}</Text>
                </div>
            ))}
            {props.total && (
                <div className={styles.totalRow}>
                    <Text weight="semibold" className={styles.resultDescription} size={400}>{props.total.description}</Text>
                    <div className={styles.calculationsColumn}>
                        {props.total.calculations?.map((calculation) => (
                            <Text key={calculation} className={styles.calculationItem}>{calculation}</Text>
                        ))}
                    </div>
                    <Text weight="bold" className={styles.resultValue} size={400}>{props.total.value}</Text>
                </div>
            )}
        </div>
    );
};