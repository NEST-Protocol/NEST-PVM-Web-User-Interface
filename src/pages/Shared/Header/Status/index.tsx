import { Trans } from "@lingui/macro";
import classNames from "classnames";
import { FC, useRef } from "react";
import Popup from "reactjs-popup";
import {DashboardIcon, DashboardWhiteIcon, WhiteLoading} from "../../../../components/Icon";
import useTransactionListCon from "../../../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../../../libs/hooks/useWeb3";
import {showEllipsisAddress2} from "../../../../libs/utils";
import Modal from "./Modal";
import SelectNetwork from "./SelectNetwork";
import "./styles";
import WalletModal from "./WalletModal";
import {Stack} from "@mui/material";
import {Link} from "react-router-dom";
import useThemes, {ThemeType} from "../../../../libs/hooks/useThemes";

const ConnectStatus: FC = () => {
  const { account } = useWeb3();
  const modal = useRef<any>();
  const classPrefix = "connectStatus";
  const { pendingList } = useTransactionListCon();
  const { theme } = useThemes()
  return (
    <div
      className={classNames({
        [`${classPrefix}`]: true,
        [`isConnect`]: false,
      })}
    >

      <SelectNetwork/>

      <Stack className={'dashboard'}>
        { theme === ThemeType.dark ? <DashboardWhiteIcon/> : <DashboardIcon/> }
        <p>
          <Link to={'/dashboard'}>
            Dashboard
          </Link>
        </p>
      </Stack>

      {account === undefined ? (
        <Popup
          modal
          ref={modal}
          trigger={
            <button className={"fort-button"}>
              <Trans>Connect Wallet</Trans>
            </button>
          }
        >
          <Modal onClose={() => modal.current.close()} />
        </Popup>
      ) : (
        <Popup
          modal
          ref={modal}
          trigger={
            <button
              className={classNames({
                [`fort-button`]: true,
                [`showNum`]: pendingList.length > 0,
              })}
            >
              <div className={"transactionNum"}>
                <WhiteLoading className={"animation-spin"} />
                <p>{pendingList.length}</p>
              </div>
              <p>{showEllipsisAddress2(account || "")}</p>
            </button>
          }
        >
          <WalletModal onClose={() => modal.current.close()} />
        </Popup>
      )}
    </div>
  );
};

export default ConnectStatus;
