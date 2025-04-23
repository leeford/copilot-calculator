import React from "react";
import { Field } from "@fluentui/react-components";
import { sharedFieldStyles } from "../styles/Styles";

interface ICustomFieldProps {
    label: string;
    required?: boolean;
    children?: React.ReactNode;
    hint?: string;
}

export const CustomField: React.FC<ICustomFieldProps> = (props) => {

    const fieldStyles = sharedFieldStyles();

    return (
        <div>
            <Field
                label={props.label}
                className={fieldStyles.root}
                size="large"
                required={props.required}
                hint={props.hint}
            >
                {props.children}
            </Field>
        </div>
    );
};