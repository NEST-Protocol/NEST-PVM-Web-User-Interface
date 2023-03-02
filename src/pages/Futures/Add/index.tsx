import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { formatUnits } from "ethers/lib/utils";
import { FC } from "react";
import InfoShow from "../../../components/InfoShow";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { SingleTokenShow } from "../../../components/TokenShow";
import { Futures3OrderView, useFuturesAdd } from "../../../libs/hooks/useFutures";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import { formatInputNumWithFour } from "../../../libs/utils";
import "./styles";

type FuturesAddProps = {
  order: Futures3OrderView;
  onClose: () => void;
};

const FuturesAdd: FC<FuturesAddProps> = ({ ...props }) => {
  const classPrefix = "FuturesAdd";
  const {
    nestInput,
    setNestInput,
    nestBalance,
    checkNESTBalance,
    showPosition,
    showOpenPrice,
    showLiqPrice,
    buttonLoading,
    buttonDis,
    buttonAction,
  } = useFuturesAdd(props.order);
  const { theme } = useThemes();
  const info = () => {
    return (
      <>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Position</p>
          <p>{showPosition()}</p>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Open Price</p>
          <p>{showOpenPrice()}</p>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
          className={`${classPrefix}-infoShow`}
        >
          <p>Liq Price</p>
          <p>{showLiqPrice()}</p>
        </Stack>
      </>
    );
  };
  return (
    <MainCard
      classNames={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-dark`]: theme === ThemeType.dark,
      })}
    >
      <Stack spacing={0} alignItems="center">
        <p className="title">Add Position</p>
        <InfoShow
          topLeftText={"Payment"}
          bottomRightText={""}
          topRightText={`Balance: ${
            nestBalance
              ? parseFloat(formatUnits(nestBalance, 18)).toFixed(2).toString()
              : "----"
          } NEST`}
          topRightRed={!checkNESTBalance()}
        >
          <SingleTokenShow tokenNameOne={"NEST"} isBold />
          <input
            placeholder={"Input"}
            className={"input-middle"}
            value={nestInput}
            maxLength={32}
            onChange={(e) =>
              setNestInput(formatInputNumWithFour(e.target.value))
            }
            onBlur={(e: any) => {}}
          />
          <button
            className={"max-button"}
            onClick={() =>
              setNestInput(nestBalance ? parseFloat(formatUnits(nestBalance, 18)).toFixed(2) : "")
            }
          >
            MAX
          </button>
        </InfoShow>
        {info()}
        <MainButton
          className="mainButton"
          loading={buttonLoading()}
          disable={buttonDis()}
          onClick={() => {
            if (buttonDis()) {
              return;
            }
            props.onClose();
            buttonAction();
          }}
        >
          Confirm
        </MainButton>
      </Stack>
    </MainCard>
  );
};

export default FuturesAdd;
