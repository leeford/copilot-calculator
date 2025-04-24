import React from "react";
import { Link, Subtitle1, Text } from "@fluentui/react-components";
import { sharedVerticalMediumGapFlexStyles } from "../styles/Styles";
import { Container } from "./Container";

export const About: React.FC = () => {

    const verticalMediumGapFlexStyles = sharedVerticalMediumGapFlexStyles();

    return (
        <Container
            header="About"
            description="Learn more about Copilot Calculator"
            width={800}
        >
            <div className={verticalMediumGapFlexStyles.root}>
                <Subtitle1>Introducing Copilot Calculator</Subtitle1>
                <Text>Licensing is hard, especially Microsoft products - and M365 Copilot is not different in this regard. The original concept was simple, each user required a single license to use M365 Copilot, but now we have multiple SKUs, agents, an ever growing list of scenario types that consume "messages", and metered billing. So with that - Copilot Calculator was born!</Text>
                <Subtitle1>What is Copilot Calculator?</Subtitle1>
                <Text>Copilot Calculator is a simple web application that helps you estimate the costs of using Microsoft 365 Copilot in your organisation. Spend a few minutes completing the forms and you will get an idea of estimated costs.</Text>
                <Subtitle1>Who made it?</Subtitle1>
                <Text>Copilot Calculator was created by <Link href="https://bsky.app/profile/lee-ford.co.uk" target="_top">Lee Ford</Link>, a Microsoft MVP and developer with plenty of experience in the Microsoft 365 ecosystem.</Text>
                <Subtitle1>Disclaimer</Subtitle1>
                <Text>This is not an official Microsoft product and is not endorsed by Microsoft. The information provided is for educational purposes only and should not be used for any financial or legal decisions. If you are unsure, please consult with your Microsoft professional or partner before making any decisions based on this information.</Text>
                <Text>All information is provided "as is" and without warranty of any kind, either express or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose. In no event shall the author be liable for any damages arising from the use of this information.</Text>
                <Text>Microsoft 365, Copilot, the Copilot logo, and other Microsoft properties are trademarks of Microsoft Corporation. All other trademarks are the property of their respective owners.</Text>
                <Subtitle1>Feedback</Subtitle1>
                <Text>This is an open source project and I welcome any feedback or suggestions. If you have any ideas for new features or improvements, please feel free to reach out to me on <Link href="https://bsky.app/profile/lee-ford.co.uk" target="_top">BlueSky</Link> or raise an issue on the <Link href="https://www.github.com/leeford/copilot-calculator" target="_top">GitHub repository</Link>.</Text>
            </div>
        </Container>
    );
};