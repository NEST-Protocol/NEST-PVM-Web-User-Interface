import { FC } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface DashboardTableTitleProps {
  dataArray: Array<string>;
  children?: React.ReactNode;
  noOrder?: boolean;
}

const DashboardTableTitle: FC<DashboardTableTitleProps> = ({
  children,
  ...props
}) => {
  const cells = props.dataArray.map((item, index) => {
    return (
      <TableCell
        key={`TableTitle + ${props.dataArray.length} + ${index}`}
      >
        {item}
      </TableCell>
    );
  });
  return (
    <TableContainer component={"div"}>
      <Table sx={{ width: "100%" }} aria-label="simple table">
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
                No User
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

export default DashboardTableTitle;
