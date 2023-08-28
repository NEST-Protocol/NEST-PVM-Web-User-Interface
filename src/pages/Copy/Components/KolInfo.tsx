import { FC, useCallback, useEffect, useMemo, useState } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import MainButton from "../../../components/MainButton/MainButton";
import { Trans, t } from "@lingui/macro";
import CopySettingModal from "./CopySettingModal";
import { AllKOLModel } from "../Hooks/useCopy";
import useNEST from "../../../hooks/useNEST";
import { copyAsset } from "../../../lib/NESTRequest";
import CopyStopModal from "./CopyStopModal";
import {
  TransactionType,
  usePendingTransactionsBase,
} from "../../../hooks/useTransactionReceipt";
import { SnackBarType } from "../../../components/SnackBar/NormalSnackBar";

const WALLET = (
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
      d="M30.7846 2.26792C31.7412 1.71563 32.9644 2.04338 33.5167 2.99997L38.1291 10.9889C38.4865 11.608 38.4863 12.3709 38.1285 12.9898C37.7707 13.6088 37.1097 13.9896 36.3948 13.9889L17.9798 13.9689C17.075 13.9679 16.2836 13.3596 16.0499 12.4855C15.8162 11.6113 16.1984 10.6892 16.982 10.2368L30.7846 2.26792ZM25.4321 9.97696L32.9307 9.9851L31.0525 6.73201L25.4321 9.97696Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 14C2 11.7908 3.79088 9.99997 6 9.99997H42C44.2092 9.99997 46 11.7908 46 14V42C46 44.2091 44.2092 46 42 46H6C3.79088 46 2 44.2092 2 42V14ZM42 14H6V42H42V14Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M28 28C28 24.0432 31.339 21 35.25 21H44C45.1046 21 46 21.8954 46 23V33C46 34.1045 45.1046 35 44 35H35.25C31.339 35 28 31.9568 28 28ZM35.25 25C33.362 25 32 26.434 32 28C32 29.566 33.362 31 35.25 31H42V25H35.25Z"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M44 14.5C45.1046 14.5 46 15.3954 46 16.5V40.5C46 41.6045 45.1046 42.5 44 42.5C42.8954 42.5 42 41.6045 42 40.5V16.5C42 15.3954 42.8954 14.5 44 14.5Z"
      fill="#333333"
    />
  </svg>
);
const PERSENT = (
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
      d="M18.1921 4.75152C18.6152 5.77185 18.131 6.94197 17.1107 7.36505C14.9121 8.2767 12.9316 9.61268 11.2721 11.2722C8.01253 14.5318 6 19.029 6 24.0001C6 33.9412 14.0589 42.0001 24 42.0001C28.9711 42.0001 33.4683 39.9876 36.7279 36.728C38.3874 35.0685 39.7234 33.088 40.635 30.8895C41.0581 29.8691 42.2282 29.385 43.2485 29.808C44.2689 30.2311 44.753 31.4012 44.33 32.4215C43.2144 35.1122 41.5814 37.5315 39.5563 39.5564M39.5563 39.5564C35.5773 43.5354 30.0745 46.0001 24 46.0001C11.8497 46.0001 2 36.1504 2 24.0001C2 17.9256 4.46463 12.4228 8.44364 8.44377C10.4686 6.41881 12.8879 4.78578 15.5785 3.67011C16.5989 3.24703 17.769 3.73119 18.1921 4.75152"
      fill="#333333"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M22 4C22 2.89543 22.8954 2 24 2C36.1503 2 46 11.8497 46 24C46 25.1046 45.1046 26 44 26H24C22.8954 26 22 25.1046 22 24V4ZM26 6.10986V22H41.8901C40.9678 13.6568 34.3432 7.03215 26 6.10986Z"
      fill="#333333"
    />
  </svg>
);

interface KolInfoProps {
  data: AllKOLModel | undefined;
}

