import { FC } from "react";
import Tabs from "@mui/material/Tabs";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";

interface NESTTabsProps {
  value: number;
  className: string;
  datArray: JSX.Element[];
  height: number;
  space: number;
  selectCallBack: (value: number) => void;
  isFull?: boolean;
}

const NESTTabs: FC<NESTTabsProps> = ({ ...props }) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    props.selectCallBack(newValue);
  };

  const NESTTabs = styled(Tabs)(({ theme }) => ({
    minHeight: props.height,
    width: props.isFull ? '100%' : 'auto',
    "& .MuiTabs-scroller .MuiTabs-flexContainer button": {
      color: theme.normal.text0,
      padding: 0,
      minWidth: 0,
      maxWidth: "none",
      textTransform: "none",
      width: props.isFull ? '50%' : 'auto',
      fontSize: 16,
      fontWeight: 700,
      "& p": {
        maxWidth: '150px',
        lineHeight: '16px !important'
      },
      "& svg": {
        width: 16,
        height: 16,
        display: "block",
        "& path": {
          fill: theme.normal.text0,
        },
      },
      "&:hover": {
        color: theme.normal.primary,
        "& svg path": {
          fill: theme.normal.primary,
        },
      },
    },
    "& .MuiTabs-scroller .MuiTabs-flexContainer button + button": {
      marginLeft: props.isFull ? '0px' : props.space,
    },
    "& .MuiTabs-scroller .MuiTabs-flexContainer .Mui-selected": {
      color: theme.normal.primary,
      "& svg path": {
        fill: theme.normal.primary,
      },
    },
    "& .MuiTabs-scroller .MuiTabs-indicator": {
      backgroundColor: theme.normal.primary,
    },
  }));

  const tabs = props.datArray.map((item, index) => (
    <Tab key={`${props.className} + ${index}`} label={item} />
  ));

  return (
    <NESTTabs value={props.value} onChange={handleChange} centered>
      {tabs}
    </NESTTabs>
  );
};

export default NESTTabs;
