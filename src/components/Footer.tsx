import React from "react";
import { Link, makeStyles, Text, tokens } from "@fluentui/react-components";

const footerStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
        backgroundColor: tokens.colorNeutralBackground3,
    },
});

export const Footer: React.FC = () => {
    const styles = footerStyles();

    return (
        <div className={styles.root}>
            <Text wrap><b>Copilot Calculator</b> - Made with ❤️ by <Link href="https://bsky.app/profile/lee-ford.co.uk" target="_top">Lee Ford</Link></Text>
        </div>
    );
};