import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { MaxUint256 } from "@ethersproject/constants";
import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Popup from "reactjs-popup";
import {
  NFTAuctionIcon,
  NFTBuy,
  NFTHow,
  NFTMyAuction,
  NFTMyDig,
  NFTMyMint,
  NFTProbability,
} from "../../components/Icon";
import MainButton from "../../components/MainButton";
import MainCard from "../../components/MainCard";
import NFTItem from "../../components/NFTItem";
import NFTLeverIcon from "../../components/NFTLeverIcon";
import TabItem from "../../components/TabItem";
import { useERC20Approve } from "../../contracts/hooks/useERC20Approve";
import { NESTNFTContract, tokenList } from "../../libs/constants/addresses";
import { getERC20Contract, NESTNFT } from "../../libs/hooks/useContract";
import useTransactionListCon, {
  TransactionState,
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import { checkWidth, downTime } from "../../libs/utils";
import NFTAuctionView from "./NFTAuctionView";
import { NFTDigModal } from "./NFTModal";
import NFTOfferView from "./NFTOfferView";
import NFTReceived from "./NFTReceived";
import "./styles";
import {
  useNESTNFclaim,
  useNESTNFTMint,
} from "../../contracts/hooks/useNFTTransaction";
import { TransactionModalType } from "../Shared/TransactionModal";

export type NFTMyDigDataType = {
  thumbnail: string;
  description: string;
  token_address: string;
  token_id: string;
  starting_price: string;
  token_name: string;
  value: string;
  hash: string;
  rarity: string;
  initiator: string;

  bidder: string;
  end_time: string;
  index: string;
  start_price: string;
  start_block: string;
  start_time: string;
  price: string;
  end_auction: string;
};

enum DigStatus {
  firstDig = 1,
  digging = 2,
  open = 3,
  digAgain = 4,
  showImage = 5,
}

type ShowImageType = {
  id: BigNumber;
  src?: string;
  lever?: string;
};

type EndBlock = {
  nowBlock: number;
  nowBlockTime: number;
  endBlock: number;
};

const NFTAuction: FC = () => {
  const classPrefix = "NFTAuction";
  const [digTabSelected, setDigTabSelected] = useState(0);
  const [auctionTabSelected, setAuctionTabSelected] = useState(0);
  const [NESTBalance, setNESTBalance] = useState<BigNumber>();
  const [NESTAllowance, setNESTAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [claimIndex, setClaimIndex] = useState<BigNumber>();
  const { pendingList, txList, showModal } = useTransactionListCon();
  const [digStep, setDigStep] = useState<DigStatus>(1);
  const [NFTMyDigData, setNFTMyDigData] = useState<Array<NFTMyDigDataType>>([]);
  const { chainId, account, library } = useWeb3();
  const [showImageId, setShowImageId] = useState<ShowImageType>();
  const [endBlock, setEndBlock] = useState<EndBlock>();
  const [timeString, setTimeString] = useState<string>("---");
  const modal = useRef<any>();
  const dataArray = (num: number) => {
    var result = [];
    if (NFTMyDigData.length > 0) {
      for (var i = 0; i < NFTMyDigData.length; i += num) {
        result.push(NFTMyDigData.slice(i, i + num));
      }
    }
    return result;
  };
  const NFTContract = NESTNFT();
  const liData = dataArray(checkWidth() ? 3 : 2).map((item, index) => {
    const ul = item.map((itemData, indexData) => {
      return (
        <Popup
          key={`${classPrefix}+pop+${index}+${indexData}`}
          modal
          ref={modal}
          className={"NFTAuction"}
          nested
          trigger={
            <li>
              <NFTItem
                src={itemData.thumbnail}
                name={itemData.token_id}
                lever={parseInt(itemData.rarity)}
                isDig={true}
                value={itemData.value}
              />
            </li>
          }
        >
          {(close: MouseEventHandler<HTMLButtonElement>) => (
            <NFTDigModal info={itemData} onClose={close} />
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
  // balance
  const getBalance = useCallback(async () => {
    if (!chainId || !account || !library) {
      return;
    }
    const NESTBalance = await getERC20Contract(
      tokenList["NEST"].addresses[chainId],
      library,
      account
    )?.balanceOf(account);
    setNESTBalance(NESTBalance);
  }, [account, chainId, library]);
  useEffect(() => {
    getBalance();
  }, [getBalance, txList]);
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
      return;
    }
    (async () => {
      const allowance = await nestToken.allowance(
        account,
        NESTNFTContract[chainId]
      );
      setNESTAllowance(allowance);
    })();
  }, [account, chainId, library, txList]);
  // get dig data
  const getDigData = useCallback(() => {
    if (!account || !chainId) {
      return;
    }
    (async () => {
      try {
        const data = await fetch(
          `https://api.hedge.red/api/nft/mymint/${account}/1000/${chainId?.toString()}`
        );
        const data_json = await data.json();
        setNFTMyDigData(data_json["value"] ?? []);
      } catch (error) {
        console.log(error);
        setNFTMyDigData([]);
      }
    })();
  }, [account, chainId]);
  // check
  const checkBalance = () => {
    if (
      NESTBalance &&
      NESTBalance.gte(parseUnits("100", 18).mul(101).div(100))
    ) {
      return true;
    } else {
      return false;
    }
  };
  const checkAllowance = () => {
    if (NESTAllowance.lt(parseUnits("100", 18).mul(101).div(100))) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    const mintPending = pendingList.filter(
      (item) => item.type === TransactionType.NESTNFTMint
    );
    if (mintPending.length > 0) {
      setDigStep(2);
      setShowImageId(undefined);
    }
  }, [digStep, pendingList]);
  const mainButtonPending = () => {
    const type = showModal.txType;
    const isShow = showModal.isShow;

    if (type === TransactionModalType.wait && isShow) {
      return true;
    } else {
      // pending
      const pendingTransaction = pendingList.filter(
        (item) =>
          item.type === TransactionType.NESTNFTMint ||
          item.type === TransactionType.NESTNFTClaim ||
          item.type === TransactionType.approve
      );
      return pendingTransaction.length > 0 ? true : false;
    }
  };
  const checkMainButton = () => {
    if (!library) {
      return false;
    }
    if (mainButtonPending()) {
      return false;
    }
    if (digStep !== 3) {
      if (!checkAllowance()) {
        return true;
      }
      if (!checkBalance()) {
        return false;
      }
    }
    return true;
  };
  const checkClaimIndex = useCallback(
    async (hash: string) => {
      if (NFTContract && chainId) {
        const digList = await NFTContract.find("0", "256", "256", account);
        const result = await library?.getTransactionReceipt(hash);
        if (result) {
          const startBlock = result.blockNumber;
          for (let index = 0; index < digList.length; index++) {
            const element = digList[index];
            if (parseInt(element[1].toString()) === startBlock) {
              const nowBlock = await library?.getBlockNumber();
              if (nowBlock && nowBlock - startBlock < 256) {
                const nowTime = Date.now() / 1000;
                setClaimIndex(BigNumber.from(element[3].toString()));
                setDigStep(3);
                setEndBlock({
                  nowBlock: nowBlock,
                  endBlock: startBlock + 256,
                  nowBlockTime: nowTime,
                });
              } else {
                localStorage.setItem("NFTDig" + chainId.toString(), "");
                setClaimIndex(undefined);
                setDigStep(1);
                setEndBlock(undefined);
              }
            }
          }
        }
        console.log(result?.blockNumber);
      }
    },
    [NFTContract, account, chainId, library]
  );

  // update
  useEffect(() => {
    getDigData();
    const time = setInterval(() => {
      getDigData();
    }, 10000);
    return () => {
      clearTimeout(time);
    };
  }, [getDigData]);

  useEffect(() => {
    if (digStep === 3 && endBlock && chainId) {
      const time = setInterval(() => {
        var leftTime = (endBlock.endBlock - endBlock.nowBlock) * 3;
        const nowTime = Date.now() / 1000;
        leftTime = leftTime - (nowTime - endBlock.nowBlockTime);
        if (leftTime > 0) {
          setTimeString(downTime(leftTime));
        } else {
          localStorage.setItem("NFTDig" + chainId.toString(), "");
          setClaimIndex(undefined);
          setEndBlock(undefined);
          setDigStep(1);
        }
      }, 1000);
      return () => {
        clearTimeout(time);
      };
    }
  }, [chainId, digStep, endBlock]);

  // dig tab item data
  const digTabItemArray = [
    { icon: <NFTBuy />, text: "Buy" },
    { icon: <NFTHow />, text: "How To Play" },
    { icon: <NFTProbability />, text: "Probability" },
  ];
  const digTabNum = (index: number) => {
    setDigTabSelected(index);
  };
  // auction tab item data
  const auctionTabItemArray = [
    { icon: <NFTAuctionIcon />, text: "Auction" },
    { icon: <NFTMyAuction />, text: "Offers Made" },
    { icon: <NFTMyDig />, text: "My Received" },
  ];
  const auctionTabNum = (index: number) => {
    setAuctionTabSelected(index);
  };
  // Dig or Claim
  useEffect(() => {
    var cache = localStorage.getItem("NFTDig" + chainId?.toString());
    if (
      txList.length > 0 &&
      txList[txList.length - 1].type === TransactionType.NESTNFTMint
    ) {
      if (cache && cache !== "") {
        checkClaimIndex(cache.toString());
      }
    } else if (
      txList.length > 0 &&
      txList[txList.length - 1].type === TransactionType.NESTNFTClaim
    ) {
      if (!cache && cache === "") {
        setDigStep(1);
      }
    }
  }, [chainId, checkClaimIndex, txList]);
  // update dig step
  useEffect(() => {
    if (digStep === 3) {
      var cache = localStorage.getItem("NFTClaim" + chainId?.toString());
      if (!cache || cache === "") {
        return;
      }
      // claim result
      const claimHash = txList.filter((item) => {
        return (
          item.hash === cache?.toString() &&
          item.txState === TransactionState.Success
        );
      });
      if (claimHash.length > 0 && NFTContract) {
        (async () => {
          const rec = await library?.getTransactionReceipt(cache.toString());
          console.log(rec);
          if (rec && rec.logs.length === 0) {
            setDigStep(4);
          } else if (rec && rec.logs.length > 0) {
            const tokenId = BigNumber.from(rec.logs[0].topics[3]);
            console.log(tokenId.toString());
            setDigStep(5);
            // get token uri
            const uri = await NFTContract.tokenURI(tokenId.toString());
            // get json
            const data = await fetch(uri);
            const data_json = await data.json();
            // image url
            const baseUrl = data_json["thumbnail"];
            const src =
              "https://" +
              baseUrl.substring(7, baseUrl.length) +
              ".ipfs.w3s.link";
            // lever
            const lever = data_json["attributes"][0]["value"];
            setShowImageId({
              id: tokenId,
              src: src,
              lever: lever,
            });
          }
          localStorage.setItem("NFTClaim" + chainId?.toString(), "");
        })();
      }
    }
  }, [NFTContract, chainId, digStep, library, txList]);
  // top left view
  const topLeftView = () => {
    const topLeftViewClass = `${classPrefix}-top-left-main`;
    // show dig image
    const digImage = () => {
      if (digStep === 5) {
        return (
          <div className={`${topLeftViewClass}-buy-image`}>
            <img src={showImageId?.src} alt="img" />
            <div className={`${topLeftViewClass}-buy-image-lever`}>
              <NFTLeverIcon lever={parseInt(showImageId?.lever ?? "99")} />
            </div>
          </div>
        );
      } else if (digStep === 2) {
        return (
          <div className={`${topLeftViewClass}-buy-otherImage`}>
            <img src="./dig-unscreen.gif" alt="img" />
          </div>
        );
      } else if (digStep === 3) {
        return (
          <div className={`${topLeftViewClass}-buy-otherImage`}>
            <img src="./OpenPrize.png" alt="img" />
          </div>
        );
      } else if (digStep === 4) {
        return (
          <div className={`${topLeftViewClass}-buy-otherImage`}>
            <img src="./Dig-again.png" alt="img" />
          </div>
        );
      } else {
        return (
          <div className={`${topLeftViewClass}-buy-otherImage`}>
            <img src="./Dig.png" alt="img" />
          </div>
        );
      }
    };
    if (digTabSelected === 0) {
      return (
        <div className={`${topLeftViewClass}-buy`}>
          {digImage()}
          <MainButton
            onClick={() => {
              if (!checkMainButton()) {
                return;
              }
              if (digStep !== 3) {
                if (checkAllowance()) {
                  dig();
                } else {
                  approve();
                }
              } else {
                claim();
              }
            }}
            disable={!checkMainButton()}
            loading={mainButtonPending()}
          >
            {digStep === 3
              ? `Claim (${timeString})`
              : checkAllowance()
              ? digStep === 4
                ? "Dig again"
                : "Dig"
              : "Approve"}
          </MainButton>
          <p className={`${topLeftViewClass}-buy-balance`}>
            Balance:{" "}
            {parseFloat(formatUnits(NESTBalance ?? 0, 18))
              .toFixed(2)
              .toString()}{" "}
            NEST
          </p>
        </div>
      );
    } else if (digTabSelected === 1) {
      return <div className={`${topLeftViewClass}-how`}>how</div>;
    } else {
      return (
        <div className={`${topLeftViewClass}-probability`}>probability</div>
      );
    }
  };
  // bottom main view
  const bottomMainView = () => {
    if (auctionTabSelected === 0) {
      return <NFTAuctionView />;
    } else if (auctionTabSelected === 1) {
      return <NFTOfferView />;
    } else {
      return <NFTReceived />;
    }
  };
  // transaction
  const approve = useERC20Approve(
    "NEST",
    MaxUint256,
    chainId ? NESTNFTContract[chainId] : undefined
  );
  const dig = useNESTNFTMint();
  const claim = useNESTNFclaim(claimIndex);
  return (
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-top`}>
        <MainCard classNames={`${classPrefix}-top-left`}>
          <TabItem data={digTabItemArray} selectedVoid={digTabNum} />
          <div className={`${classPrefix}-top-left-main`}>{topLeftView()}</div>
        </MainCard>
        <MainCard classNames={`${classPrefix}-top-right`}>
          <div className={`${classPrefix}-top-right-title`}>
            <NFTMyMint />
            <p>My Dig</p>
          </div>
          {NFTMyDigData.length > 0 ? (
            <ul className="line">{liData}</ul>
          ) : (
            <div className={`${classPrefix}-top-right-noData`}>
              No offers to display
            </div>
          )}
        </MainCard>
      </div>
      <div className={`${classPrefix}-bottom`}>
        <MainCard classNames={`${classPrefix}-bottom-main`}>
          <TabItem data={auctionTabItemArray} selectedVoid={auctionTabNum} />
          {bottomMainView()}
        </MainCard>
      </div>
    </div>
  );
};

export default NFTAuction;
