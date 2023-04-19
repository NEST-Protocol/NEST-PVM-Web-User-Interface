import {Box, Modal, Stack} from "@mui/material";
import {FC, useEffect, useMemo, useRef, useState} from "react";
import BaseModal from "../Components/DashboardBaseModal";
import {Order} from "../Dashboard";
import {styled} from "@mui/material/styles";
import {Close, NESTFiLogo, NESTLogo} from "../../../components/icons";
import {QRCodeCanvas} from "qrcode.react";
import {useAccount} from "wagmi";
import ShareOrderPosition from "../Components/ShareOrderPosition";
import MainButton from "../../../components/MainButton/MainButton";
import domtoimage from "../../../lib/dom-to-image";
import copy from "copy-to-clipboard";
import useNESTSnackBar from "../../../hooks/useNESTSnackBar";
import {parseUnits} from "ethers/lib/utils.js";
import CircularProgress from "@mui/material/CircularProgress";

const Caption2 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "20px",
  color: "rgba(249, 249, 249, 0.6)",
}));

const Caption4 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "48px",
  lineHeight: "55px",
}));

const Caption5 = styled("div")(({theme}) => ({
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "20px",
  color: "rgba(249, 249, 249, 0.6)",
}));

const Caption7 = styled("div")(({theme}) => ({
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "22px",
  color: "#F9F9F9",
}));

const Caption8 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "24px",
  lineHeight: "32px",
  color: "#F9F9F9",
}));

const TopStack = styled(Stack)(({theme}) => {
  return {
    position: "absolute",
    top: 0,
    right: 0,
    padding: "24px",
    marginBottom: 20,
    "& button": {
      width: 20,
      height: 20,
      "&:hover": {
        cursor: "pointer",
      },
      "& svg": {
        width: 20,
        height: 20,
        "& path": {
          fill: "rgba(249, 249, 249, 0.6)",
        },
      },
    },
  };
});

interface ShareMyOrderModalProps {
  open: boolean;
  onClose: () => void;
  value: Order;
}

