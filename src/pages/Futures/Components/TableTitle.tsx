import {FC} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {NESTTooltipFC} from "../../../components/NESTTooltip/NESTTooltip";
import {Trans} from "@lingui/macro";

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
  noNeedPadding?: boolean;
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
    const paddingConfig = props.noNeedPadding
      ? {padding: "0px !important"}
      : {};
    return (
      <TableCell
        key={`TableTitle + ${props.dataArray.length} + ${index}`}
        align={index === props.dataArray.length - 1 ? "right" : "left"}
        sx={
          index !== 0 && index !== props.dataArray.length - 1
            ? paddingConfig
            : {}
        }
      >
        {help ? (
          <Stack direction={"row"} alignItems={"center"} spacing={"4px"} whiteSpace={'nowrap'}>
            <Box>{item}</Box>
            <NESTTooltipFC title={helpInfo}/>
          </Stack>
        ) : (
          <>{item}</>
        )}
      </TableCell>
    );
  });
  return (
    <TableContainer component={"div"} style={props.style}>
      <Table sx={{width: "100%"}} aria-label="simple table">
        <TableHead
          sx={(theme) => ({
            "& th": {
              padding: "0 20px",
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
              padding: "0 20px",
              height: "84px",
              borderBottom: `1px solid ${theme.normal.border}`,
            },
          })}
        >
          {children}
          {props.noOrder ? (
            <TableRow sx={{"& td": {borderBottom: "0px"}}}>
              <TableCell
                colSpan={cells.length}
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
                <Trans>No Order</Trans>
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
