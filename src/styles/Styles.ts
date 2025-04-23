import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

// Fluent UI 9 styles
export const sharedButtonStyles = makeStyles({
    root: {
        minWidth: "100px",
        margin: (tokens.spacingVerticalS, tokens.spacingHorizontalS)
    },
});

const flexWithGapStyles = (horizontalSpacing: string, verticalSpacing: string) => {
    return {
        ...shorthands.gap(horizontalSpacing, verticalSpacing)
    };
};

// Horizontal Flex Styles
const sharedFlexRowStyles = (): unknown => {
    return {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    };
};

export const sharedHorizontalNoGapFlexStyles = makeStyles({
    root: {
        ...(sharedFlexRowStyles() || {})
    }
});

export const sharedHorizontalExtraSmallGapFlexStyles = makeStyles({
    root: {
        ...(sharedFlexRowStyles() || {}),
        ...flexWithGapStyles(tokens.spacingHorizontalXS, tokens.spacingVerticalXS)
    }
});

export const sharedHorizontalSmallGapFlexStyles = makeStyles({
    root: {
        ...(sharedFlexRowStyles() || {}),
        ...flexWithGapStyles(tokens.spacingHorizontalS, tokens.spacingVerticalS)
    }
});

export const sharedHorizontalMediumGapFlexStyles = makeStyles({
    root: {
        ...(sharedFlexRowStyles() || {}),
        ...flexWithGapStyles(tokens.spacingHorizontalM, tokens.spacingVerticalM)
    },
});

export const sharedHorizontalLargeGapFlexStyles = makeStyles({
    root: {
        ...(sharedFlexRowStyles() || {}),
        ...flexWithGapStyles(tokens.spacingHorizontalL, tokens.spacingVerticalL)
    }
});

export const sharedHorizontalExtraLargeGapFlexStyles = makeStyles({
    root: {
        ...(sharedFlexRowStyles() || {}),
        ...flexWithGapStyles(tokens.spacingHorizontalXL, tokens.spacingVerticalXL)
    }
});

export const sharedHorizontalMediumGapWrapFlexStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        ...flexWithGapStyles(tokens.spacingHorizontalM, tokens.spacingVerticalM),
    },
});

// Vertical Flex Styles
const sharedFlexColumnStyles = (): unknown => {
    return {
        display: "flex",
        flexDirection: "column"
    };
};

export const sharedVerticalNoGapFlexStyles = makeStyles({
    root: {
        ...sharedFlexColumnStyles
    }
});

export const sharedVerticalExtraSmallGapFlexStyles = makeStyles({
    root: {
        ...(sharedFlexColumnStyles() || {}),
        ...flexWithGapStyles(tokens.spacingHorizontalXS, tokens.spacingVerticalXS)
    }
});

export const sharedVerticalSmallGapFlexStyles = makeStyles({
    root: {
        ...(sharedFlexColumnStyles() || {}),
        ...flexWithGapStyles(tokens.spacingHorizontalS, tokens.spacingVerticalS)
    }
});

export const sharedVerticalMediumGapFlexStyles = makeStyles({
    root: {
        ...(sharedFlexColumnStyles() || {}),
        ...flexWithGapStyles(tokens.spacingHorizontalM, tokens.spacingVerticalM)
    },
});

export const sharedVerticalLargeGapFlexStyles = makeStyles({
    root: {
        ...(sharedFlexColumnStyles() || {}),
        ...flexWithGapStyles(tokens.spacingHorizontalL, tokens.spacingVerticalL)
    }
});

export const sharedVerticalExtraLargeGapFlexStyles = makeStyles({
    root: {
        ...(sharedFlexColumnStyles() || {}),
        ...flexWithGapStyles(tokens.spacingHorizontalXL, tokens.spacingVerticalXL)
    }
});

export const sharedVerticalMediumGapWrapFlexStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        ...flexWithGapStyles(tokens.spacingHorizontalM, tokens.spacingVerticalM),
    }
});

export const sharedFieldStyles = makeStyles({
    root: {
        marginBottom: tokens.spacingVerticalS
    }
});

export const sharedCompoundButtonStyles = makeStyles({
    root: {
        width: "320px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        margin: (tokens.spacingVerticalXS, tokens.spacingHorizontalXS)
    }
});

export const sharedTitleStyles = makeStyles({
    root: {
        WebkitBackgroundClip: "text",
        backgroundImage: "linear-gradient(to right, rgb(218, 139, 224), rgb(161, 207, 237))",
        backgroundClip: "text",
        color: "transparent",
        position: "relative"
    }
});

export const sharedFilledPillStyles = makeStyles({
    root: {
        borderRadius: tokens.borderRadiusMedium,
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
        padding: tokens.spacingHorizontalS,
        display: "inline-block",
        fontSize: tokens.fontSizeBase300,
        fontWeight: tokens.fontWeightSemibold,
        lineHeight: tokens.lineHeightBase300
    }
});