const ShareMyOrderModal: FC<ShareMyOrderModalProps> = ({...props}) => {
  const {address} = useAccount();
  const {messageSnackBar} = useNESTSnackBar();
  const myShareRef = useRef(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  const buildDataUrl = async () => {
    if (!myShareRef.current) {
      setTimeout(() => {
        buildDataUrl()
      }, 300)
      return
    }
    const node = myShareRef.current;
    try {
      // @ts-ignore
      node.style.width = '450px'
      if (node) {
        domtoimage.toPng(node, {
          bgcolor: '#1D1E22',
          // @ts-ignore
          width: node.offsetWidth,
          // @ts-ignore
          height: node.offsetHeight,
          quality: 1,
          scale: 2,
        })
          .then(function (dataUrl) {
            setDataUrl(dataUrl)
            // @ts-ignore
            node.style.width = '100%'
          })
      }
    } catch (e) {
      console.log('buildDataUrl: error', e)
      // @ts-ignore
      node.style.width = '100%'
    }
  }

  useEffect(() => {
    if (!dataUrl) {
      buildDataUrl()
    }
  }, [props])

  const download = async () => {
    const link = document.createElement('a');
    link.download = `${address}.png`;
    if (!dataUrl) {
      await buildDataUrl()
    }
    if (typeof dataUrl === "string") {
      link.href = dataUrl;
      link.click();
    }
  }

  const shareLink = useMemo(() => {
    const order = props.value;
    const tokenName = order.tokenPair.split("/")[0];
    const basePrice = parseUnits(order.openPrice.toString(), 2).toString();
    const lever = order.leverage.split("X")[0];
    const orientation = order.orientation === "Long" ? "1" : "0";
    const sp = order.sp ? parseUnits(order.sp!.toString(), 2).toString() : "0";
    const sl = order.sl ? parseUnits(order.sl!.toString(), 2).toString() : "0";
    const orderString = `&pt=${tokenName}&po=${orientation}&pl=${lever}&pp=${basePrice}&pst=${sp}&psl=${sl}`;
    return `https://finance.nestprotocol.org/?a=${address
      ?.slice(-8)
      .toLowerCase()}${orderString}/#/futures`;
  }, [address, props.value]);

  const tweet = () => {
    const link = shareLink;
    const text = `Follow the right person, making money is as easy as breathing.
You can follow the right person on NESTFi, here is my refer link: ${link}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURI(
        text
      )}&hashtags=NEST,btc,eth&via=NEST_Protocol`
    );
  };

  return (
    <Modal
      open={props.open}
      onClose={() => {
        setDataUrl(null)
        props.onClose()
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <BaseModal>
          <Stack
            width={"100%"}
            bgcolor={"rgba(29, 30, 34, 1)"}
            borderRadius={"12px"}
            overflow={"hidden"}
            position={'relative'}
          >
            <TopStack
              sx={{
                "& button": {
                  "& svg": {
                    "& path": {
                      fill: "rgba(249, 249, 249, 0.6)",
                    },
                  },
                },
              }}
            >
              <button onClick={() => {
                setDataUrl(null)
                props.onClose()
              }}>
                <Close/>
              </button>
            </TopStack>
            {
              dataUrl ? (
                <img src={dataUrl} style={{width: '100%'}} alt={'share'}/>
              ) : (
                <Stack minHeight={'400px'} height={'calc(min(100vw - 40px, 450px) * 1.46222)'} alignItems={'center'} spacing={'18px'} justifyContent={'center'}
                       sx={(theme) => ({
                         color: '#F9F9F9',
                         fontSize: '16px',
                         lineHeight: '22px',
                         fontWeight: '700',
                         "& svg": {
                           display: "block",
                           color: theme.normal.primary,
                         }
                       })}>
                  <CircularProgress size={'44px'}/>
                  <span>
                Loading...
              </span>
                </Stack>
              )
            }
            <Stack ref={myShareRef} position={'absolute'} zIndex={-1}>
              <Stack
                pt={"50px"}
                px={"24px"}
                bgcolor={"#0B0C0D"}
                minHeight={"558px"}
                style={{
                  backgroundImage: `url('/images/share_order.png')`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                }}
              >
                <Box
                  sx={{
                    "& svg": {
                      height: "48px",
                      display: "block",
                      "& path": {
                        fill: "#fff",
                      },
                    },
                  }}
                >
                  <NESTFiLogo/>
                </Box>
                <Stack direction={"row"} pt={"60px"}>
                  <ShareOrderPosition
                    tokenName={props.value.tokenPair.split("/")[0]}
                    isLong={props.value.orientation === "Long"}
                    lever={props.value.leverage}
                  />
                </Stack>
                <Stack pt={"20px"} spacing={"14px"}>
                  <Caption2>Total Profit</Caption2>
                  <Caption4
                    sx={(theme) => ({
                      color:
                        props.value.actualRate >= 0
                          ? theme.normal.success
                          : theme.normal.danger,
                    })}
                  >
                    {props.value.actualRate}%
                  </Caption4>
                </Stack>
                <Stack direction={"row"} pt={"54px"}>
                  <Stack spacing={"7px"} width={"50%"}>
                    <Caption5>Open Price</Caption5>
                    <Caption8>
                      {props.value.openPrice?.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}{" "}
                      USDT
                    </Caption8>
                  </Stack>
                  <Stack spacing={"7px"} width={"50%"}>
                    <Caption5>Close Price</Caption5>
                    <Caption8>
                      {props.value.lastPrice?.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}{" "}
                      USDT
                    </Caption8>
                  </Stack>
                </Stack>
                <Stack height={"110px"}/>
              </Stack>
              <Stack
                px={"20px"}
                direction={"row"}
                width={"100%"}
                paddingRight={"36px"}
                justifyContent={"space-between"}
                bgcolor={"rgba(29, 30, 34, 1)"}
                alignItems={"center"}
                py={"18px"}
              >
                <Stack direction={"row"} spacing={"12px"}>
                  <NESTLogo/>
                  <Stack>
                    <Caption7>Scan and copy the trade</Caption7>
                    <Caption7>with 1 click</Caption7>
                  </Stack>
                </Stack>
                <Box
                  style={{
                    width: "64px",
                    height: "64px",
                    background: "white",
                    padding: "3px",
                  }}
                >
                  <QRCodeCanvas value={shareLink} size={58}/>
                </Box>
              </Stack>
            </Stack>
            <Stack
              direction={"row"}
              width={"100%"}
              spacing={"12px"}
              px={"20px"}
              py={"24px"}
            >
              <MainButton
                style={{
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "22px",
                }}
                disable={!address}
                title={"Copy Link"}
                onClick={() => {
                  if (!address) return;
                  const link = shareLink;
                  copy(link);
                  messageSnackBar("Copy Successfully");
                }}
              />
              <MainButton
                style={{
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "22px",
                }}
                isLoading={!dataUrl}
                title={"Image"}
                onClick={download}
              />
              <MainButton
                style={{
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "22px",
                }}
                title={"Twitter"}
                onClick={tweet}
              />
            </Stack>
          </Stack>
        </BaseModal>
      </Box>
    </Modal>
  );
};

export default ShareMyOrderModal;
