import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'

export type SendReturnResult = { result: any }
export type SendReturn = any

export type Send = (method: string, params?: any[]) => Promise<SendReturnResult | SendReturn>
export type SendOld = ({ method }: { method: string }) => Promise<SendReturnResult | SendReturn>
const { okxwallet } = window as any
function parseSendReturn(sendReturn: SendReturnResult | SendReturn): any {
  return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
}

export class NoEthereumProviderError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No Ethereum provider was found on okxwallet.'
  }
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export class OKXConnector extends AbstractConnector {
  get [Symbol.toStringTag]() {
    return "OKX"
  }
  constructor(kwargs: AbstractConnectorArguments) {
    super(kwargs)

    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  private handleChainChanged(chainId: string | number): void {
    // if (__DEV__) {
    //   console.log("Handling 'chainChanged' event with payload", chainId)
    // }
    this.emitUpdate({ chainId, provider: okxwallet })
  }

  private handleAccountsChanged(accounts: string[]): void {
    // if (__DEV__) {
    //   console.log("Handling 'accountsChanged' event with payload", accounts)
    // }
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  private handleClose(code: number, reason: string): void {
    // if (__DEV__) {
    //   console.log("Handling 'close' event with payload", code, reason)
    // }
    this.emitDeactivate()
  }

  private handleNetworkChanged(networkId: string | number): void {
    // if (__DEV__) {
    //   console.log("Handling 'networkChanged' event with payload", networkId)
    // }
    this.emitUpdate({ chainId: networkId, provider: okxwallet })
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!okxwallet) {
      throw new NoEthereumProviderError()
    }

    if (okxwallet.on) {
      okxwallet.on('chainChanged', this.handleChainChanged)
      okxwallet.on('accountsChanged', this.handleAccountsChanged)
      okxwallet.on('close', this.handleClose)
      okxwallet.on('networkChanged', this.handleNetworkChanged)
    }

    if ((okxwallet as any).isMetaMask) {
      ;(okxwallet as any).autoRefreshOnNetworkChange = false
    }

    // try to activate + get account via eth_requestAccounts
    let account
    try {
      account = await (okxwallet.send as Send)('eth_requestAccounts').then(
        sendReturn => parseSendReturn(sendReturn)[0]
      )
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new UserRejectedRequestError()
      }
      warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
    }
    return { provider: okxwallet, ...(account ? { account } : {}) }
  }

  public async getProvider(): Promise<any> {
    return okxwallet
  }

  public async getChainId(): Promise<number | string> {
    if (!okxwallet) {
      throw new NoEthereumProviderError()
    }

    let chainId
    try {
      chainId = await (okxwallet.send as Send)('eth_chainId').then(parseSendReturn)
    } catch {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }

    if (!chainId) {
      try {
        chainId = await (okxwallet.send as Send)('net_version').then(parseSendReturn)
      } catch {
        warning(false, 'net_version was unsuccessful, falling back to net version v2')
      }
    }

    if (!chainId) {
      try {
        chainId = parseSendReturn((okxwallet.send as SendOld)({ method: 'net_version' }))
      } catch {
        warning(false, 'net_version v2 was unsuccessful, falling back to manual matches and static properties')
      }
    }

    if (!chainId) {
      if ((okxwallet as any).isDapper) {
        chainId = parseSendReturn((okxwallet as any).cachedResults.net_version)
      } else {
        chainId =
          (okxwallet as any).chainId ||
          (okxwallet as any).netVersion ||
          (okxwallet as any).networkVersion ||
          (okxwallet as any)._chainId
      }
    }

    return chainId
  }

  public async getAccount(): Promise<null | string> {
    if (!okxwallet) {
      throw new NoEthereumProviderError()
    }

    let account
    try {
      account = await (okxwallet.send as Send)('eth_accounts').then(sendReturn => parseSendReturn(sendReturn)[0])
    } catch {
      warning(false, 'eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      account = parseSendReturn((okxwallet.send as SendOld)({ method: 'eth_accounts' }))[0]
    }

    return account
  }

  public deactivate() {
    if (okxwallet && okxwallet.removeListener) {
      okxwallet.removeListener('chainChanged', this.handleChainChanged)
      okxwallet.removeListener('accountsChanged', this.handleAccountsChanged)
      okxwallet.removeListener('close', this.handleClose)
      okxwallet.removeListener('networkChanged', this.handleNetworkChanged)
    }
  }

  public async isAuthorized(): Promise<boolean> {
    if (!okxwallet) {
      return false
    }

    try {
      return await (okxwallet.send as Send)('eth_accounts').then(sendReturn => {
        if (parseSendReturn(sendReturn).length > 0) {
          return true
        } else {
          return false
        }
      })
    } catch {
      return false
    }
  }
}
