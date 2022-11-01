import classNames from "classnames";
import { BigNumber } from "ethers";
import { MaxUint256 } from "@ethersproject/constants";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { NFTMyDigDataType } from "..";
import {
  NFTDownIcon,
  NFTUpIcon,
  TokenNest,
  XIcon,
} from "../../../components/Icon";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import NFTLeverIcon from "../../../components/NFTLeverIcon";
import { useERC20Approve } from "../../../contracts/hooks/useERC20Approve";
import {
  useNESTNFTAuction,
  useNESTNFTAuctionEnd,
  useNESTNFTAuctionStart,
} from "../../../contracts/hooks/useNESTNFTAuctionTransaction";
import { useNESTNFTApprove } from "../../../contracts/hooks/useNFTTransaction";
import {
  NESTNFTAuctionContract,
  tokenList,
} from "../../../libs/constants/addresses";
import {
  getERC20Contract,
  NESTNFT,
  NESTNFTAuction,
} from "../../../libs/hooks/useContract";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import useTransactionListCon, {
  TransactionType,
} from "../../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../../libs/hooks/useWeb3";
import {
  checkWidth,
  downTime,
  formatPVMWinInputNum,
  showEllipsisAddress,
} from "../../../libs/utils";
import "./styles";
import Popup from "reactjs-popup";
import NFTAuctionTips from "../NFTAuctionTips";

