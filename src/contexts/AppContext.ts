import React, { createContext } from "react";
import { Theme } from "@fluentui/react-components";

interface IAppContextProps {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

export const AppContext = createContext({} as IAppContextProps);