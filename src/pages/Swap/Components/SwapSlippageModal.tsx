import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FC, useState } from "react";
import MainButton from "../../../components/MainButton/MainButton";
import useWindowWidth from "../../../hooks/useWindowWidth";
import BaseModal from "../../Share/Modal/BaseModal";
import { t } from "@lingui/macro";

interface SwapSlippageModalProps {
  onClose: () => void;
  nowSelected: number;
  selectedCallBack: (num: number) => void;
}

const SwapSlippageModal: FC<SwapSlippageModalProps> = ({ ...props }) => {
  const [selected, setSelected] = useState<number>(props.nowSelected);
  const { isMobile } = useWindowWidth();
  const dataArray = [0.1, 0.5, 1, 2, 3];
  const BaseButton = styled("button")(({ theme }) => {
    const width = isMobile ? 53 : 72;
    return {
      width: width,
      height: 36,
      boxSizing: "border-box",
      borderRadius: 8,
      border: `1px solid ${theme.normal.primary_light_active}`,
      color: theme.normal.primary,
      fontWeight: 700,
      fontSize: 12,
      "&:hover": {
        cursor: "pointer",
        background: theme.normal.primary_hover,
        color: theme.normal.highDark,
        border: "none",
      },
      "&:active": {
        backgroundColor: theme.normal.primary_active,
        color: theme.normal.highDark,
        border: "none",
      },
      "&.SwapSlippageSelected": {
        background: theme.normal.primary,
        color: theme.normal.highDark,
        border: "none",
      },
    };
  });
  const buttonArray = dataArray.map((item, index) => {
    return (
      <BaseButton
        className={`${item === selected ? "SwapSlippageSelected" : ""}`}
        key={`slippage + ${index}`}
        onClick={() => setSelected(item)}
      >{`${item}%`}</BaseButton>
    );
  });
  return (
    <BaseModal title={t`Slippage Tolerance Setting`} onClose={props.onClose}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        width={"100%"}
        marginBottom={"24px"}
      >
        {buttonArray}
      </Stack>
      <MainButton
        title={t`Confirm`}
        onClick={() => {
          props.selectedCallBack(selected);
          props.onClose();
        }}
        style={{
          height: "40px",
          fontSize: 14,
        }}
      />
    </BaseModal>
  );
};

export default SwapSlippageModal;