const KolInfo: FC<KolInfoProps> = ({ ...props }) => {
  const { isBigMobile } = useWindowWidth();
  const { chainsData, signature, account } = useNEST();
  const [openCopyModal, setOpenCopyModal] = useState(false);
  const [openStopModal, setOpenStopModal] = useState(false);
  const [current, setCurrent] = useState<number>();
  const { addTransactionNotice } = usePendingTransactionsBase();

  const nickName = props.data ? props.data.nickName : String().placeHolder;
  const walletAddress = props.data
    ? props.data.walletAddress.showAddress()
    : String().placeHolder;
  const rewardRatio = props.data
    ? (props.data.rewardRatio * 100).floor(2) + "%"
    : String().placeHolder;
  const kolProfitLossRate = props.data
    ? props.data.kolProfitLossRate.floor(2)
    : String().placeHolder;
  const followersAssets = props.data
    ? props.data.followersAssets.floor(2)
    : String().placeHolder;
  const currentFollowers = props.data
    ? `${props.data.currentFollowers}`
    : String().placeHolder;
  const introduction = props.data
    ? props.data.introduction
    : String().placeHolder;

  const kolBaseInfo = useCallback((title: string, info: string) => {
    return (
      <Stack spacing={"4px"}>
        <Box
          sx={(theme) => ({
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "20px",
            color: theme.normal.text1,
          })}
        >
          {title}
        </Box>
        <Box
          sx={(theme) => ({
            fontWeight: "700",
            fontSize: "20px",
            lineHeight: "28px",
            color: theme.normal.text0,
          })}
        >
          {info}
        </Box>
      </Stack>
    );
  }, []);

  const getCurrent = useCallback(async () => {
    if (chainsData.chainId && signature && props.data && account.address) {
      const req = await copyAsset(
        chainsData.chainId,
        props.data.walletAddress,
        account.address,
        {
          Authorization: signature.signature,
        }
      );
      if (Number(req["errorCode"]) === 0) {
        const value = req["value"];
        setCurrent(value["copyAccountBalance"]);
      }
    }
  }, [account.address, chainsData.chainId, props.data, signature]);

  useEffect(() => {
    getCurrent();
  }, [getCurrent]);

  const button = useMemo(() => {
    if ((current ?? 0) > 0) {
      return (
        <Box
          sx={(theme) => ({
            background: theme.normal.grey_light_hover,
            borderRadius: "8px",
            padding: "10px 16px",
            fontWeight: "700",
            fontSize: "14px",
            lineHeight: "20px",
            color: theme.normal.text0,
            "&:hover": {
              cursor: "pointer",
            },
          })}
          onClick={() => setOpenStopModal(true)}
        >
          <Trans>Stop Copying</Trans>
        </Box>
      );
    } else {
      return (
        <MainButton
          title={t`Copy Now`}
          onClick={() => setOpenCopyModal(true)}
          style={{
            height: "40px",
            paddingLeft: "16px",
            paddingRight: "16px",
            fontSize: "14px",
            width: "fit-content",
          }}
        />
      );
    }
  }, [current]);

  const mobile = useMemo(() => {
    return (
      <Stack spacing={"12px"} alignItems={"center"} paddingX={"20px"}>
        <Box
          sx={(theme) => ({
            width: "80px",
            minWidth: "80px",
            height: "80px",
            borderRadius: "40px",
            background: theme.normal.primary,
          })}
        ></Box>
        <Stack spacing={"16px"} alignItems={"center"}>
          <Stack spacing={"8"} alignItems={"center"}>
            <Box
              sx={(theme) => ({
                fontWeight: "700",
                fontSize: "24px",
                lineHeight: "32px",
                color: theme.normal.text0,
              })}
            >
              {nickName}
            </Box>

            <Stack direction={"row"} spacing={"12px"} alignItems={"center"}>
              <Stack direction={"row"} spacing={"4px"} alignItems={"center"}>
                <Box
                  width={"20px"}
                  height={"20px"}
                  padding={"4px"}
                  sx={(theme) => ({
                    "& svg": {
                      width: "12px",
                      height: "12px",
                      display: "block",
                      "& path": {
                        fill: theme.normal.text1,
                      },
                    },
                  })}
                >
                  {WALLET}
                </Box>
                <Box
                  sx={(theme) => ({
                    fontWeight: "400",
                    fontSize: "12px",
                    lineHeight: "16px",
                    color: theme.normal.text1,
                  })}
                >
                  {walletAddress}
                </Box>
              </Stack>
              <Stack direction={"row"} spacing={"4px"} alignItems={"center"}>
                <Box
                  width={"20px"}
                  height={"20px"}
                  padding={"4px"}
                  sx={(theme) => ({
                    "& svg": {
                      width: "12px",
                      height: "12px",
                      display: "block",
                      "& path": {
                        fill: theme.normal.text1,
                      },
                    },
                  })}
                >
                  {PERSENT}
                </Box>
                <Box
                  sx={(theme) => ({
                    fontWeight: "400",
                    fontSize: "12px",
                    lineHeight: "16px",
                    color: theme.normal.text1,
                  })}
                >
                  {rewardRatio}
                </Box>
              </Stack>
            </Stack>

            <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
              {props.data && props.data.tags.length > 0 ? (
                props.data.tags.map((item) => {
                  return (
                    <Box
                      padding={"3px 4px"}
                      sx={(theme) => ({
                        fontWeight: "400",
                        fontSize: "10px",
                        lineHeight: "14px",
                        color: theme.normal.primary,
                        borderRadius: "4px",
                        background: theme.normal.bg3,
                        height: "fit-content",
                      })}
                    >
                      {item}
                    </Box>
                  );
                })
              ) : (
                <></>
              )}
            </Stack>
          </Stack>

          <Stack
            spacing={"64px"}
            direction={"row"}
            alignItems={"center"}
            sx={{
              "& div": {
                textAlign: "center",
              },
            }}
          >
            {kolBaseInfo(t`ROI`, kolProfitLossRate)}
            {kolBaseInfo(t`AUM(NEST)`, followersAssets)}
            {kolBaseInfo(t`Followers`, currentFollowers)}
          </Stack>

          <Box
            sx={(theme) => ({
              fontWeight: "400",
              fontSize: "14px",
              lineHeight: "20px",
              color: theme.normal.text2,
              textAlign: "center",
            })}
          >
            {introduction}
          </Box>

          {button}
        </Stack>
      </Stack>
    );
  }, [
    button,
    currentFollowers,
    followersAssets,
    introduction,
    kolBaseInfo,
    kolProfitLossRate,
    nickName,
    props.data,
    rewardRatio,
    walletAddress,
  ]);

  const pc = useMemo(() => {
    return (
      <Stack
        direction={"row"}
        spacing={"32px"}
        justifyContent={"flex-start"}
        paddingX={["20px", "20px", "20px", "20px", "0"]}
      >
        <Box
          sx={(theme) => ({
            width: "80px",
            minWidth: "80px",
            height: "80px",
            borderRadius: "40px",
            background: theme.normal.primary,
          })}
        ></Box>
        <Stack spacing={"24px"} width={"100%"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <Stack spacing={"8px"}>
              <Stack direction={"row"} spacing={"12px"}>
                <Box
                  sx={(theme) => ({
                    fontWeight: "700",
                    fontSize: "24px",
                    lineHeight: "32px",
                    color: theme.normal.text0,
                  })}
                >
                  {nickName}
                </Box>

                <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
                  {props.data && props.data.tags.length > 0 ? (
                    props.data.tags.map((item) => {
                      return (
                        <Box
                          padding={"3px 4px"}
                          sx={(theme) => ({
                            fontWeight: "400",
                            fontSize: "10px",
                            lineHeight: "14px",
                            color: theme.normal.primary,
                            borderRadius: "4px",
                            background: theme.normal.bg3,
                            height: "fit-content",
                          })}
                        >
                          {item}
                        </Box>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </Stack>
              </Stack>
              <Stack direction={"row"} spacing={"12px"} alignItems={"center"}>
                <Stack direction={"row"} spacing={"4px"} alignItems={"center"}>
                  <Box
                    width={"20px"}
                    height={"20px"}
                    padding={"4px"}
                    sx={(theme) => ({
                      "& svg": {
                        width: "12px",
                        height: "12px",
                        display: "block",
                        "& path": {
                          fill: theme.normal.text1,
                        },
                      },
                    })}
                  >
                    {WALLET}
                  </Box>
                  <Box
                    sx={(theme) => ({
                      fontWeight: "400",
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: theme.normal.text1,
                    })}
                  >
                    {walletAddress}
                  </Box>
                </Stack>
                <Stack direction={"row"} spacing={"4px"} alignItems={"center"}>
                  <Box
                    width={"20px"}
                    height={"20px"}
                    padding={"4px"}
                    sx={(theme) => ({
                      "& svg": {
                        width: "12px",
                        height: "12px",
                        display: "block",
                        "& path": {
                          fill: theme.normal.text1,
                        },
                      },
                    })}
                  >
                    {PERSENT}
                  </Box>
                  <Box
                    sx={(theme) => ({
                      fontWeight: "400",
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: theme.normal.text1,
                    })}
                  >
                    {rewardRatio}
                  </Box>
                </Stack>
              </Stack>
              <Stack spacing={"64px"} direction={"row"} alignItems={"center"}>
                {kolBaseInfo(t`ROI`, kolProfitLossRate)}
                {kolBaseInfo(t`AUM(NEST)`, followersAssets)}
                {kolBaseInfo(t`Followers`, currentFollowers)}
              </Stack>
            </Stack>

            <Stack
              direction={"row"}
              justifyContent={"flex-end"}
              alignItems={"center"}
            >
              {button}
            </Stack>
          </Stack>
          <Box
            sx={(theme) => ({
              fontWeight: "400",
              fontSize: "14px",
              lineHeight: "20px",
              color: theme.normal.text2,
            })}
          >
            {introduction}
          </Box>
        </Stack>
      </Stack>
    );
  }, [
    button,
    currentFollowers,
    followersAssets,
    introduction,
    kolBaseInfo,
    kolProfitLossRate,
    nickName,
    props.data,
    rewardRatio,
    walletAddress,
  ]);
  return (
    <>
      <CopySettingModal
        open={openCopyModal}
        name={props.data ? props.data.nickName : ""}
        address={props.data ? props.data.walletAddress : ""}
        onClose={(res?: boolean) => {
          if (res !== undefined) {
            addTransactionNotice({
              type: TransactionType.copy,
              info: res ? t`Click here to view copy trading details.` : "",
              result: res ? SnackBarType.success : SnackBarType.fail,
            });
          }
          getCurrent();
          setOpenCopyModal(false);
        }}
      />
      <CopyStopModal
        open={openStopModal}
        onClose={(res?: boolean) => {
          if (res !== undefined) {
            addTransactionNotice({
              type: TransactionType.closeCopy,
              info: "",
              result: res ? SnackBarType.success : SnackBarType.fail,
            });
          }
          getCurrent();
          setOpenStopModal(false);
        }}
        address={props.data ? props.data.walletAddress : ""}
      />
      {isBigMobile ? mobile : pc}
    </>
  );
};

export default KolInfo;
