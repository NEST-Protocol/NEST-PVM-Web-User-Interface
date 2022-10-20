import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { MaxUint256 } from "@ethersproject/constants";
import { FC, useCallback, useEffect, useRef, useState } from "react";
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
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import { checkWidth } from "../../libs/utils";
import NFTAuctionView from "./NFTAuctionView";
import { NFTDigModal } from "./NFTModal";
import NFTOfferView from "./NFTOfferView";
import NFTReceived from "./NFTReceived";
import "./styles";
import { MyDig } from "./testDaata";
import {
  useNESTNFclaim,
  useNESTNFTMint,
} from "../../contracts/hooks/useNFTTransaction";

const NFTAuction: FC = () => {
  const classPrefix = "NFTAuction";
  const [digTabSelected, setDigTabSelected] = useState(0);
  const [auctionTabSelected, setAuctionTabSelected] = useState(0);
  const [NESTBalance, setNESTBalance] = useState<BigNumber>();
  const [NESTAllowance, setNESTAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [buttonShowClaim, setButtonShowClaim] = useState(false);
  const [claimIndex, setClaimIndex] = useState<BigNumber>();
  const { pendingList, txList } = useTransactionListCon();
  const { chainId, account, library } = useWeb3();
  const modal = useRef<any>();
  const dataArray = (num: number) => {
    var result = [];
    for (var i = 0; i < MyDig.length; i += num) {
      result.push(MyDig.slice(i, i + num));
    }
    return result;
  };
  const NFTContract = NESTNFT();
  const testLiData = dataArray(checkWidth() ? 3 : 2).map((item, index) => {
    const ul = item.map((itemData, indexData) => {
      return (
        <Popup
          modal
          ref={modal}
          trigger={
            <li key={`${NFTAuction}+li+${index}+${indexData}`}>
              <NFTItem
                src={itemData.img}
                name={itemData.name}
                lever={itemData.lever}
                isDig={true}
              />
            </li>
          }
        >
          <NFTDigModal title={"Dig Up / Auctioned"} />
        </Popup>
      );
    });
    return (
      <li key={`${NFTAuction}+li+${index}`}>
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
  const mainButtonPending = () => {
    const pendingTransaction = pendingList.filter(
      (item) =>
        item.type === TransactionType.NESTNFTMint ||
        item.type === TransactionType.NESTNFTClaim
    );
    return pendingTransaction.length > 0 ? true : false;
  };
  const checkMainButton = () => {
    if (!library) {
      return false;
    }
    if (!buttonShowClaim) {
      if (!checkAllowance()) {
        return true;
      }
      if (mainButtonPending() || !checkBalance()) {
        return false;
      }
    } else {
      if (mainButtonPending()) {
        return false;
      }
    }
    return true;
  };
  const checkClaimIndex = useCallback(
    async (hash: string) => {
      if (NFTContract) {
        const digList = await NFTContract.find("0", "256", "256", account);
        const result = await library?.getTransactionReceipt(hash);
        if (result) {
          const startBlock = result.blockNumber;
          for (let index = 0; index < digList.length; index++) {
            const element = digList[index];
            if (parseInt(element[1].toString()) === startBlock) {
              setClaimIndex(BigNumber.from(element[2].toString()));
              setButtonShowClaim(true);
            }
          }
        }
        console.log(result?.blockNumber);
      }
    },
    [NFTContract, account, library]
  );

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
        setButtonShowClaim(false);
      }
    }
  }, [chainId, checkClaimIndex, txList]);

  // top left view
  const topLeftView = () => {
    const topLeftViewClass = `${classPrefix}-top-left-main`;
    if (digTabSelected === 0) {
      return (
        <div className={`${topLeftViewClass}-buy`}>
          <div className={`${topLeftViewClass}-buy-image`}>
            <img src={MyDig[0].img} alt="img" />
            <div className={`${topLeftViewClass}-buy-image-lever`}>
              <NFTLeverIcon lever={2} />
            </div>
          </div>
          <MainButton
            onClick={() => {
              if (!checkMainButton()) {
                return;
              }
              if (!buttonShowClaim) {
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
            {buttonShowClaim ? "Claim" : checkAllowance() ? "Dig" : "Approve"}
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
          <ul className="line">{testLiData}</ul>
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
