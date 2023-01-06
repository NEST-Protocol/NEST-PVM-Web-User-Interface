import { formatUnits } from "ethers/lib/utils";
import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Popup from "reactjs-popup";
import { NFTMyDigDataType } from "..";
import NFTAuctionStatus from "../../../components/NFTAuctionStatus";
import NFTItem from "../../../components/NFTItem";
import useWeb3 from "../../../libs/hooks/useWeb3";
import { checkWidth } from "../../../libs/utils";
import { NFTAuctionModal } from "../NFTModal";
import "./styles";

const NFTOfferView: FC = () => {
  const classPrefix = "NFTOfferView";
  const { account, chainId } = useWeb3();
  const modal = useRef<any>();
  const [auctionStatus, setAuctionStatus] = useState<number>(0);
  const [NFTAuctionData, setNFTAuctionData] = useState<Array<NFTMyDigDataType>>(
    []
  );
  const [NFTAuctionShowData, setNFTAuctionShowData] = useState<
    Array<NFTMyDigDataType>
  >([]);
  const auctionChoice = ["All", "Leading Bids", "Losing Bids"];
  // get auction data
  const getAuctionData = useCallback(() => {
    if (!account || !chainId) {
      return;
    }
    (async () => {
      try {
        const data = await fetch(
          `https://api.nestfi.net/api/nft/myauction/${account}/1000/${chainId?.toString()}`
        );
        const data_json = await data.json();
        setNFTAuctionData(data_json["value"] ?? []);
      } catch (error) {
        console.log(error);
        setNFTAuctionData([]);
      }
    })();
  }, [account, chainId]);
  const dataArray = (num: number) => {
    var result = [];
    for (var i = 0; i < NFTAuctionShowData.length; i += num) {
      result.push(NFTAuctionShowData.slice(i, i + num));
    }
    return result;
  };
  const liData = dataArray(checkWidth() ? 5 : 2).map((item, index) => {
    const ul = item.map((itemData, indexData) => {
      return (
        <Popup
          modal
          key={`${classPrefix}+li+${index}+${indexData}`}
          ref={modal}
          className={"NFTAuction"}
          nested
          trigger={
            <li>
              <NFTItem
                src={itemData.thumbnail}
                name={itemData.token_id}
                lever={parseInt(itemData.rarity)}
                endTime={itemData.end_time}
                value={formatUnits(itemData.price, 2)}
              />
            </li>
          }
        >
          {(close: MouseEventHandler<HTMLButtonElement>) => (
            <NFTAuctionModal info={itemData} onClose={close} />
          )}
        </Popup>
      );
    });
    return (
      <li key={`${classPrefix}+li+${index}`}>
        <ul>{ul}</ul>
      </li>
    );
  });
  // update
  useEffect(() => {
    getAuctionData();
    const time = setInterval(() => {
      getAuctionData();
    }, 10000);
    return () => {
      clearTimeout(time);
    };
  }, [getAuctionData]);

  const statusNum = (index: number) => {
    setAuctionStatus(index);
  };
  useEffect(() => {
    var newArray = [];
    const nowTime = Date.now() / 1000;
    if (auctionStatus === 1) {
      newArray = NFTAuctionData.filter((item) => {
        return parseInt(item.end_time) > nowTime;
      });
    } else if (auctionStatus === 2) {
      newArray = NFTAuctionData.filter((item) => {
        return (
          parseInt(item.end_time) > nowTime &&
          item.bidder.toLocaleLowerCase() !== account?.toLocaleLowerCase()
        );
      });
    } else {
      newArray = NFTAuctionData;
    }
    setNFTAuctionShowData(newArray);
  }, [NFTAuctionData, account, auctionStatus]);
  return (
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-choice`}>
        <div className={`${classPrefix}-choice-top`}>
          <NFTAuctionStatus
            data={auctionChoice}
            classString={"auction"}
            selectedVoid={statusNum}
          />
        </div>
      </div>
      {NFTAuctionShowData.length > 0 ? (
        <ul className="line">{liData}</ul>
      ) : (
        <div className={`${classPrefix}-noData`}>No offers to display</div>
      )}
    </div>
  );
};

export default NFTOfferView;
