import { formatUnits } from "ethers/lib/utils";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Popup from "reactjs-popup";
import { NFTMyDigDataType } from "..";
import NFTAuctionStatus from "../../../components/NFTAuctionStatus";
import NFTItem from "../../../components/NFTItem";
import useWeb3 from "../../../libs/hooks/useWeb3";
import { checkWidth } from "../../../libs/utils";
import { NFTAuctionModal, NFTDigModal } from "../NFTModal";
import "./styles";

const NFTReceived: FC = () => {
  const classPrefix = "NFTReceived";
  const auctionChoice = ["All", "In progress", "No auctioned"];
  const { account, chainId } = useWeb3();
  const modal = useRef<any>();
  const [auctionStatus, setAuctionStatus] = useState<number>(0);
  const [NFTAuctionData, setNFTAuctionData] = useState<Array<NFTMyDigDataType>>(
    []
  );
  const [NFTAuctionShowData, setNFTAuctionShowData] = useState<
    Array<NFTMyDigDataType>
  >([]);
  // get auction data
  const getAuctionData = useCallback(() => {
    if (!account || !chainId) {
      return;
    }
    (async () => {
      try {
        const data = await fetch(
          `https://api.hedge.red/api/nft/mynft/${account}/1000/${chainId?.toString()}`
        );
        const data_json = await data.json();
        setNFTAuctionData(data_json["value"]);
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
          ref={modal}
          trigger={
            <li key={`${classPrefix}+li+${index}+${indexData}`}>
              <NFTItem
                src={itemData.thumbnail}
                name={itemData.token_id}
                lever={parseInt(itemData.rarity)}
                endTime={itemData.end_time}
                value={formatUnits(itemData.price, 4)}
              />
            </li>
          }
        >
          {parseInt(itemData.end_auction) === 0 ? (
            <NFTAuctionModal info={itemData} />
          ) : (
            <NFTDigModal info={itemData} />
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
  // status
  const statusNum = (index: number) => {
    setAuctionStatus(index);
  };
  useEffect(() => {
    const nowTime = Date.now() / 1000;
    var newResult: Array<NFTMyDigDataType> = [];
    if (NFTAuctionData.length === 0) {
      return;
    }
    if (auctionStatus === 1) {
      for (let index = 0; index < NFTAuctionData.length; index++) {
        const element = NFTAuctionData[index];
        if (parseInt(element.end_time) > nowTime) {
          newResult.push(element);
        }
      }
    } else if (auctionStatus === 2) {
      for (let index = 0; index < NFTAuctionData.length; index++) {
        const element = NFTAuctionData[index];
        if (parseInt(element.end_time) <= nowTime) {
          newResult.push(element);
        }
      }
    } else {
      newResult = NFTAuctionData;
    }
    setNFTAuctionShowData(newResult);
  }, [NFTAuctionData, auctionStatus]);
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
      <ul className="line">{liData}</ul>
    </div>
  );
};

export default NFTReceived;
