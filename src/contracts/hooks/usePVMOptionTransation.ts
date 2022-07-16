import { TokenType } from '../../libs/constants/addresses';
import { BigNumber } from "ethers";
import { PVMOptionContract } from "../../libs/constants/addresses";
import { PVMOption } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";
import { TransactionType } from '../../libs/hooks/useTransactionInfo';

export function usePVMOptionOpen(
    token: TokenType,  
    orientation: boolean, 
    endblock: BigNumber, 
    nestAmount: BigNumber,
    price?: BigNumber
) { 
    const { account, chainId } = useWeb3()
    var contract = PVMOption(PVMOptionContract)
    var callData: string | undefined
    if (!chainId || !price) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('open', [
            token.addresses[chainId], 
            price, 
            orientation, 
            endblock, 
            nestAmount]
        )
    }
    
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Buy options`, info:'', type: TransactionType.buyOption})
    return txPromise
}

export function usePVMOptionExercise(
    index: BigNumber,
    amount: BigNumber
) {
    const { account, chainId } = useWeb3()
    var contract = PVMOption(PVMOptionContract)
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('exercise', [
            index, 
            amount]
        )
    }
    
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Strike options`, info:index.toString(), type: TransactionType.closeOption})
    return txPromise
}

export function usePVMOptionSell(
    index: BigNumber,
    amount: BigNumber
) {
    const { account, chainId } = useWeb3()
    var contract = PVMOption(PVMOptionContract)
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
        value: PRICE_FEE
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Sell options`, info:index.toString(), type: TransactionType.sellOption})
    return txPromise
}