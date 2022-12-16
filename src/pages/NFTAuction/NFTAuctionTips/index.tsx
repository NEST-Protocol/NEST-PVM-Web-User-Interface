import { FC, MouseEventHandler } from "react";
import BaseModal from "../../../components/BaseModal";
import MainButton from "../../../components/MainButton";
import "./styles";

type Props = {
  onClose?: MouseEventHandler<HTMLButtonElement>;
  click: () => void;
};

const NFTAuctionTips: FC<Props> = ({ ...props }) => {
  const classPrefix = "NFTAuctionTips";
  return (
    <BaseModal
      titleName="Auction Tips"
      onClose={props.onClose}
      classNames={`${classPrefix}`}
    >
      <p>
        You can set any amount as the starting price and the auction will be an
        ascending auction.
      </p>
      <p>
        To encourage bidding, 40% of the bid spread will be rewarded to the
        previous failed bidder, and 10% of the bid spread will be destroyed, the
        reward amount will be borne by the auction sponsor, and the cost will be
        deducted directly from the final sale price, without any additional
        service fee.
      </p>
      <MainButton onClick={props.click}>Set up auction</MainButton>
    </BaseModal>
  );
};

export default NFTAuctionTips;
