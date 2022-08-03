import { BigNumber } from "ethers"
import { PVMWinContract } from "../../libs/constants/addresses"
import { PVMWin } from "../../libs/hooks/useContract"
import { useSendTransaction } from "../../libs/hooks/useSendTransaction"
import { TransactionType } from "../../libs/hooks/useTransactionInfo"
import useWeb3 from "../../libs/hooks/useWeb3"


export function usePVMWinRoll(
    n: BigNumber,  
    m: BigNumber
) { 
    const { account, chainId } = useWeb3()
    var contract = PVMWin(PVMWinContract)
    var callData: string | undefined
    if (!chainId || !m) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('roll44', [
            n,m]
        )
    }
    
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Roll`, info:`${n.toString()},${m.toString()}`, type: TransactionType.roll})
    return txPromise
}

export function usePVMWinClaim(
    index: BigNumber
) { 
    const { account, chainId } = useWeb3()
    var contract = PVMWin(PVMWinContract)
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('claim44', [
            index]
        )
    }
    
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Claim`, info:index.toString(), type: TransactionType.winClaim})
    return txPromise
}