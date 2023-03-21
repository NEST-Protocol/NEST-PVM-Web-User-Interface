import { createContainer } from "unstated-next";
import { Theme } from "@mui/material/styles";
import { useState } from "react";
import { whiteTheme, darkTheme } from "../themes/themes";

function useThemeBase() {
  /**
   * Theme
   */
  const [nowTheme, setNowTheme] = useState<Theme>(darkTheme);
  /**
   * Change theme
   */
  const changeTheme = () => {
    setNowTheme(nowTheme === darkTheme ? whiteTheme : darkTheme);
  };
  return { nowTheme, changeTheme };
}

const SetTheme = createContainer(useThemeBase);

function useTheme() {
  return SetTheme.useContainer();
}

export const SetThemeProvider = SetTheme.Provider;
export default useTheme;
