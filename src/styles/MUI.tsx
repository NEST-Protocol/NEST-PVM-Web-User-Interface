import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { checkWidth } from "../libs/utils";

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => {
  const fontSize = checkWidth() ? 14 : 12.5
  const maxWidth = checkWidth() ? 300 : 200
  return ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.white,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "#7D7D7D",
      boxShadow: theme.shadows[1],
      fontSize: fontSize,
      maxWidth: maxWidth
    },
  })
});
