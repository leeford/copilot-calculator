import React from "react";
import { Image, Text, Title1, makeStyles, tokens } from "@fluentui/react-components";
import { sharedFilledPillStyles, sharedHorizontalSmallGapFlexStyles, sharedVerticalExtraSmallGapFlexStyles } from "../styles/Styles";
import copilotLogo from "../assets/copilot.png";

const headerStyles = makeStyles({
    root: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: tokens.spacingVerticalL,
        padding: tokens.spacingVerticalS,
    }
});

export const Header: React.FC = () => {

    const filledPillStyles = sharedFilledPillStyles();
    const horizontalSmallGapFlexStyles = sharedHorizontalSmallGapFlexStyles();
    const verticalExtraSmallGapFlexStyles = sharedVerticalExtraSmallGapFlexStyles();
    const styles = headerStyles();

    return (
        <div className={styles.root}>
            <div className={horizontalSmallGapFlexStyles.root}>
                <Image
                    src={copilotLogo}
                    alt="Copilot Logo"
                    height={100}
                    width={100}
                />
                <div className={verticalExtraSmallGapFlexStyles.root}>
                    <div className={horizontalSmallGapFlexStyles.root}>
                        <Title1>Copilot Calculator</Title1>
                        <p className={filledPillStyles.root}>BETA</p>
                    </div>
                    <Text>Estimate your Copilot costs based on your usage</Text>
                </div>
            </div>
        </div>
    );
};