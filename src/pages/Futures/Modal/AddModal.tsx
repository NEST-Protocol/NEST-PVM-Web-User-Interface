import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { FC, useMemo, useState } from "react";
import MainButton from "../../../components/MainButton/MainButton";
import NESTLine from "../../../components/NESTLine";
import NormalInfo from "../../../components/NormalInfo/NormalInfo";
import NESTInput from "../../../components/NormalInput/NESTInput";
import useFuturesAdd from "../../../hooks/useFuturesAdd";
import useWindowWidth from "../../../hooks/useWindowWidth";
import BaseDrawer from "../../Share/Modal/BaseDrawer";
import BaseModal from "../../Share/Modal/BaseModal";
import { FuturesPrice } from "../Futures";
import { t } from "@lingui/macro";
import { FuturesOrderService } from "../OrderList";
import DepositModal from "../../Share/Modal/DepositModal";

interface AddModalBaseProps {
  data: FuturesOrderService;
  price: FuturesPrice | undefined;
  onClose: (res?: boolean) => void;
}

const AddModalBase: FC<AddModalBaseProps> = ({ ...props }) => {
  const {
    checkBalance,
    showToSwap,
    showBalance,
    maxCallBack,
    nestAmount,
    setNestAmount,
    showPosition,
    showOpenPrice,
    showLiqPrice,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  } = useFuturesAdd(props.data, props.price, props.onClose);
  const [showDeposit, setShowDeposit] = useState(false);
  const input = useMemo(() => {
    return (
      <NESTInput
        checkBalance={checkBalance}
        showToSwap={showToSwap}
        showBalance={showBalance}
        maxCallBack={maxCallBack}
        nestAmount={nestAmount}
        changeNestAmount={(value: string) =>
          setNestAmount(value.formatInputNum4())
        }
        otherCallBack={() => setShowDeposit(true)}
      />
    );
  }, [
    checkBalance,
    maxCallBack,
    nestAmount,
    setNestAmount,
    showBalance,
    showToSwap,
  ]);
  const depositModal = useMemo(() => {
    return showDeposit ? (
      <DepositModal open={true} onClose={() => setShowDeposit(false)} />
    ) : (
      <></>
    );
  }, [showDeposit]);
  return (
    <Stack spacing={"24px"} width={"100%"}>
      {depositModal}
      {input}
      <NESTLine />
      <Stack spacing={"8px"}>
        <NormalInfo title={t`Position`} value={""} symbol={showPosition} />
        <NormalInfo
          title={t`Open Price`}
          value={showOpenPrice}
          symbol={"USDT"}
        />
        <NormalInfo title={t`Liq Price`} value={showLiqPrice} symbol={"USDT"} />
      </Stack>
      <MainButton
        title={mainButtonTitle}
        disable={mainButtonDis}
        isLoading={mainButtonLoading}
        onClick={mainButtonAction}
        style={{ fontSize: 14 }}
      />
    </Stack>
  );
};

interface AddModalProps {
  data: FuturesOrderService;
  price: FuturesPrice | undefined;
  open: boolean;
  onClose: (res?: boolean) => void;
}

const AddModal: FC<AddModalProps> = ({ ...props }) => {
  const { isMobile } = useWindowWidth();
  const view = useMemo(() => {
    return isMobile ? (
      <Drawer
        anchor={"bottom"}
        open={props.open}
        onClose={() => {
          props.onClose(undefined);
        }}
        sx={{
          "& .MuiPaper-root": { background: "none", backgroundImage: "none" },
        }}
        keepMounted
      >
        <BaseDrawer
          title={t`Add Position`}
          onClose={() => {
            props.onClose(undefined);
          }}
        >
          <AddModalBase
            data={props.data}
            price={props.price}
            onClose={props.onClose}
          />
        </BaseDrawer>
      </Drawer>
    ) : (
      <Modal
        open={props.open}
        onClose={() => {
          props.onClose(undefined);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <BaseModal
            title={t`Add Position`}
            onClose={() => {
              props.onClose(undefined);
            }}
          >
            <AddModalBase
              data={props.data}
              price={props.price}
              onClose={props.onClose}
            />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props]);

  return view;
};

export default AddModal;
