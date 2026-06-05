import React from "react";
import Markdown from "react-markdown";
import { makeStyles, tokens } from "@fluentui/react-components";
import { Container } from "./Container";
import changelogContent from "../../CHANGELOG.md?raw";

const useMarkdownStyles = makeStyles({
    root: {
        "& h2": {
            fontSize: tokens.fontSizeBase500,
            fontWeight: tokens.fontWeightSemibold,
            marginTop: tokens.spacingVerticalL,
            marginBottom: tokens.spacingVerticalS,
        },
        "& ul": {
            paddingLeft: tokens.spacingHorizontalXL,
        },
        "& li": {
            fontSize: tokens.fontSizeBase300,
            marginBottom: tokens.spacingVerticalXS,
        },
    }
});

export const Changelog: React.FC = () => {

    const markdownStyles = useMarkdownStyles();

    return (
        <Container
            header="Changelog"
            description="A history of updates to Copilot Calculator"
            width={900}
        >
            <div className={markdownStyles.root}>
                <Markdown>{changelogContent}</Markdown>
            </div>
        </Container>
    );
};
