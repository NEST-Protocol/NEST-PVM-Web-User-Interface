import Box from "@mui/material/Box";
import { FC, useState } from "react";
import SelectListMenu from "../../../components/SelectListMemu/SelectListMenu";
import { t } from "@lingui/macro";
import Stack from "@mui/material/Stack";

const DOWN = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M24.9201 33.9205C24.5296 34.311 23.8964 34.311 23.5059 33.9205L6.53532 16.9499C6.1448 16.5594 6.1448 15.9262 6.53532 15.5357L7.99113 14.0799C8.38166 13.6894 9.01482 13.6894 9.40535 14.0799L24.213 28.8875L39.0206 14.0799C39.4112 13.6894 40.0443 13.6894 40.4349 14.0799L41.8907 15.5357C42.2812 15.9262 42.2812 16.5594 41.8907 16.9499L24.9201 33.9205Z"
      fill="#131212"
    />
  </svg>
);

const TimeData = [
  t`Last 24 hours`,
  t`Last 7 days`,
  t`Last 3 weeks`,
  t`Last month`,
];

interface TimeListProps {
  dataStart: number;
  dataRange: number;
  selectCallBack: (num: number) => void;
}

const TimeList: FC<TimeListProps> = ({ ...props }) => {
  const liArray = () => {
    return TimeData.slice(props.dataStart, props.dataRange).map((item, index) => {
      return (
        <Stack
          key={`TimeData+${index}`}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          component={"button"}
          onClick={() => {
            props.selectCallBack(index);
          }}
          sx={(theme) => ({
            width: "100%",
            paddingX: `16px`,
            height: `44px`,
            color: theme.normal.text0,
            fontSize: `14px`,
            fontWeight: 400,
            "&:hover": {
              cursor: "pointer",
              backgroundColor: theme.normal.bg1,
            },
          })}
        >
          <Box>{item}</Box>
        </Stack>
      );
    });
  };
  return <Stack width={"100%"}>{liArray()}</Stack>;
};

interface SelectTimeProps {
  nowValue: number;
  dataStart: number;
  dataRange: number;
  selectCallBack: (num: number) => void;
}

const SelectTime: FC<SelectTimeProps> = ({ ...props }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Stack
        direction={"row"}
        spacing={"16px"}
        alignItems={"center"}
        component={"button"}
        aria-controls={"time-menu"}
        aria-haspopup="true"
        aria-expanded={"true"}
        onClick={handleClick}
        sx={(theme) => ({
          padding: "10px 12px",
          borderRadius: "8px",
          border: `1px solid ${theme.normal.border}`,
          background: theme.normal.bg1,
          "&:hover": {
            cursor: "pointer",
          },
        })}
      >
        <Box
          sx={(theme) => ({
            fontWeight: "700",
            fontSize: "14px",
            lineHeight: "20px",
            color: theme.normal.text2,
          })}
        >
          {TimeData.slice(props.dataStart, props.dataRange)[props.nowValue]}
        </Box>
        <Box
          sx={(theme) => ({
            width: "14px",
            height: "14px",
            "& svg": {
              width: "14px",
              height: "14px",
              display: "block",
              "& path": {
                fill: theme.normal.text2,
              },
            },
          })}
        >
          {DOWN}
        </Box>
      </Stack>
      <SelectListMenu
        id="time-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <TimeList
          dataStart={props.dataStart}
          dataRange={props.dataRange}
          selectCallBack={(num) => {
            props.selectCallBack(num);
            handleClose();
          }}
        />
      </SelectListMenu>
    </>
  );
};

export default SelectTime;
