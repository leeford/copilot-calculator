import React, { useMemo, useState, useEffect } from "react";
import { Divider, FluentProvider, makeStyles, Theme, tokens, webDarkTheme, webLightTheme, Text, Subtitle1, Tab, TabList, TabValue, SelectTabData, SelectTabEvent, Switch } from "@fluentui/react-components";
import { AppContext } from "./contexts/AppContext";
import { Calculator } from "./components/Calculator";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { About } from "./components/About";
import { bundleIcon, Calculator20Filled, Calculator20Regular, DarkTheme20Filled, DarkTheme20Regular, QuestionCircle20Filled, QuestionCircle20Regular } from "@fluentui/react-icons";

const AboutIcon = bundleIcon(QuestionCircle20Filled, QuestionCircle20Regular);
const CalculatorIcon = bundleIcon(Calculator20Filled, Calculator20Regular);
const DarkModeIcon = bundleIcon(DarkTheme20Filled, DarkTheme20Regular);

const appStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
    },
    tabs: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: "100%",
        position: "relative"
    },
    content: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
        paddingBottom: "calc(60px + 1rem)",
    }
});

const ErrorPage: React.FC<{ message?: string }> = ({ message }) => (
    <div>
        <Subtitle1>Oops! Something went wrong.</Subtitle1>
        <br />
        <Text>{message ?? "We are unable to load this page at this time. Please try again later."}</Text>
    </div>
);

const App: React.FC = () => {

    const styles = appStyles();
    const localStorageTheme = localStorage.getItem("theme");
    const [theme, setTheme] = useState<Theme>(localStorageTheme === "dark" ? webDarkTheme : webLightTheme);
    const contextValue = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

    // Sync body background color with theme
    useEffect(() => {
        document.body.style.backgroundColor = theme.colorNeutralBackground1;
        document.body.style.color = theme.colorNeutralForeground1;
    }, [theme]);


    const [selectedValue, setSelectedValue] = useState<TabValue>("calculator");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    const changeTheme = () => {
        setTheme(theme === webLightTheme ? webDarkTheme : webLightTheme);
        localStorage.setItem("theme", theme === webLightTheme ? "dark" : "light");
    };

    return (
        <AppContext.Provider value={contextValue}>
            <FluentProvider theme={theme}>
                <div className={styles.root}>
                    <Header />
                    <div className={styles.tabs}>
                        <TabList
                            selectedValue={selectedValue}
                            onTabSelect={onTabSelect}
                        >
                            <Tab id="calculator" icon={<CalculatorIcon />} value="calculator">
                                Calculator
                            </Tab>
                            <Tab id="about" icon={<AboutIcon />} value="about">
                                About
                            </Tab>
                        </TabList>
                        <Switch
                            label={<DarkModeIcon aria-label="Dark mode" />}
                            aria-label="Dark mode"
                            checked={theme === webDarkTheme}
                            onChange={changeTheme}
                        />
                    </div>
                    <div className={styles.content}>
                        {(() => {
                            let content;
                            if (selectedValue === "calculator") {
                                content = <Calculator />;
                            } else if (selectedValue === "about") {
                                content = <About />;
                            } else {
                                content = <ErrorPage message="Invalid tab selected." />;
                            }
                            return content;
                        })()}
                    </div>
                    <div>
                        <Divider />
                        <Footer />
                    </div>
                </div>
            </FluentProvider>
        </AppContext.Provider>
    );
};

export default App;