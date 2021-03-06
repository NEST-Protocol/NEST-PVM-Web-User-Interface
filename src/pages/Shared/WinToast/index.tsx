import { BigNumber } from "ethers";
import { FC } from "react";
import { toast } from "react-toastify";
import MainButton from "../../../components/MainButton";
import { usePVMWinClaim } from "../../../contracts/hooks/usePVMWinTransation";
import { bigNumberToNormal } from "../../../libs/utils";
import './styles'

export type WinToastProps = {
  gained: BigNumber;
  index: BigNumber
};
export const WinToast: FC<WinToastProps> = ({ ...props }) => {
  const classPrefix = "winToast";
  const claim = usePVMWinClaim(
    props.index
  );
  const titleString = BigNumber.from('0').eq(props.gained) ? 'Lose' : 'Win'
  const infoString = BigNumber.from('0').eq(props.gained) ? 'You did not win NEST ！' : `You win ${bigNumberToNormal(props.gained, 18 ,6)} NEST ！`
  const winTimeAndACT = BigNumber.from('0').eq(props.gained) ? (<></>) : (
    <div className={`${classPrefix}-win`}>
      <p className={`${classPrefix}-win-time`}>{`Please claim it within 10 minutes, or you will miss it!`}</p>
      <MainButton onClick={() => {
        claim()
        toast.dismiss(props.index.toNumber())
      }}>Claim</MainButton>
    </div>
  )
  return (
    <div className={classPrefix}>
      <p className={`${classPrefix}-title`}>{titleString}</p>
      <p className={`${classPrefix}-info`}>{infoString}</p>
      {winTimeAndACT}
    </div>
  )
};

export default WinToast;

export const notifyWinToast = (resultInfo: WinToastProps) => {
  toast(
    <WinToast
      gained={resultInfo.gained}
      index={resultInfo.index}
    />,
    {
      position: toast.POSITION.TOP_RIGHT,
      closeOnClick: true,
      hideProgressBar: true,
      autoClose: resultInfo.gained.eq(BigNumber.from('0')) ? 3000 : 30000,
      toastId: resultInfo.index.toNumber()
    }
  );
};