export type NFTModalType = {
  title: string;
  info?: NFTMyDigDataType;
  children1?: JSX.Element;
  children2?: JSX.Element;
  children3?: JSX.Element;
  onClose: MouseEventHandler<HTMLButtonElement>;
};
const classPrefix = "NFTModal";
const NFTModal: FC<NFTModalType> = ({ ...props }) => {
  const { theme } = useThemes();
  if (!props.info) {
    return <></>;
  }
  const NFTData = props.info;
  return (
    <div
      className={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-dark`]: theme === ThemeType.dark,
      })}
    >
      <MainCard>
        <div className={`${classPrefix}-title`}>
          <button className={`${classPrefix}-title-leftButton`}></button>
          <p className={`${classPrefix}-title-title`}>{props.title}</p>
          <button
            className={`${classPrefix}-title-rightButton`}
            onClick={props.onClose}
          >
            {checkWidth() ? <></> : <XIcon />}
          </button>
        </div>
        <div className={`${classPrefix}-info`}>
          <div className={`${classPrefix}-info-img`}>
            <img
              src={
                "https://" +
                NFTData.thumbnail.substring(7, NFTData.thumbnail.length) +
                ".ipfs.w3s.link"
              }
              alt="NEST NFT"
            />
          </div>
          <div className={`${classPrefix}-info-text`}>
            <div className={`${classPrefix}-info-text-leftTime`}>
              {props.children1}
            </div>
            <div className={`${classPrefix}-info-text-name`}>
              <p>{NFTData.token_name}</p>
              <NFTLeverIcon lever={parseInt(NFTData.rarity)} />
            </div>
            <div className={`${classPrefix}-info-text-string`}>
              {NFTData.description}
            </div>
            <div className={`${classPrefix}-info-text-contract`}>
              <p>Contract address:</p>
              <a href="w">{showEllipsisAddress(NFTData.token_address || "")}</a>
            </div>
            <div className={`${classPrefix}-info-text-chain`}>
              <p>Blockchain:</p>
              <span>BNB</span>
            </div>
            {props.children2}
          </div>
        </div>
        {props.children3}
      </MainCard>
    </div>
  );
};

type NFTDigModalProps = {
  info: NFTMyDigDataType;
  onClose: MouseEventHandler<HTMLButtonElement>;
};

export const NFTDigModal: FC<NFTDigModalProps> = ({ ...props }) => {
  const [showChildren3, setShowChildren3] = useState(false);
  const [timeNum, setTimeNum] = useState(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [NFTAllow, setNFTAllow] = useState<boolean>(false);
  const { pendingList, txList } = useTransactionListCon();
  const NFTContract = NESTNFT();
  const modal = useRef<any>();
  const NFTAuctionContract = NESTNFTAuction();
  const timeArray = [24, 48, 78];
  // mainButton pending
  const mainButtonState = () => {
    const pendingTransaction = pendingList.filter(
      (item) =>
        item.type === TransactionType.NESTNFTAuctionStart ||
        item.type === TransactionType.approve
    );
    return pendingTransaction.length > 0 ? true : false;
  };
  // check
  const checkNFTApprove = useCallback(() => {
    if (!NFTContract || !NFTAuctionContract) {
      return;
    }
    (async () => {
      const allow = await NFTContract.getApproved(props.info.token_id);
      if (
        allow.toString().toLocaleLowerCase() ===
        NFTAuctionContract.address.toLocaleLowerCase()
      ) {
        setNFTAllow(true);
      }
    })();
  }, [NFTAuctionContract, NFTContract, props.info.token_id]);
  const checkMainButton = () => {
    if (mainButtonState()) {
      return false;
    }
    if (!NFTAllow) {
      return true;
    }
    if (inputValue === "") {
      return false;
    }
    return true;
  };

  useEffect(() => {
    checkNFTApprove();
  }, [checkNFTApprove, txList]);

  // transaction
  const approve = useNESTNFTApprove(
    NFTAuctionContract?.address,
    BigNumber.from(props.info.token_id)
  );
  const startAuction = useNESTNFTAuctionStart(
    BigNumber.from(props.info.token_id),
    BigNumber.from((timeArray[timeNum] * 3600).toString()),
    inputValue ? parseUnits(inputValue, 2) : undefined
  );
  const clickShowChildren3 = () => {
    setShowChildren3(true);
  };
  const children2 = () => {
    return (
      <div className={`${classPrefix}-info-text-confirmation`}>
        <div className={`${classPrefix}-info-text-confirmation-value`}>
          <p>Value:</p>
          <div>
            <TokenNest />
            <span>{props.info.value}</span>
          </div>
        </div>
        {showChildren3 ? (
          <div
            className={`${classPrefix}-info-text-confirmation-auction`}
            onClick={() => setShowChildren3(!showChildren3)}
          >
            <p>Go to auction</p>
            {<NFTUpIcon />}
          </div>
        ) : (
          <Popup
            modal
            ref={modal}
            className={"NFTAuctionTips"}
            nested
            trigger={
              <div className={`${classPrefix}-info-text-confirmation-auction`}>
                <p>Go to auction</p>
                {<NFTDownIcon />}
              </div>
            }
          >
            <NFTAuctionTips
              onClose={() => modal.current.close()}
              click={clickShowChildren3}
            />
          </Popup>
        )}
        {/* <div
          className={`${classPrefix}-info-text-confirmation-auction`}
          onClick={() => setShowChildren3(!showChildren3)}
        >
          <p>Go to auction</p>
          {showChildren3 ? <NFTUpIcon /> : <NFTDownIcon />}
        </div> */}
      </div>
    );
  };
  const children3 = () => {
    const timeButton = timeArray.map((item, index) => {
      return (
        <button
          key={`${index}+AuctionTime`}
          className={classNames({
            [`selected`]: index === timeNum,
          })}
          onClick={() => setTimeNum(index)}
        >
          {item} Hours
        </button>
      );
    });
    return !showChildren3 ? (
      <></>
    ) : (
      <div className={`${classPrefix}-auction`}>
        <div className={`${classPrefix}-auction-time`}>
          <div className={`${classPrefix}-auction-time-title`}>
            Auction Time
          </div>
          <div className={`${classPrefix}-auction-time-choice`}>
            {timeButton}
          </div>
        </div>
        <div className={`${classPrefix}-auction-price`}>
          <div className={`${classPrefix}-auction-price-title`}>
            Starting Price
          </div>
          <div className={`${classPrefix}-auction-price-input`}>
            <div className={`${classPrefix}-auction-price-input-input`}>
              <input
                placeholder={props.info.starting_price}
                value={inputValue}
                maxLength={32}
                onChange={(e) => {
                  setInputValue(formatPVMWinInputNum(e.target.value));
                }}
              />
            </div>
            <MainButton
              disable={!checkMainButton()}
              loading={mainButtonState()}
              onClick={() => {
                if (!checkMainButton()) {
                  return;
                }
                if (!NFTAllow) {
                  approve();
                } else {
                  if (!inputValue) {
                    return;
                  }
                  startAuction();
                }
              }}
            >
              {NFTAllow ? "Confirmation" : "Approve"}
            </MainButton>
          </div>
        </div>
      </div>
    );
  };
  return (
    <NFTModal
      title={"My Dig"}
      info={props.info}
      children2={children2()}
      children3={children3()}
      onClose={props.onClose}
    />
  );
};

type NFTAuctionHistoryType = {
  address: string;
  time: string;
  bid: string;
  refund: string;
};

export const NFTAuctionModal: FC<NFTDigModalProps> = ({ ...props }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const { chainId, account, library } = useWeb3();
  const [nestAllowance, setNestAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [timeString, setTimeString] = useState<string>();
  const [endAuction, setEndAuction] = useState<boolean>(true);
  const [historyData, setHistoryData] = useState<Array<NFTAuctionHistoryType>>(
    []
  );
  const { pendingList, txList } = useTransactionListCon();
  // transaction
  const auctionTransaction = useNESTNFTAuction(
    BigNumber.from(props.info.index),
    inputValue ? parseUnits(inputValue, 2) : undefined
  );
  const approve = useERC20Approve(
    "NEST",
    MaxUint256,
    chainId ? NESTNFTAuctionContract[chainId] : undefined
  );
  const endAuctionTransaction = useNESTNFTAuctionEnd(
    BigNumber.from(props.info.index)
  );

  // approve
  useEffect(() => {
    if (!chainId || !account || !library) {
      return;
    }
    const nestToken = getERC20Contract(
      tokenList["NEST"].addresses[chainId],
      library,
      account
    );
    if (!nestToken) {
      setNestAllowance(BigNumber.from("0"));
      return;
    }
    (async () => {
      const allowance = await nestToken.allowance(
        account,
        NESTNFTAuctionContract[chainId]
      );
      setNestAllowance(allowance);
    })();
  }, [account, chainId, library, txList]);
  // time
  useEffect(() => {
    const getTime = () => {
      if (props.info.end_time) {
        const endTime = parseInt(props.info.end_time);
        const nowTime = Date.now() / 1000;
        if (nowTime > endTime) {
          // end
          setTimeString("---");
          setEndAuction(true);
        } else {
          // show
          setTimeString(downTime(endTime - nowTime));
          setEndAuction(false);
        }
      }
    };
    getTime();
    const time = setInterval(() => {
      getTime();
    }, 1000);
    return () => {
      clearTimeout(time);
    };
  }, [props.info.end_time]);
  // history
  const getHistory = useCallback(() => {
    (async () => {
      try {
        const data = await fetch(
          `https://api.hedge.red/api/nft/auction/history/0xfb9Da3d9B76577CAc3616D5d0cf6b7d51B98870F/${
            props.info.token_id
          }/${chainId?.toString()}`
        );
        const data_json = await data.json();
        setHistoryData(data_json["value"] ?? []);
      } catch (error) {
        console.log(error);
        setHistoryData([]);
      }
    })();
  }, [chainId, props.info.token_id]);
  useEffect(() => {
    getHistory();
    const time = setInterval(() => {
      getHistory();
    }, 30000);
    return () => {
      clearTimeout(time);
    };
  }, [getHistory]);
  const historyTr = () => {
    const nowTime = Date.now() / 1000;
    const showData = [...historyData];
    return showData.reverse().map((item, index) => {
      var showHighLight =
        account?.toLocaleLowerCase() === item.address.toLocaleLowerCase();

      return (
        <tr
          key={`history+nft+${index}`}
          className={classNames({
            [`high`]: showHighLight,
          })}
        >
          <td>{showEllipsisAddress(item.address)}</td>
          <td>{formatUnits(item.bid ?? 0, 2)}</td>
          <td>{`${((nowTime - parseInt(item.time)) / 3600).toFixed(
            2
          )} hours ago`}</td>
          <td>{index === 0 ? "/" : formatUnits(item.refund, 2)}</td>
          <td>
            {index === 0
              ? "Highest bid"
              : formatUnits(
                  BigNumber.from(item.refund).add(BigNumber.from(item.bid)),
                  2
                )}
          </td>
        </tr>
      );
    });
  };
  const historyLi = () => {
    const nowTime = Date.now() / 1000;
    const showData = [...historyData];
    return showData.reverse().map((item, index) => {
      var showHighLight =
        account?.toLocaleLowerCase() === item.address.toLocaleLowerCase();
      return (
        <li
          key={`history+nft+${index}+li`}
          className={classNames({
            [`high`]: showHighLight,
          })}
        >
          <ul>
            <li>
              <p>Address</p>
              <span>{showEllipsisAddress(item.address)}</span>
            </li>
            <li>
              <p>Bid</p>
              <span>{formatUnits(item.bid ?? 0, 2)}</span>
            </li>
            <li>
              <p>Time</p>
              <span>{`${((nowTime - parseInt(item.time)) / 3600).toFixed(
                2
              )} hours ago`}</span>
            </li>
            <li>
              <p>Extra refund</p>
              <span>{index === 0 ? "/" : formatUnits(item.refund, 2)}</span>
            </li>
            <li>
              <p>Total refund</p>
              <span>
                {index === 0
                  ? "Highest bid"
                  : formatUnits(
                      BigNumber.from(item.refund).add(BigNumber.from(item.bid)),
                      2
                    )}
              </span>
            </li>
          </ul>
        </li>
      );
    });
  };
  // mainButton pending
  const mainButtonState = () => {
    const pendingTransaction = pendingList.filter(
      (item) =>
        item.type === TransactionType.NESTNFTAuctionEnd ||
        item.type === TransactionType.NESTNFTAuction ||
        item.type === TransactionType.approve
    );
    return pendingTransaction.length > 0 ? true : false;
  };
  const children1 = () => {
    return endAuction ? (
      <></>
    ) : (
      <p>
        <span>Auction End Time</span>
        <span>{timeString}</span>
      </p>
    );
  };
  const children2 = () => {
    const addPriceButton = () => {
      const buttonText = ["+10%", "+50%", "MAX"];
      return buttonText.map((item, index) => {
        return (
          <button
            key={`${index}+addPriceButton`}
            value={index}
            onClick={(e) => {
              const buttonValue = e.currentTarget.value;
              var newInputValue: string = "";
              const nowPrice = BigNumber.from(props.info.price);
              if (buttonValue === "0") {
                newInputValue = formatUnits(
                  nowPrice.add(nowPrice.div(BigNumber.from("10"))),
                  2
                ).toString();
              } else if (buttonValue === "1") {
                newInputValue = formatUnits(
                  nowPrice.add(nowPrice.div(BigNumber.from("2"))),
                  2
                ).toString();
              } else if (buttonValue === "2") {
                newInputValue = formatUnits(
                  nowPrice.add(
                    nowPrice
                      .mul(BigNumber.from("70"))
                      .div(BigNumber.from("100"))
                  ),
                  2
                ).toString();
              }
              setInputValue(newInputValue);
            }}
          >
            {item}
          </button>
        );
      });
    };
    if (!account) {
      return <></>;
    }
    const checkAllowance = () => {
      if (!inputValue) {
        return true;
      }
      if (nestAllowance.lt(parseUnits(inputValue, 18))) {
        return false;
      }
      return true;
    };
    const checkMainButton = () => {
      if (mainButtonState()) {
        return false;
      }
      if (!checkAllowance()) {
        return true;
      }
      if (
        inputValue === "" ||
        parseUnits(inputValue, 18).eq(BigNumber.from("0"))
      ) {
        return false;
      }
      return true;
    };
    const checkInitiator = () => {
      if (
        props.info.initiator.toLocaleLowerCase() === account.toLocaleLowerCase()
      ) {
        return true;
      } else {
        return false;
      }
    };
    const checkNoMe = () => {
      if (
        props.info.initiator.toLocaleLowerCase() !==
          account.toLocaleLowerCase() &&
        props.info.bidder.toLocaleLowerCase() !== account.toLocaleLowerCase()
      ) {
        return true;
      }
      return false;
    };
    const showClaimButton = () => {
      return checkNoMe() ? (
        <></>
      ) : (
        <MainButton
          disable={!checkMainButton()}
          loading={mainButtonState()}
          onClick={() => {
            if (!checkMainButton()) {
              return;
            }
            endAuctionTransaction();
          }}
        >
          {"claim"}
        </MainButton>
      );
    };
    const claimPrice = () => {
      if (historyData.length > 0) {
        const firstPrice = parseInt(historyData[0].bid);
        const lastPrice = parseInt(historyData[historyData.length - 1].bid);
        return firstPrice + (lastPrice - firstPrice) / 2;
      }
      return 0;
    };
    return (
      <div className={`${classPrefix}-info-text-bid`}>
        <div className={`${classPrefix}-info-text-bid-value`}>
          {endAuction ? (
            <p>{!checkInitiator() ? "Transaction price" : "Claim price"}</p>
          ) : (
            <p>Highest bid:</p>
          )}
          <div>
            <TokenNest />
            <span>
              {endAuction
                ? !checkInitiator()
                  ? formatUnits(props.info.price, 2)
                  : formatUnits(parseInt(claimPrice().toString()), 2)
                : formatUnits(props.info.price, 2)}
            </span>
          </div>
        </div>
        {endAuction ? (
          <></>
        ) : (
          <div className={`${classPrefix}-info-text-bid-input`}>
            <input
              maxLength={32}
              placeholder={"Input"}
              value={inputValue}
              onChange={(e) => {
                setInputValue(formatPVMWinInputNum(e.target.value));
              }}
            />
          </div>
        )}
        {endAuction ? (
          <></>
        ) : (
          <div className={`${classPrefix}-info-text-bid-addPrice`}>
            {addPriceButton()}
          </div>
        )}

        {endAuction ? (
          showClaimButton()
        ) : (
          <MainButton
            disable={!checkMainButton()}
            loading={mainButtonState()}
            onClick={() => {
              if (!checkMainButton()) {
                return;
              }
              if (checkAllowance()) {
                auctionTransaction();
              } else {
                approve();
              }
            }}
          >
            {checkAllowance() ? "Bid" : "Approve"}
          </MainButton>
        )}
      </div>
    );
  };
  const children3 = () => {
    return (
      <div className={`${classPrefix}-biddingHistory`}>
        <div className={`${classPrefix}-biddingHistory-title`}>
          Bidding History
        </div>
        {checkWidth() ? (
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Bid</th>
                <th>Time</th>
                <th>Extra refund</th>
                <th>Total refund</th>
              </tr>
            </thead>
            <tbody>{historyTr()}</tbody>
          </table>
        ) : (
          <ul>{historyLi()}</ul>
        )}
        {historyData.length === 0 ? (
          <div className={`${classPrefix}-biddingHistory-noData`}>
            No offers to display
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  };
  return (
    <NFTModal
      title={"Auction"}
      info={props.info}
      children1={children1()}
      children2={children2()}
      children3={children3()}
      onClose={props.onClose}
    />
  );
};

export default NFTModal;
