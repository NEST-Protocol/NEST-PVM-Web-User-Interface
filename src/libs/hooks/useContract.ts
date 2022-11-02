import { NESTNFTAuctionContract, NESTNFTContract, NESTNFTMarketContract, NestPrice as NestPriceAddress } from './../constants/addresses';
import useWeb3 from '../hooks/useWeb3';
import { getAddress } from "@ethersproject/address"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers"
import { AddressZero } from "@ethersproject/constants"
import { useMemo } from 'react';
import { AddressesType } from '../constants/addresses';
import ERC20ABI from '../../contracts/abis/ERC20.json'
import PVMOptionABI from '../../contracts/abis/PVMOption.json';
import PVMLeverABI from '../../contracts/abis/PVMLever.json';
import NestPriceABI from '../../contracts/abis/NestPrice.json';
import PVMWinABI from '../../contracts/abis/PVMWin.json';
import PVMPayBackABI from '../../contracts/abis/PVMPayBack.json';
import UniSwapV2ABI from '../../contracts/abis/UNISwap.json';
import NESTNFTABI from '../../contracts/abis/NESTNFT.json';
import NESTNFTAuctionABI from '../../contracts/abis/NESTNFTAuction.json';
import NESTNFTMarketABI from '../../contracts/abis/NESTNFTMarket.json';
import { ZERO_ADDRESS } from '../utils';

function isAddress(value: any): string | false {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}

function getSigner(
    provider:Web3Provider, 
    account:string
): JsonRpcSigner {
    return provider.getSigner(account).connectUnchecked()
}

export function getContract(
    address: string, 
    ABI: any, 
    provider:Web3Provider, 
    account: string
): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw new Error(`${address} is wrong!!`);
    }
    return new Contract(address, ABI, getSigner(provider, account))
}

export function useContract(
    addresses: AddressesType, 
    ABI: any
): Contract | null {
    const {library, account, chainId} = useWeb3()
    return useMemo(() => {
        if (!library || !(library instanceof Web3Provider) || !account || !ABI || !chainId || addresses[chainId] === ZERO_ADDRESS) return null
        try {
            return getContract(addresses[chainId], ABI, library, account)
        } catch (error) {
            console.error('can not useContract', error)
            return null
        }
    }, [addresses, ABI, library, account, chainId])
}

export function getERC20Contract(address:string, provider:Web3Provider, 
    account: string): Contract | null {
    return getContract(address, ERC20ABI, provider, account)
}

export function ERC20Contract(addresses: AddressesType): Contract | null {
    return useContract(addresses, ERC20ABI);
}

export function PVMOption(addresses: AddressesType): Contract | null {
    return useContract(addresses, PVMOptionABI)
}

export function PVMLever(addresses: AddressesType): Contract | null {
    return useContract(addresses, PVMLeverABI)
}

export function NestPriceContract(): Contract | null {
    return useContract(NestPriceAddress, NestPriceABI)
}

export function PVMWin(addresses: AddressesType): Contract | null {
    return useContract(addresses, PVMWinABI)
}

export function PVMPayBack(addresses: AddressesType): Contract | null {
    return useContract(addresses, PVMPayBackABI)
}

export function UniSwapV2(addresses: AddressesType): Contract | null {
    return useContract(addresses, UniSwapV2ABI)
} 

export function NESTNFT(): Contract | null {
    return useContract(NESTNFTContract, NESTNFTABI)
} 

export function NESTNFTAuction(): Contract | null {
    return useContract(NESTNFTAuctionContract, NESTNFTAuctionABI)
} 

export function NESTNFTMarket(): Contract | null {
    return useContract(NESTNFTMarketContract, NESTNFTMarketABI)
} 
