import { TokenType } from '../../libs/constants/addresses';
import { BigNumber } from "ethers";
import { PVMLeverContract } from "../../libs/constants/addresses";
import { PVMLever } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";
import { TransactionType } from '../../libs/hooks/useTransactionInfo';

export function usePVMLeverBuy(
    token: TokenType,
    leverNum: number,
    isLong: boolean,
    nestAmount: BigNumber
) {
    const { account, chainId } = useWeb3()
    var contract = PVMLever(PVMLeverContract)
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('buy', [
            token.addresses[chainId],
            leverNum,
            isLong,
            nestAmount]
        )
    }
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE[chainId!]
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Open Future positions`, info:'', type: TransactionType.buyLever})
    return txPromise
}

export function usePVMLeverSell(
    index: BigNumber, 
    amount: BigNumber
) {
    const { account, chainId } = useWeb3()
    var contract = PVMLever(PVMLeverContract)
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('sell', [
            index, 
            amount]
        )
    }
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE[chainId!]
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Close Future positions`, info:index.toString(), type: TransactionType.closeLever})
    return txPromise
}

