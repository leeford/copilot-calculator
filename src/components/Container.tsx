import React from "react";
import { sharedHorizontalMediumGapFlexStyles, sharedTitleStyles, sharedVerticalExtraSmallGapFlexStyles, sharedVerticalLargeGapFlexStyles } from "../styles/Styles";
import { Divider, makeStyles, shorthands, Body1, tokens, Title2 } from "@fluentui/react-components";

interface IContainerProps {
    icon?: React.ReactNode;
    header: string;
    description?: string;
    width?: number | string;
    children?: React.ReactNode;
    nested?: boolean;
}

const ContainerStyles = makeStyles({
    root: {
        minWidth: "240px",
        padding: (tokens.spacingVerticalM, tokens.spacingHorizontalM),
        ...shorthands.borderWidth(tokens.strokeWidthThin),
        ...shorthands.borderStyle("solid"),
        ...shorthands.borderColor(tokens.colorNeutralStroke2),
        borderRadius: tokens.borderRadiusLarge,
        gap: (tokens.spacingVerticalS, tokens.spacingHorizontalS),
    },
    content: {
        padding: (tokens.spacingVerticalS, tokens.spacingHorizontalS),
        gap: (tokens.spacingVerticalS, tokens.spacingHorizontalS),
        display: "flex",
        flexDirection: "column"
    }
});

export const Container: React.FunctionComponent<IContainerProps> = (props) => {

    const titleStyles = sharedTitleStyles();
    const verticalExtraSmallGapFlexStyles = sharedVerticalExtraSmallGapFlexStyles();
    const verticalLargeGapFlexStyles = sharedVerticalLargeGapFlexStyles();
    const horizontalMediumGapFlexStyles = sharedHorizontalMediumGapFlexStyles();

    return (
        <div
            className={ContainerStyles().root}
            style={{
                maxWidth: props.width ?? 400,
                backgroundColor: props.nested ? tokens.colorNeutralBackground1 : tokens.colorNeutralBackground2,
            }}
        >
            <div className={verticalLargeGapFlexStyles.root}>
                <div className={verticalExtraSmallGapFlexStyles.root}>
                    <div className={horizontalMediumGapFlexStyles.root}>
                        {props.icon && <div>{props.icon}</div>}
                        {props.header && <Title2 block className={titleStyles.root}>{props.header}</Title2>}
                    </div>
                    {props.description && <Body1 block>{props.description}</Body1>}
                </div>
                <Divider />
            </div>
            <div className={ContainerStyles().content}>
                {props.children}
            </div>
        </div>
    );
};
