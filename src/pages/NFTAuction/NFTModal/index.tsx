import classNames from "classnames";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { FC, useCallback, useEffect, useState } from "react";
import { NFTMyDigDataType } from "..";
import { TokenNest } from "../../../components/Icon";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import NFTLeverIcon from "../../../components/NFTLeverIcon";
import { useNESTNFTAuctionStart } from "../../../contracts/hooks/useNESTNFTAuctionTransaction";
import { useNESTNFTApprove } from "../../../contracts/hooks/useNFTTransaction";
import { NESTNFT, NESTNFTAuction } from "../../../libs/hooks/useContract";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import useTransactionListCon from "../../../libs/hooks/useTransactionInfo";
import { showEllipsisAddress } from "../../../libs/utils";
import "./styles";

export type NFTModalType = {
  title: string;
  info?: NFTMyDigDataType;
  children1?: JSX.Element;
  children2?: JSX.Element;
  children3?: JSX.Element;
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
        <div className={`${classPrefix}-title`}>{props.title}</div>
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
              Blockchain: BNB
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
};

export const NFTDigModal: FC<NFTDigModalProps> = ({ ...props }) => {
  const [showChildren3, setShowChildren3] = useState(false);
  const [timeNum, setTimeNum] = useState(0);
  const [inputValue, setInputValue] = useState<string>();
  const [NFTAllow, setNFTAllow] = useState<boolean>(false);
  const { txList } = useTransactionListCon();
  const NFTContract = NESTNFT();
  const NFTAuctionContract = NESTNFTAuction();

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

  useEffect(() => {
    checkNFTApprove()
  }, [checkNFTApprove, txList])

  // transaction
  const approve = useNESTNFTApprove(
    NFTAuctionContract?.address,
    BigNumber.from(props.info.token_id)
  );
  const startAuction = useNESTNFTAuctionStart(
    BigNumber.from(props.info.token_id),
    BigNumber.from((timeNum * 1200).toString()),
    inputValue ? parseUnits(inputValue, 18) : undefined
  );
  const children2 = () => {
    return (
      <div className={`${classPrefix}-info-text-confirmation`}>
        <div className={`${classPrefix}-info-text-confirmation-value`}>
          <p>Value:</p>
          <TokenNest />
          <span>{props.info.value}</span>
        </div>
        <MainButton onClick={() => setShowChildren3(true)}>
          Confirmation
        </MainButton>
      </div>
    );
  };
  const children3 = () => {
    const timeArray = [24, 48, 78];
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
            <input
              placeholder={props.info.starting_price}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
            <MainButton
              onClick={() => {
                if (!NFTAllow) {
                  approve();
                } else {
                  if (!inputValue) {return}
                  startAuction()
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
    />
  );
};

export type NFTAuctionModalType = {
  title: string;
};

export const NFTAuctionModal: FC<NFTAuctionModalType> = ({ ...props }) => {
  const children1 = () => {
    return (
      <p>
        Auction End Time<span>11h 2min 60s</span>
      </p>
    );
  };
  const children2 = () => {
    return (
      <div className={`${classPrefix}-info-text-bid`}>
        <div className={`${classPrefix}-info-text-bid-value`}>
          <p>Highest bid:</p>
          <TokenNest />
          <span>1000.00</span>
        </div>
        <input />
        <MainButton>Confirmation</MainButton>
      </div>
    );
  };
  const children3 = () => {
    return (
      <div className={`${classPrefix}-biddingHistory`}>
        <div className={`${classPrefix}-biddingHistory-title`}>
          Bidding History
        </div>
        <table>
          <thead>
            <tr>
              <th>Bidding price</th>
              <th>Extra refund</th>
              <th>Total refund</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2000</td>
              <td>190</td>
              <td>3000</td>
            </tr>
            <tr>
              <td>2000</td>
              <td>190</td>
              <td>3000</td>
            </tr>
            <tr>
              <td>2000</td>
              <td>190</td>
              <td>3000</td>
            </tr>
            <tr>
              <td>2000</td>
              <td>190</td>
              <td>3000</td>
            </tr>
            <tr>
              <td>2000</td>
              <td>190</td>
              <td>3000</td>
            </tr>
            <tr>
              <td>2000</td>
              <td>190</td>
              <td>3000</td>
            </tr>
            <tr>
              <td>2000</td>
              <td>190</td>
              <td>3000</td>
            </tr>
            <tr>
              <td>2000</td>
              <td>190</td>
              <td>3000</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <NFTModal
      title={props.title}
      children1={children1()}
      children2={children2()}
      children3={children3()}
    />
  );
};

export default NFTModal;
