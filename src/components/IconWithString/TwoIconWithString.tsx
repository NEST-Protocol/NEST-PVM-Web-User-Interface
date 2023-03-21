import { styled } from "@mui/material/styles";
import { Stack } from "@mui/system";
import { FC } from "react";

interface TwoIconWithStringProps {
  icon1: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  icon2: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  title: string;
  onClick: () => void;
  selected?: boolean;
}

const TwoIconWithString: FC<TwoIconWithStringProps> = ({ ...props }) => {
  const Icon1 = props.icon1;
  const Icon2 = props.icon2;
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
      onClick={props.onClick}
    >
      <Icon1
        style={{
          width: 20,
          height: 20,
          display: "block",
          zIndex: 5,
          marginRight: -16,
          position: "relative",
        }}
      />
      <Icon2 style={{ width: 20, height: 20, display: "block" }} />
      <TitleP>{props.title}</TitleP>
    </Stack>
  );
};

export default TwoIconWithString;
