import { Slider } from "antd";
import classNames from "classnames";
import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Popup from "reactjs-popup";
import NFTAuctionStatus from "../../../components/NFTAuctionStatus";
import NFTItem from "../../../components/NFTItem";
import NFTLeverIcon from "../../../components/NFTLeverIcon";
import { NFTAuctionModal } from "../NFTModal";
import "./styles";
import { checkWidth } from "../../../libs/utils";
import { NFTMyDigDataType } from "..";
import useWeb3 from "../../../libs/hooks/useWeb3";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const NFTAuctionView: FC = () => {
  const classPrefix = "NFTAuctionView";
  const { chainId } = useWeb3();
  const [showNFTModal, setShowNFTModal] = useState<NFTMyDigDataType>();
  const auctionChoice = ["All", "Ending soon", "Recently start"];
  const [NFTAuctionData, setNFTAuctionData] = useState<Array<NFTMyDigDataType>>(
    []
  );
  const [NFTAuctionShowData, setNFTAuctionShowData] = useState<
    Array<NFTMyDigDataType>
  >([]);
  const [auctionStatus, setAuctionStatus] = useState<number>(0);
  const [nestValue, setNestValue] = useState<Array<number>>([0.01, 99999]);
  const modal = useRef<any>();
  const [lever, setLever] = useState(0);
  const leverLi = [
    "All",
    <NFTLeverIcon lever={1} />,
    <NFTLeverIcon lever={5} />,
    <NFTLeverIcon lever={10} />,
  ].map((item, index) => {
    return index === 1 ? (
      <li
        key={`${index}+NFTAuctionView-lever`}
        className={classNames({
          [`selected`]: lever === index,
        })}
        onClick={() => setLever(index)}
      >
        {item}
      </li>
    ) : (
      <li
        key={`${index}+NFTAuctionView-lever`}
        className={classNames({
          [`selected`]: lever === index,
        })}
        onClick={() => setLever(index)}
      >
        {item}
      </li>
    );
  });
  // get auction data
  const getAuctionData = useCallback(() => {
    if (!chainId) {
      return;
    }
    (async () => {
      try {
        const data = await fetch(
          `https://api.nestfi.net/api/nft/auction/list/1000/${chainId?.toString()}`
        );
        const data_json = await data.json();
        setNFTAuctionData(data_json["value"] ?? []);
      } catch (error) {
        console.log(error);
        setNFTAuctionData([]);
      }
    })();
  }, [chainId]);
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
        <li
          key={`${classPrefix}+li+${index}+${indexData}`}
          onClick={() => setShowNFTModal(itemData)}
        >
          <NFTItem
            src={itemData.thumbnail}
            name={itemData.token_id}
            lever={parseInt(itemData.rarity)}
            endTime={itemData.end_time}
            value={formatUnits(itemData.price, 2)}
          />
        </li>
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
    const rarityArray = (array: Array<NFTMyDigDataType>) => {
      if (lever === 0) {
        return array;
      }
      const newArray = array.filter((item) => {
        const leverToRarity = () => {
          if (lever === 1) {
            return 1;
          } else if (lever === 2) {
            return 5;
          } else if (lever === 3) {
            return 10;
          }
        };
        return parseInt(item.rarity) === leverToRarity();
      });
      return newArray;
    };
    const nestValueArray = (array: Array<NFTMyDigDataType>) => {
      const min = parseUnits(nestValue[0].toString(), 2);
      const max = parseUnits(nestValue[1].toString(), 2);
      if (nestValue[0] === 0.01 && nestValue[1] === 99999) {
        return array;
      }
      const newArray = array.filter((item) => {
        return (
          BigNumber.from(item.price).lte(max) &&
          BigNumber.from(item.price).gte(min)
        );
      });
      return newArray;
    };
    const filterArray = (array: Array<NFTMyDigDataType>) => {
      var newArray = array;
      if (auctionStatus === 1) {
        const len = newArray.length;
        if (len >= 1) {
          for (let i = 0; i < len - 1; i++) {
            for (let j = 0; j < len - 1 - i; j++) {
              if (newArray[j].end_time > newArray[j + 1].end_time) {
                let temp = newArray[j + 1];
                newArray[j + 1] = newArray[j];
                newArray[j] = temp;
              }
            }
          }
        }
        return newArray;
      } else if (auctionStatus === 2) {
        const len = newArray.length;
        if (len >= 1) {
          for (let i = 0; i < len - 1; i++) {
            for (let j = 0; j < len - 1 - i; j++) {
              if (newArray[j].start_time > newArray[j + 1].start_time) {
                let temp = newArray[j + 1];
                newArray[j + 1] = newArray[j];
                newArray[j] = temp;
              }
            }
          }
        }
        return newArray;
      } else {
        return array;
      }
    };
    setNFTAuctionShowData(
      filterArray(nestValueArray(rarityArray(NFTAuctionData)))
    );
  }, [auctionStatus, nestValue, lever, NFTAuctionData]);
  return (
    <div className={`${classPrefix}`}>
      {showNFTModal ? (
        <Popup
          ref={modal}
          className={"NFTAuction"}
          open
          nested
          onClose={() => {
            setShowNFTModal(undefined);
          }}
        >
          {(close: MouseEventHandler<HTMLButtonElement>) => (
            <NFTAuctionModal info={showNFTModal} onClose={close} />
          )}
        </Popup>
      ) : null}
      <div className={`${classPrefix}-choice`}>
        <div className={`${classPrefix}-choice-top`}>
          <NFTAuctionStatus
            data={auctionChoice}
            classString={"auction"}
            selectedVoid={statusNum}
          />
          <div className={`${classPrefix}-choice-top-lever`}>
            <p className={`${classPrefix}-choice-top-lever-title`}>Rarity:</p>
            <ul>{leverLi}</ul>
          </div>
        </div>
        <div className={`${classPrefix}-choice-bottom`}>
          <p>
            Price:<span>NEST</span>
          </p>
          <Slider
            range={{ draggableTrack: true }}
            max={99999}
            min={0.01}
            defaultValue={[0.01, 99999]}
            onAfterChange={(e: any) => {
              setNestValue(e);
            }}
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

export default NFTAuctionView;
