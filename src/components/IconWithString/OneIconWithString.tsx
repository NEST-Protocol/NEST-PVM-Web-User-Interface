import { styled } from "@mui/material/styles";
import { Stack } from "@mui/system";
import { FC } from "react";

interface OneIconWithStringProps {
  icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  title: string;
  onClick: () => void;
  selected?: boolean;
}

const OneIconWithString: FC<OneIconWithStringProps> = ({ ...props }) => {
  const Icon = props.icon;
  const TitleP = styled("p")(({ theme }) => {
    return {
      height: 24,
      lineHeight: "24px",
      fontWeight: 400,
      fontSize: 18,
      color: props.selected ? theme.normal.primary : theme.normal.text0,
      "&:hover": {
        cursor: "pointer",
        color: theme.normal.primary,
      },
    };
  });
  return (
    <Stack
      direction={"row"}
      height={"24px"}
      justifyContent={"flex-start"}
      alignItems="center"
      spacing={"8px"}
      component={"button"}
      onClick={props.onClick}
    >
      <Icon style={{ width: 20, height: 20, display: "block" }} />
      <TitleP>{props.title}</TitleP>
    </Stack>
  );
};

export default OneIconWithString;
