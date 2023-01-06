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
import { NFTMyDigDataType } from "..";
import NFTItem from "../../../components/NFTItem";
import NFTLeverIcon from "../../../components/NFTLeverIcon";
import useWeb3 from "../../../libs/hooks/useWeb3";
import { checkWidth } from "../../../libs/utils";
import { NFTMarketModal } from "../NFTModal";
import "./styles";

const NFTWhiteList: FC = () => {
  const classPrefix = "NFTWhiteList";
  const { chainId } = useWeb3();
  const [showModal, setShowModal] = useState<NFTMyDigDataType>();
  const [lever, setLever] = useState(0);
  const [NFTMarketData, setNFTMarketData] = useState<Array<NFTMyDigDataType>>(
    []
  );
  const [NFTMarketShowData, setNFTMarketShowData] = useState<
    Array<NFTMyDigDataType>
  >([]);
  const modal = useRef<any>();
  const leverLi = [
    "All",
    <NFTLeverIcon lever={1} />,
    <NFTLeverIcon lever={5} />,
    <NFTLeverIcon lever={10} />,
  ].map((item, index) => {
    return index === 1 ? (
      <li
        key={`${index}+NFTMarketView-lever`}
        className={classNames({
          [`selected`]: lever === index,
        })}
        onClick={() => setLever(index)}
      >
        {item}
      </li>
    ) : (
      <li
        key={`${index}+NFTMarketView-lever`}
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
  const getMarketData = useCallback(() => {
    if (!chainId) {
      return;
    }
    (async () => {
      try {
        const data = await fetch(
          `https://api.nestfi.net/api/nft/whitelist/market/${chainId?.toString()}`
        );
        const data_json = await data.json();
        setNFTMarketData(data_json["value"] ?? []);
      } catch (error) {
        console.log(error);
        setNFTMarketData([]);
      }
    })();
  }, [chainId]);
  const dataArray = (num: number) => {
    var result = [];
    for (var i = 0; i < NFTMarketShowData.length; i += num) {
      result.push(NFTMarketShowData.slice(i, i + num));
    }
    return result;
  };
  const liData = dataArray(checkWidth() ? 5 : 2).map((item, index) => {
    const ul = item.map((itemData, indexData) => {
      return (
        <li
          key={`${classPrefix}+li+${index}+${indexData}`}
          onClick={() => setShowModal(itemData)}
        >
          <NFTItem
            src={itemData.thumbnail}
            name={itemData.token_id}
            lever={parseInt(itemData.rarity)}
            endTime={itemData.end_time}
            value={itemData.value}
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
    getMarketData();
    const time = setInterval(() => {
      getMarketData();
    }, 10000);
    return () => {
      clearTimeout(time);
    };
  }, [getMarketData]);
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
    setNFTMarketShowData(rarityArray(NFTMarketData));
  }, [NFTMarketData, lever]);
  return (
    <div className={`${classPrefix}`}>
      {showModal ? (
        <Popup
          ref={modal}
          className={"NFTAuction"}
          open
          nested
          onClose={() => {
            setShowModal(undefined);
          }}
        >
          {(close: MouseEventHandler<HTMLButtonElement>) => (
            <NFTMarketModal info={showModal} onClose={close} />
          )}
        </Popup>
      ) : null}
      <div className={`${classPrefix}-choice`}>
        <div className={`${classPrefix}-choice-top`}>
          <div className={`${classPrefix}-choice-top-lever`}>
            <p className={`${classPrefix}-choice-top-lever-title`}>Rarity:</p>
            <ul>{leverLi}</ul>
          </div>
        </div>
      </div>
      {NFTMarketShowData.length > 0 ? (
        <ul className="line">{liData}</ul>
      ) : (
        <div className={`${classPrefix}-noData`}>No offers to display</div>
      )}
    </div>
  );
};

export default NFTWhiteList;
