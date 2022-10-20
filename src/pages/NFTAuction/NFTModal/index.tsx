import classNames from "classnames";
import { FC, useState } from "react";
import { TokenNest } from "../../../components/Icon";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import NFTLeverIcon from "../../../components/NFTLeverIcon";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import { showEllipsisAddress } from "../../../libs/utils";
import { MyDig } from "../testDaata";
import "./styles";

export type NFTModalType = {
  title: string;
  children1?: JSX.Element;
  children2?: JSX.Element;
  children3?: JSX.Element;
};
const classPrefix = "NFTModal";
const NFTModal: FC<NFTModalType> = ({ ...props }) => {

  const { theme } = useThemes();
  
  return (
    <div className={classNames({
      [`${classPrefix}`]: true,
      [`${classPrefix}-dark`]: theme === ThemeType.dark,
    })}>
      <MainCard>
        <div className={`${classPrefix}-title`}>{props.title}</div>
        <div className={`${classPrefix}-info`}>
          <div className={`${classPrefix}-info-img`}>
            <img src={MyDig[0].img} alt="NEST NFT" />
          </div>
          <div className={`${classPrefix}-info-text`}>
            <div className={`${classPrefix}-info-text-leftTime`}>
              {props.children1}
            </div>
            <div className={`${classPrefix}-info-text-name`}>
              <p>what's wrong?</p>
              <NFTLeverIcon lever={5} />
            </div>
            <div className={`${classPrefix}-info-text-string`}>
              sdfksjhfjksd sjhdfjsdhfj shjkfhks sdfjjasd ajkasdh fajsdhj a
              sjdfjhssdfksjhfjksd sjhdfjsdhfj shjkfhks sdfjjasd ajkasdh fajsdhj
              a sjdfjhssdfksjhfjksd sjhdfjsdhfj shjkfhks sdfjjasd ajkasdh
              fajsdhj a sjdfjhssdfksjhfjksd sjhdfjsdhfj shjkfhks sdfjjasd
              ajkasdh fajsdhj a sjdfjhssdfksjhfjksd sjhdfjsdhfj shjkfhks
              sdfjjasd ajkasdh fajsdhj a sjdfjhssdfksjhfjksd sjhdfjsdhfj
              shjkfhks sdfjjasd ajkasdh fajsdhj a sjdfjhs
            </div>
            <div className={`${classPrefix}-info-text-contract`}>
              <p>Contract address:</p>
              <a href="w">
                {showEllipsisAddress("0x34276452834523645264572342" || "")}
              </a>
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

export type NFTDigModalType = {
  title: string;
};

export const NFTDigModal: FC<NFTDigModalType> = ({ ...props }) => {
  const [showChildren3, setShowChildren3] = useState(false);
  const [timeNum, setTimeNum] = useState(0);
  const children2 = () => {
    return (
      <div className={`${classPrefix}-info-text-confirmation`}>
        <div className={`${classPrefix}-info-text-confirmation-value`}>
          <p>Value:</p>
          <TokenNest />
          <span>1000.00</span>
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
            <input />
            <MainButton>Confirmation</MainButton>
          </div>
        </div>
      </div>
    );
  };
  return (
    <NFTModal
      title={props.title}
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
    return <p>Auction End Time<span>11h 2min 60s</span></p>;
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
