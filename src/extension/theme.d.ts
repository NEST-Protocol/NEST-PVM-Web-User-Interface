declare module "@mui/material/styles" {
  interface Theme {
    normal: {
      primary: string;
      primary_hover: string;
      primary_active: string;
      primary_light_hover: string;
      primary_light_active: string;
      success: string;
      success_hover: string;
      success_active: string;
      success_light_hover: string;
      success_light_active: string;
      danger: string;
      danger_hover: string;
      danger_active: string;
      danger_light_hover: string;
      danger_light_active: string;
      bg0: string;
      bg1: string;
      bg2: string;
      bg3: string;
      bg4: string;
      text0: string;
      text1: string;
      text2: string;
      text3: string;
      highLight: string;
      highDark: string;
      border: string;
      disabled_bg: string;
      disabled_text: string;
      disabled_border: string;
      grey: string;
      grey_hover: string;
      grey_active: string;
      grey_light_hover: string;
      grey_light_active: string;
      overlay_bg: string;
    };
    isLight: boolean;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    normal: {
      primary: string;
      primary_hover: string;
      primary_active: string;
      primary_light_hover: string;
      primary_light_active: string;
      danger: string;
      danger_hover: string;
      danger_active: string;
      danger_light_hover: string;
      danger_light_active: string;
      success: string;
      success_hover: string;
      success_active: string;
      success_light_hover: string;
      success_light_active: string;
      bg0: string;
      bg1: string;
      bg2: string;
      bg3: string;
      bg4: string;
      text0: string;
      text1: string;
      text2: string;
      text3: string;
      highLight: string;
      highDark: string;
      border: string;
      disabled_bg: string;
      disabled_text: string;
      disabled_border: string;
      grey: string;
      grey_hover: string;
      grey_active: string;
      grey_light_hover: string;
      grey_light_active: string;
      overlay_bg: string;
    };
    isLight: boolean;
  }
  interface BreakpointOverrides {
    ssm: true,
  }
}

export {};
