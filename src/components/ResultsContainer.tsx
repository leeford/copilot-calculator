import { Caption1, makeStyles, Text, tokens } from "@fluentui/react-components";
import React from "react";
import { sharedTitleStyles } from "../styles/Styles";

interface IResult {
    description: string;
    value: string;
    calculations?: string[];
    altValue?: string;
    valueSubtext?: string;
    altValueSubtext?: string;
}

interface IResultsContainerProps {
    results: IResult[];
    total?: IResult;
    totalAlt?: { value: string; label?: string; valueSubtext?: string };
    valueLabel?: string;
    altValueLabel?: string;
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
    totalValuesContainer: {
        display: "flex",
        alignItems: "baseline",
        gap: tokens.spacingHorizontalM,
        width: "40%",
    },
    totalValueCol: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        flex: "1 1 0",
    },
    textRight: {
        textAlign: "right",
        width: "100%",
    },
    subtext: {
        textAlign: "right",
        width: "100%",
        whiteSpace: "pre-line",
    },
    altValue: {
        color: tokens.colorNeutralForeground3,
    },
    selectedValue: {
        color: tokens.colorBrandForeground1,
    },
    selectedHeader: {
        color: tokens.colorBrandForeground1,
        fontWeight: tokens.fontWeightSemibold,
        textAlign: "right",
        width: "100%",
    },
    altHeader: {
        color: tokens.colorNeutralForeground3,
        fontWeight: tokens.fontWeightRegular,
        textAlign: "right",
        width: "100%",
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
            {(props.valueLabel || props.altValueLabel) && (
                <div className={styles.resultRow}>
                    <div className={styles.resultDescription}>
                        {/* empty left column to align headers with values */}
                    </div>
                    <div className={styles.totalValuesContainer}>
                        <div className={styles.totalValueCol}>
                            {props.valueLabel && <Caption1 className={styles.selectedHeader}>{props.valueLabel}</Caption1>}
                        </div>
                        {props.altValueLabel && (
                            <div className={styles.totalValueCol}>
                                <Caption1 className={styles.altHeader}>{props.altValueLabel}</Caption1>
                            </div>
                        )}
                    </div>
                </div>
            )}
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
                    {result.altValue ? (
                        <div className={styles.totalValuesContainer}>
                            <div className={styles.totalValueCol}>
                                <Text weight="semibold" wrap className={`${styles.textRight} ${styles.selectedValue}`}>{result.value}</Text>
                                {result.valueSubtext && (
                                    <Caption1 className={styles.subtext}>{result.valueSubtext}</Caption1>
                                )}
                            </div>
                            {result.altValue && (
                                <div className={styles.totalValueCol}>
                                    <Text weight="regular" wrap className={`${styles.textRight} ${styles.altValue}`}>{result.altValue}</Text>
                                    {result.altValueSubtext && (
                                        <Caption1 className={`${styles.subtext} ${styles.altValue}`}>{result.altValueSubtext}</Caption1>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.resultValue}>
                            <Text weight="bold" wrap className={styles.textRight}>{result.value}</Text>
                            {result.valueSubtext && (
                                <Caption1 className={styles.subtext}>{result.valueSubtext}</Caption1>
                            )}
                        </div>
                    )}
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
                    {props.totalAlt ? (
                        <div className={styles.totalValuesContainer}>
                            <div className={styles.totalValueCol}>
                                <Text weight="semibold" wrap className={`${titleStyles.root} ${styles.textRight} ${styles.selectedValue}`}>{props.total.value}</Text>
                                {props.total.valueSubtext && (
                                    <Caption1 className={styles.subtext}>{props.total.valueSubtext}</Caption1>
                                )}
                            </div>
                            {props.totalAlt && (
                                <div className={styles.totalValueCol}>
                                    <Text weight="regular" wrap className={`${titleStyles.root} ${styles.textRight} ${styles.altValue}`}>{props.totalAlt.value}</Text>
                                    {props.totalAlt.valueSubtext && (
                                        <Caption1 className={`${styles.subtext} ${styles.altValue}`}>{props.totalAlt.valueSubtext}</Caption1>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.totalValuesContainer}>
                            <div className={styles.totalValueCol}>
                                <Text weight="bold" wrap className={`${titleStyles.root} ${styles.textRight}`}>{props.total.value}</Text>
                                {props.total.valueSubtext && (
                                    <Caption1 className={styles.subtext}>{props.total.valueSubtext}</Caption1>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};