import { FC } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { NESTTooltipFC } from "../../../components/NESTTooltip/NESTTooltip";

export interface FuturesTableTitleHelp {
  index: number;
  helpInfo: JSX.Element;
}

interface FuturesTableTitleProps {
  dataArray: Array<string>;
  children?: React.ReactNode;
  noOrder?: boolean;
  style?: React.CSSProperties;
  helps?: FuturesTableTitleHelp[];
}

const FuturesTableTitle: FC<FuturesTableTitleProps> = ({
  children,
  ...props
}) => {
  const cells = props.dataArray.map((item, index) => {
    const help = props.helps
      ? props.helps.filter((item) => item.index === index).length > 0
      : false;
    const helpInfo = help ? (
      props.helps!.filter((item) => item.index === index)[0].helpInfo
    ) : (
      <></>
    );
    return (
      <TableCell
        key={`TableTitle + ${props.dataArray.length} + ${index}`}
        align={index === props.dataArray.length - 1 ? "right" : "left"}
      >
        {help ? (
          <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
            <Box>{item}</Box>
            <NESTTooltipFC title={helpInfo} />
          </Stack>
        ) : (
          <>{item}</>
        )}
      </TableCell>
    );
  });
  return (
    <TableContainer component={"div"} style={props.style}>
      <Table sx={{ width: "100%" }} aria-label="simple table">
        <TableHead
          sx={(theme) => ({
            "& th": {
              padding: "0px 20px",
              height: "44px",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "16px",
              color: theme.normal.text2,
              borderBottom: `1px solid ${theme.normal.border}`,
            },
          })}
        >
          <TableRow>{cells}</TableRow>
        </TableHead>
        <TableBody
          sx={(theme) => ({
            "& td": {
              height: "84px",
              padding: "0px 20px",
              borderBottom: `1px solid ${theme.normal.border}`,
            },
          })}
        >
          {children}
          {props.noOrder ? (
            <TableRow sx={{ "& td": { borderBottom: "0px" } }}>
              <TableCell
                colSpan={6}
                sx={(theme) => ({
                  width: "100%",
                  fontSize: 14,
                  fontWeight: 400,
                  color: theme.normal.text2,
                  height: "168px",
                  textAlign: "center",
                  lineHeight: "168px",
                })}
              >
                No Order
              </TableCell>
            </TableRow>
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FuturesTableTitle;
