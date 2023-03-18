import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC, useState } from "react";
import {
  Add,
  SwapExchangeBig,
  SwapExchangeSmall,
  WriteIcon,
} from "../../components/icons";
import LinkButton from "../../components/MainButton/LinkButton";
import MainButton from "../../components/MainButton/MainButton";
import useSwap from "../../hooks/useSwap";
import useWindowWidth from "../../hooks/useWindowWidth";
import SwapInputItem, { SwapShowItem } from "./Components/SwapInputItem";
import SwapSlippageModal from "./Components/SwapSlippageModal";

const SwapBaseStack = styled(Stack)(({ theme }) => {
  return {
    borderRadius: 12,
    maxWidth: 450,
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    "& .SwapTitle": {
      color: theme.normal.text0,
      fontWeight: 700,
      fontSize: 20,
      height: 28,
      lineHeight: "28px",
    },
  };
});

const Swap: FC = () => {
  const { isMobile } = useWindowWidth();
  const [openModal, setOpenModal] = useState(false);
  const {
    swapToken,
    exchangeButton,
    showSrcBalance,
    showDestBalance,
    slippage,
    setSlippage,
    maxCallBack,
    inputAmount,
    setInputAmount,
    showPrice,
    showOutAmount,
    exchangePrice,
    mainButtonTitle,
    mainButtonAction,
    mainButtonDis,
    mainButtonLoading,
    tokenArray,
    selectToken,
    hideSetting,
    addNESTToWallet
  } = useSwap();

  const ExchangeIcon = styled("button")(({ theme }) => {
    return {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.normal.primary,
      marginTop: -8,
      marginBottom: -8,
      zIndex: 5,
      "&:hover": {
        backgroundColor: theme.normal.primary_hover,
        cursor: "pointer",
      },
      "&:active": {
        backgroundColor: theme.normal.primary_active,
      },
      "& svg": {
        width: 24,
        height: 24,
        display: "block",
        margin: "0 auto",
      },
    };
  });
  const SettingStack = styled(Stack)(({ theme }) => {
    return {
      width: "100%",
      "& p": {
        fontSize: 14,
        fontWeight: 700,
        height: 20,
        lineHeight: "20px",
        color: theme.normal.text0,
      },
      "& .SwapSettingTitle": {
        fontWeight: 400,
        color: theme.normal.text2,
      },
      "& svg": {
        width: 16,
        height: 16,
        display: "block",
      },
    };
  });
  const LittleExchangeIcon = styled("button")(({ theme }) => {
    return {
      width: 20,
      height: 20,
      borderRadius: 12,
      border: `1px solid ${theme.normal.border}`,
      "&: hover": {
        cursor: "pointer",
      },
      "& svg": {
        margin: "0 auto",
        "& path": {
          fill: theme.normal.text2,
        },
      },
    };
  });
  
  return (
    <Stack direction={"row"} justifyContent={"center"}>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <SwapSlippageModal
            onClose={() => setOpenModal(false)}
            nowSelected={slippage}
            selectedCallBack={(num) => setSlippage(num)}
          />
        </Box>
      </Modal>
      <SwapBaseStack
        spacing={0}
        justifyContent={"flex-start"}
        alignItems={"center"}
        paddingY={isMobile ? "20px" : "32px"}
        marginY={isMobile ? "12px" : "80px"}
        border={(theme) =>
          isMobile ? "none" : `1px solid ${theme.normal.border}`
        }
      >
        <Stack spacing={"8px"} width={"100%"} marginBottom={"24px"}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <p className="SwapTitle">Swap</p>
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"4px"}
              width={"auto"}
              component={'button'}
              sx={(theme) => ({
                border: `1px solid ${theme.normal.border}`,
                height: "28px",
                borderRadius: "8px",
                paddingX: "8px",
                color: theme.normal.text2,
                "&:hover": {
                  cursor: "pointer",
                  color: theme.normal.text0,
                  border: `1px solid ${theme.normal.grey_hover}`,
                  background: theme.normal.grey_hover,
                },
                "&:active": {
                  cursor: "pointer",
                  color: theme.normal.text0,
                  border: `1px solid ${theme.normal.grey_active}`,
                  background: theme.normal.grey_active,
                },
                "& svg": {
                  width: "12px",
                  height: "12px",
                  display: "block",
                  "& path": {
                    fill: theme.normal.text2,
                  },
                },
              })}
              onClick={addNESTToWallet}
            >
              <Add />
              <Box
                component={"p"}
                sx={(theme) => ({
                  fontSize: 14,
                  fontWeight: 400,
                })}
              >
                Add NEST to wallet
              </Box>
            </Stack>
          </Stack>
          <Box
            sx={(theme) => ({
              color: theme.normal.text2,
              fontWeight: 400,
              fontSize: 14,
            })}
          >
            Trade tokens in instant
          </Box>
        </Stack>
        <SwapInputItem
          tokenName={swapToken.src}
          balance={showSrcBalance}
          maxCallBack={maxCallBack}
          tokenArray={tokenArray}
          selectToken={selectToken}
        >
          <input
            placeholder={"0.0"}
            value={inputAmount}
            maxLength={32}
            onChange={(e) => setInputAmount(e.target.value.formatInputNum())}
          />
        </SwapInputItem>
        <ExchangeIcon onClick={exchangeButton}>
          <SwapExchangeBig />
        </ExchangeIcon>
        <SwapShowItem
          tokenName={swapToken.dest}
          balance={showDestBalance}
          value={showOutAmount}
        />
        <Stack spacing={"12px"} width={"100%"} marginY={"24px"}>
          {hideSetting ? (
            <></>
          ) : (
            <SettingStack direction={"row"} justifyContent={"space-between"}>
              <p className="SwapSettingTitle">Slippage Tolerance</p>
              <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                spacing={"8px"}
              >
                <p>{slippage} %</p>
                <LinkButton onClick={() => setOpenModal(true)}>
                  <WriteIcon />
                </LinkButton>
              </Stack>
            </SettingStack>
          )}

          <SettingStack direction={"row"} justifyContent={"space-between"}>
            <p className="SwapSettingTitle">Price</p>
            <Stack
              direction={"row"}
              justifyContent={"flex-end"}
              spacing={"8px"}
            >
              <p>{showPrice}</p>
              <LittleExchangeIcon onClick={exchangePrice}>
                <SwapExchangeSmall />
              </LittleExchangeIcon>
            </Stack>
          </SettingStack>
        </Stack>
        <MainButton
          title={mainButtonTitle}
          disable={mainButtonDis}
          isLoading={mainButtonLoading}
          onClick={mainButtonAction}
          style={{
            height: "48px",
            fontSize: 16,
          }}
        />
      </SwapBaseStack>
    </Stack>
  );
};

export default Swap;
