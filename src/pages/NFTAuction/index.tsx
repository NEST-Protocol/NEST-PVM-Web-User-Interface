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
  NFTWhiteListIcon,
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
import NFTWhiteList from "./NFTWhiteList";
import { checkWhiteList } from "../../contracts/hooks/useNESTNFTMarket";

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
  const [showNFTModal, setShowNFTModal] = useState<NFTMyDigDataType>();
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
  const [firstShow, setFirstShow] = useState<boolean>(true);
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
        <li
          key={`${classPrefix}+pop+${index}+${indexData}`}
          onClick={() => setShowNFTModal(itemData)}
        >
          <NFTItem
            src={itemData.thumbnail}
            name={itemData.token_id}
            lever={parseInt(itemData.rarity)}
            isDig={true}
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
    { icon: <NFTMyAuction />, text: "In Progress" },
    { icon: <NFTMyDig />, text: "My items" },
    { icon: <NFTWhiteListIcon />, text: "White List" },
  ];
  const auctionTabNum = (index: number) => {
    setAuctionTabSelected(index);
  };
  // Dig or Claim
  const noClaim = useCallback(() => {
    if (!NFTContract) {
      return;
    }
    (async () => {
      const digList = await NFTContract.find("0", "256", "256", account);
      const nowBlock = await library?.getBlockNumber();
      if (!nowBlock) {
        return;
      }
      const noClaimList = digList.filter((item: any) => {
        return (
          item[3].toString() !== "0" &&
          parseInt(item[2].toString()) <= 1 &&
          nowBlock - parseInt(item[1].toString()) < 256
        );
      });
      const nowTime = Date.now() / 1000;
      if (noClaimList.length > 0) {
        setDigStep(3);
        const lastItem = noClaimList[noClaimList.length - 1];
        setEndBlock({
          nowBlock: nowBlock,
          endBlock: parseInt(lastItem[1].toString()) + 256,
          nowBlockTime: nowTime,
        });
        console.log(lastItem[3]);
        setClaimIndex(lastItem[3]);
      } else {
        setDigStep(1);
      }
    })();
  }, [NFTContract, account, library]);
  useEffect(() => {
    if (txList.length > 0 && txList[txList.length - 1].txState !== 0) {
      if (digStep !== 5) {
        noClaim();
      }
    }
  }, [digStep, noClaim, txList]);
  useEffect(() => {
    if (digStep === 3 && endBlock && chainId) {
      const time = setInterval(() => {
        var leftTime = (endBlock.endBlock - endBlock.nowBlock) * 3;
        const nowTime = Date.now() / 1000;
        leftTime = leftTime - (nowTime - endBlock.nowBlockTime);
        if (leftTime > 0) {
          setTimeString(downTime(leftTime));
        } else {
          setClaimIndex(undefined);
          setEndBlock(undefined);
          noClaim();
        }
      }, 1000);
      return () => {
        clearTimeout(time);
      };
    }
  }, [chainId, digStep, endBlock, noClaim]);
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
            try {
              // get token uri
              const uri: string = await NFTContract.tokenURI(
                tokenId.toString()
              );
              // get json
              const cloudUri =
                "https://cloudflare-ipfs.com/" + uri.substring(16, uri.length);
              const data = await fetch(cloudUri);
              const data_json = await data.json();
              // image url
              const baseUrl = data_json["thumbnail"];
              const src =
                "https://" +
                (baseUrl.length > 7
                  ? baseUrl.substring(7, baseUrl.length)
                  : "") +
                ".ipfs.w3s.link";
              // lever
              const uriArray = uri.split("/");
              const lever = uriArray[uriArray.length - 2];
              setShowImageId({
                id: tokenId,
                src: src,
                lever: lever,
              });
              setDigStep(5);

              setTimeout(() => {
                setFirstShow(true);
                noClaim();
              }, 30000);
            } catch (error) {
              setFirstShow(true);
              noClaim();
            }
          }
          localStorage.setItem("NFTClaim" + chainId?.toString(), "");
        })();
      }
    }
  }, [NFTContract, chainId, digStep, library, noClaim, txList]);
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
      } else if (digStep === 4 || (!firstShow && digStep === 1)) {
        return (
          <div className={`${topLeftViewClass}-buy-otherImage`}>
            <p>No digging</p>
            <img src="./Dig-again.png" alt="img" />
          </div>
        );
      } else {
        return (
          <div className={`${topLeftViewClass}-buy-otherImage`}>
            <img src="./Dig.png" alt="img" />
            <br />
            <p>NEST 99.9</p>
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
                setFirstShow(false);
              }
            }}
            disable={!checkMainButton()}
            loading={mainButtonPending()}
          >
            {digStep === 3
              ? `Claim (${timeString})`
              : checkAllowance()
              ? digStep === 4 || (digStep === 1 && !firstShow)
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
      return (
        <div className={`${topLeftViewClass}-how`}>
          <h3 className={`${topLeftViewClass}-how-h3`}>How to play?</h3>
          <h4 className={`${topLeftViewClass}-how-h4`}>How to dig?</h4>
          <p>
            You can try to dig a Cyber Ink NFT with a cost of 99.9 NEST. There
            is a chance to get a Cyber Ink NFT(worth 300-3000 $NEST) directly.
          </p>
          <img src="./NFTHowImage/howtoplay1.png" alt="img" />
          <p>
            After the dig, you will get a mystery box, please open (claim) it
            within 12 minutes.
          </p>
          <img src="./NFTHowImage/howtoplay2.png" alt="img" />
          <p>
            After opening the mystery box, you can dig again at the same cost.
          </p>
          <img src="./NFTHowImage/howtoplay3.png" alt="img" />
          <p>
            After winning an NFT, you can see it in “My Collection”, and you can
            initiate an auction for the NFT here.
          </p>
          <img src="./NFTHowImage/howtoplay4.png" alt="img" />
          <h3 className={`${topLeftViewClass}-how-h3`}>
            How to initiate an auction?
          </h3>
          <p>Open NFT detail in My Collection, click “Go to auction”</p>
          <img src="./NFTHowImage/howtoplay5.png" alt="img" />
          <p>
            Watch out our auction rules, it shows every time you click it,
            please read carefully.
          </p>
          <img src="./NFTHowImage/howtoplay6.png" alt="img" />
          <h3 className={`${topLeftViewClass}-how-h3`}>Auction rule:</h3>
          <p>
            You can set any amount as the starting price and the auction will be
            an ascending auction.
          </p>
          <p>
            To encourage bidding, 50% of the bid difference will be rewarded to
            the previous failed bidder, the reward amount will be borne by the
            auction sponsor, and the cost will be deducted directly from the
            final sale price, with no additional service fee.
          </p>
          <h3 className={`${topLeftViewClass}-how-h3`}>Auction setting:</h3>
          <h4 className={`${topLeftViewClass}-how-h4`}>Range:</h4>
          <p>
            1. Auction time: you can choose, 24 Hours, 48 Hours, or 78 Hours.
            Countdown begins as soon as the auction takes effect
          </p>
          <p>
            2. Starting price: you are free to define the starting price, the
            minimum must not be less than 9.9 NEST, the input box also provides
            the suggested starting price range for reference
          </p>
          <img src="./NFTHowImage/howtoplay7.png" alt="img" />
          <p>
            After approval of the auction, your CyberInk NFT will be seen by
            everyone in the auction.
          </p>
          <img src="./NFTHowImage/howtoplay8.png" alt="img" />
          <h3 className={`${topLeftViewClass}-how-h3`}>How to auction?</h3>
          <p>
            Auction: All those that are being auctioned will be displayed here.
            You can quickly browse the NFT you want to get by filtering.
          </p>
          <p>
            In Progress: All the in-progress auctions you bid on are displayed
            here.
          </p>
          <p>
            My Items: All the items I have auctioned successfully are shown
            here, you can initiate another auction again here.
          </p>
          <h4 className={`${topLeftViewClass}-how-h4`}>Start Auction</h4>
          <img src="./NFTHowImage/howtoplay9.png" alt="img" />
          <p>1. You can make bids after approval</p>
          <p>
            2. Custom bids are available, as well as shortcuts of +10%, +50%,
            and +100%. Bids must be higher than the starting bid or the current
            highest bid, and the minimum bid price must be greater than 1.
          </p>
          <h4 className={`${topLeftViewClass}-how-h4`}>Auction Reward</h4>
          <p>
            1. 50% of the price difference between the latter and the former
            auctioneer will be given to the former auctioneer as a bonus
          </p>
          <p>
            2. After the latter person's bid is successful, the previous
            auctioneer will directly get back the auction principal + additional
            bonus part.
          </p>
          <p>
            The final auction price will be given to the initiator after
            deducting all rewards.
          </p>
          <img src="./NFTHowImage/howtoplay10.png" alt="img" />
          <h4 className={`${topLeftViewClass}-how-h4`}>Auction Success</h4>
          <p>1. At the end of the countdown, the highest bidder wins</p>
          <p>
            2. The initiator receives the highest amount minus the additional
            bonus amount to complete the auction
          </p>
          <p>
            3. After completing the auction, the initiator can collect the
            auction amount, and the highest bidder can get NFT. After the
            withdrawal is triggered by either one party, the auction ends
          </p>
          <img src="./NFTHowImage/howtoplay11.png" alt="img" />
          <p>
            PS: NEST NFTs are BSC minted and you can sell them on any BSC
            NFT-enabled platform. The NEST NFT you purchased in any secondary
            platform that supports BSC NFT can also be listed in the NESTFi APP
            for auction.
          </p>
        </div>
      );
    } else {
      return (
        <div className={`${topLeftViewClass}-probability`}>
          <p>
          <NFTLeverIcon lever={1} /> 1% winning rate, worth about 3000 $NEST, total supply 120 in the
            first round
          </p>
          <div className={`${topLeftViewClass}-probability-image`}>
            <img src="./NFTProbabilityImage/1-1.png" alt="img" />
            <img src="./NFTProbabilityImage/1-2.png" alt="img" />
          </div>
          <div className={`${topLeftViewClass}-probability-image`}>
            <img src="./NFTProbabilityImage/1-3.png" alt="img" />
            <img src="./NFTProbabilityImage/1-4.png" alt="img" />
          </div>
          <div className={`${topLeftViewClass}-probability-image`}>
            <img src="./NFTProbabilityImage/1-5.png" alt="img" />
          </div>
          <p>ETC...</p>
          <p>
          <NFTLeverIcon lever={5} /> 5% winning rate, worth about 600 $NEST, total supply 600 in the
            first round
          </p>
          <div className={`${topLeftViewClass}-probability-image`}>
            <img src="./NFTProbabilityImage/2-1.png" alt="img" />
            <img src="./NFTProbabilityImage/2-2.png" alt="img" />
          </div>
          <div className={`${topLeftViewClass}-probability-image`}>
            <img src="./NFTProbabilityImage/2-3.png" alt="img" />
            <img src="./NFTProbabilityImage/2-4.png" alt="img" />
          </div>
          <div className={`${topLeftViewClass}-probability-image`}>
            <img src="./NFTProbabilityImage/2-5.png" alt="img" />
          </div>
          <p>ETC...</p>
          <p>
          <NFTLeverIcon lever={10} /> 10% winning rate, worth about 300 $NEST, total supply 1200 in the
            first round
          </p>
          <div className={`${topLeftViewClass}-probability-image`}>
            <img src="./NFTProbabilityImage/3-1.png" alt="img" />
            <img src="./NFTProbabilityImage/3-2.png" alt="img" />
          </div>
          <div className={`${topLeftViewClass}-probability-image`}>
            <img src="./NFTProbabilityImage/3-3.png" alt="img" />
            <img src="./NFTProbabilityImage/3-4.png" alt="img" />
          </div>
          <div className={`${topLeftViewClass}-probability-image`}>
            <img src="./NFTProbabilityImage/3-5.png" alt="img" />
          </div>
          <p>ETC...</p>
          <h1>REGIONAL LIMITATIONS</h1>
          <p>
            Citizens, nationals, residents (tax or otherwise) and/or green card
            holders of the following countries: (i) the United States of
            America; (ii) the People’s Republic of China; (iii) South Korea;
            (iv) Vietnam; and (v) any other jurisdiction that prohibits the
            possession, dissemination or communication of the information
            available on the Website (all information in the White Paper, the
            Presentations and all information available on the Website are
            hereinafter referred to as the “Available Information”) and/or
            prohibits participation in the Token Sale or the purchase of Tokens
            or the offer for sale of the Tokens or similar activities or
            products (collectively, the “Restricted Jurisdictions”) or other
            Restricted Persons from participating in the Token Sale & NFT
            Minting. The term “Restricted Persons” refers to any firm, company,
            partnership, trust, corporation, institution, government, state or
            agency of a state or any other incorporated or unincorporated body
            or association, union or partnership (whether or not having separate
            legal personality) formed and/or lawfully existing under the laws of
            any Restricted Jurisdiction (including, in the case of the United
            States of America, under the federal laws of the United States of
            America or the laws of any state thereof).
          </p>
          <p>
            The Tokens do not and will not constitute securities in any
            jurisdiction. The NEST Protocol Project Documentation does not
            constitute a prospectus or offering document of any kind and the
            information available is not intended as an offer of securities or a
            solicitation of investment in securities in any jurisdiction. The
            Company does not express any opinion or give any advice on the
            purchase, sale or other transaction of any Token, and the
            presentation, publication or transmission of all or any part of the
            available information shall not be used or relied upon in connection
            with any contract or investment decision.
          </p>
        </div>
      );
    }
  };
  // bottom main view
  const bottomMainView = () => {
    if (auctionTabSelected === 0) {
      return <NFTAuctionView />;
    } else if (auctionTabSelected === 1) {
      return <NFTOfferView />;
    } else if (auctionTabSelected === 2) {
      return <NFTReceived />;
    } else {
      return <NFTWhiteList />;
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
            <NFTDigModal info={showNFTModal} onClose={close} />
          )}
        </Popup>
      ) : null}
      <div className={`${classPrefix}-top`}>
        <MainCard classNames={`${classPrefix}-top-left`}>
          <TabItem data={digTabItemArray} selectedVoid={digTabNum} />
          <div className={`${classPrefix}-top-left-main`}>{topLeftView()}</div>
        </MainCard>
        <MainCard classNames={`${classPrefix}-top-right`}>
          <div className={`${classPrefix}-top-right-title`}>
            <NFTMyMint />
            <p>My Collection</p>
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
          <TabItem
            className={checkWhiteList(account) ? "whiteList" : ""}
            data={auctionTabItemArray}
            selectedVoid={auctionTabNum}
          />
          {bottomMainView()}
        </MainCard>
      </div>
    </div>
  );
};

export default NFTAuction;
