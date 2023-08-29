import { FC, useMemo } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Trans } from "@lingui/macro";

const BACK = (
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
      d="M14.2929 24.7071C13.9024 24.3166 13.9024 23.6834 14.2929 23.2929L31.2635 6.32231C31.654 5.93179 32.2871 5.93179 32.6777 6.32231L34.1335 7.77812C34.524 8.16864 34.524 8.80181 34.1335 9.19233L19.3258 24L34.1335 38.8076C34.524 39.1982 34.524 39.8313 34.1335 40.2218L32.6777 41.6777C32.2871 42.0682 31.654 42.0682 31.2635 41.6777L14.2929 24.7071Z"
      fill="#131212"
    />
  </svg>
);

interface CopyRouteProps {
  title: string;
  link: string;
}

const CopyRoute: FC<CopyRouteProps> = ({ ...props }) => {
  const { isBigMobile } = useWindowWidth();

  const mobile = useMemo(() => {
    return (
      <Stack
        direction={"row"}
        alignItems={"center"}
        width={"100%"}
        sx={(theme) => ({
          borderBottom: `1px solid ${theme.normal.border}`,
        })}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"4px"}
          onClick={() => {
            window.location.href = props.link;
          }}
          paddingY={"16px"}
          paddingX={"20px"}
        >
          <Box
            sx={(theme) => ({
              width: "16px",
              height: "16px",
              "& svg": {
                width: "16px",
                height: "16px",
                display: "block",
                "& path": {
                  fill: theme.normal.text2,
                },
              },
            })}
          >
            {BACK}
          </Box>
          <Box
            sx={(theme) => ({
              fontWeight: "400",
              fontSize: "14px",
              lineHeight: "20px",
              color: theme.normal.text0,
            })}
          >
            <Trans>Copy</Trans>
          </Box>
        </Stack>
      </Stack>
    );
  }, [props.link]);

  const pc = useMemo(() => {
    return (
      <Stack
        direction={"row"}
        spacing={"4px"}
        paddingY={"12px"}
        justifyContent={"flex-left"}
        alignItems={"center"}
        paddingTop={"24px"}
        sx={(theme) => ({
          fontWeight: "400",
          fontSize: "14px",
          lineHeight: "20px",
          color: theme.normal.text2,
          borderBottom: `1px solid ${theme.normal.border}`,
        })}
      >
        <Box
          padding={"4px 8px"}
          sx={(theme) => ({
            "&:hover": {
              cursor: "pointer",
              padding:"4px 8px",
              color: theme.normal.text0,
              borderRadius: "4px",
              background: theme.normal.grey_hover
            },
          })}
          onClick={() => {
            window.location.href = props.link;
          }}
        >
          <Trans>Copy Trading</Trans>
        </Box>
        <Box>/</Box>
        <Box
          padding={"4px 8px"}
          sx={(theme) => ({ color: theme.normal.text0 })}
        >
          {props.title}
        </Box>
      </Stack>
    );
  }, [props.link, props.title]);
  return <>{isBigMobile ? mobile : pc}</>;
};

export default CopyRoute;
