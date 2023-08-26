// function baseRequestGet(url: string) {
//     return
// }

export interface RequestBodyInterface {
  [key: string]: string | `0x${string}`;
}

async function baseRequestPOSTWithBody(
  url: string,
  body: RequestBodyInterface
) {
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.log(error);
  }
}

async function baseRequestPOSTWithBody_return(
  url: string,
  header: { [key: string]: string },
  body: RequestBodyInterface
) {
  try {
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...header,
        "Content-Type": "application/json",
        token: currentTimestampInSeconds.toString(),
      },
      body: JSON.stringify(body),
    });
    const resJson = await res.json();
    return resJson;
  } catch (error) {
    console.log(error);
  }
}

async function baseRequestPOST(url: string) {
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
}

async function baseRequestGet(url: string) {
  try {
    const res = await fetch(url);
    const resJson = await res.json();
    return resJson;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function baseRequestGetWithHeader(
  url: string,
  header: { [key: string]: string }
) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { ...header, "Content-Type": "application/json" },
    });
    const resJson = await res.json();
    return resJson;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export function KOLClick(info: RequestBodyInterface) {
  baseRequestPOSTWithBody("https://api.nestfi.net/api/kol/click", info);
}

export function KOLWallet(info: RequestBodyInterface) {
  baseRequestPOSTWithBody("https://api.nestfi.net/api/kol/wallet", info);
}

export function KOLTx(info: RequestBodyInterface) {
  baseRequestPOSTWithBody("https://api.nestfi.net/api/kol/tx", info);
}

export function futuresHistory(address: string, chainId: number): Promise<any> {
  return baseRequestGet(
    `https://api.nestfi.net/api/dashboard/history/list?address=${address}&chainId=${chainId}`
  );
}

export function hideFuturesOrder(
  chainId: number,
  address: string,
  index: string
) {
  const url = `https://api.nestfi.net/api/order/save/${chainId}?address=${address}&index=${index.toString()}`;

  baseRequestPOST(url);
}

export function getPriceFromNESTLocal(token: string): Promise<any> {
  return baseRequestGet(`https://api.nestfi.net/api/oracle/price/${token}usdt`);
}

export function getPriceList(): Promise<any> {
  return baseRequestGet(`https://api.nestfi.net/api/oracle/price/list`);
}

export function getNESTAmountForAll(
  address: string,
  chainId: number
): Promise<any> {
  return baseRequestGet(
    `https://api.nestfi.net/api/oracle/whitelist?address=${address}&chainId=${chainId}`
  );
}

/**
 * service
 */

export function serviceBaseURL(chainId: number) {
  if (chainId === 56) {
    return "https://api.nestfi.net";
  } else {
    return "https://dev.nestfi.net";
  }
}
export function serviceLogin(
  chainId: number,
  address: string,
  remember: boolean,
  info: RequestBodyInterface
): Promise<any> {
  return baseRequestPOSTWithBody_return(
    `${serviceBaseURL(
      chainId
    )}/nestfi/op/user/login?chainId=${chainId}&walletAddress=${address}&remember=${remember}`,
    info,
    {}
  );
}

export function serviceOpen(
  chainId: number,
  address: string,
  direction: boolean,
  leverage: number,
  limit: boolean,
  margin: number,
  orderPrice: number,
  product: string,
  stopLossPrice: number,
  takeProfitPrice: number,
  header: RequestBodyInterface
): Promise<any> {
  return baseRequestPOSTWithBody_return(
    `${serviceBaseURL(
      chainId
    )}/nestfi/op/future/open?chainId=${chainId}&direction=${direction}&leverage=${leverage}&limit=${limit}&margin=${margin}&orderPrice=${orderPrice}&product=${product}&stopLossPrice=${stopLossPrice}&takeProfitPrice=${takeProfitPrice}&walletAddress=${address}`,
    header,
    {}
  );
}

export function serviceAdd(
  append: string,
  chainId: number,
  id: string,
  header: RequestBodyInterface
): Promise<any> {
  return baseRequestPOSTWithBody_return(
    `${serviceBaseURL(
      chainId
    )}/nestfi/op/future/add?append=${append}&chainId=${chainId}&id=${id}`,
    header,
    {}
  );
}

export function serviceUpdateStopPrice(
  id: string,
  stopLossPrice: string,
  takeProfitPrice: string,
  chainId: number,
  header: RequestBodyInterface
): Promise<any> {
  return baseRequestPOSTWithBody_return(
    `${serviceBaseURL(
      chainId
    )}/nestfi/op/future/updateStopPrice?id=${id}&stopLossPrice=${stopLossPrice}&takeProfitPrice=${takeProfitPrice}`,
    header,
    {}
  );
}

export function serviceUpdateLimitPrice(
  id: string,
  limitPrice: string,
  chainId: number,
  header: RequestBodyInterface
): Promise<any> {
  return baseRequestPOSTWithBody_return(
    `${serviceBaseURL(
      chainId
    )}/nestfi/op/future/updateLimitPrice?id=${id}&limitPrice=${limitPrice}`,
    header,
    {}
  );
}

export function serviceCancel(
  id: string,
  chainId: number,
  header: RequestBodyInterface
) {
  return baseRequestPOSTWithBody_return(
    `${serviceBaseURL(chainId)}/nestfi/op/future/cancel?id=${id}`,
    header,
    {}
  );
}

export function serviceWithdraw(
  amount: number,
  chainId: number,
  token: string,
  tokenAddress: string,
  walletAddress: string,
  header: RequestBodyInterface
) {
  return baseRequestPOSTWithBody_return(
    `${serviceBaseURL(
      chainId
    )}/nestfi/op/user/withdraw?amount=${amount}&chainId=${chainId}&token=${token}&tokenAddress=${tokenAddress}&walletAddress=${walletAddress}`,
    header,
    {}
  );
}

export function serviceClose(
  id: string,
  chainId: number,
  header: RequestBodyInterface
) {
  return baseRequestPOSTWithBody_return(
    `${serviceBaseURL(chainId)}/nestfi/op/future/close?id=${id}`,
    header,
    {}
  );
}

export function serviceAsset(
  chainId: number,
  address: string,
  info: RequestBodyInterface
): Promise<any> {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/op/user/asset?chainId=${chainId}&walletAddress=${address}`,
    info
  );
}

export function serviceList(
  chainId: number,
  address: string,
  info: RequestBodyInterface
): Promise<any> {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/op/future/list?chainId=${chainId}&walletAddress=${address}`,
    info
  );
}

export function serviceAccountList(
  chainId: number,
  address: string,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/op/user/depositWithdraw/list?chainId=${chainId}&walletAddress=${address}`,
    info
  );
}

export function serviceHistory(
  chainId: number,
  address: string,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/op/future/history?chainId=${chainId}&walletAddress=${address}`,
    info
  );
}

/**
 * Copy
 */
export function copyFollow(
  chainId: number,
  header: RequestBodyInterface,
  body: RequestBodyInterface
) {
  return baseRequestPOSTWithBody_return(
    `${serviceBaseURL(chainId)}/nestfi/copy/follower/setting`,
    header,
    body
  );
}

export function copyClose(
  chainId: number,
  address: string,
  header: RequestBodyInterface
) {
  return baseRequestPOSTWithBody_return(
    `${serviceBaseURL(
      chainId
    )}/nestfi/copy/follower/cancle?chainId=${chainId}&copyKolAddress=${address}`,
    header,
    {}
  );
}

export function copyAllKOL(chainId: number, info: RequestBodyInterface) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(chainId)}/nestfi/copy/kol/list?chainId=${chainId}`,
    info
  );
}

export function copyMyTradeInfo(chainId: number, info: RequestBodyInterface) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/copy/follower/position/info?chainId=${chainId}`,
    info
  );
}

export function copyKOLInfo(
  chainId: number,
  address: string,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/copy/kol/info?chainId=${chainId}&walletAddress=${address}`,
    info
  );
}

export function copyEarningsList(
  chainId: number,
  address: string,
  days: number,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/copy/kol/earnings/list?chainId=${chainId}&copyKolAddress=${address}&days=${days}`,
    info
  );
}

export function copyPerformance(
  chainId: number,
  address: string,
  days: number,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/copy/kol/performance/info?chainId=${chainId}&copyKolAddress=${address}&days=${days}`,
    info
  );
}

export function copyPerformanceSymbol(
  chainId: number,
  address: string,
  days: number,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/copy/kol/performance/symbol?chainId=${chainId}&copyKolAddress=${address}&days=${days}`,
    info
  );
}

export function copyTraderFollowers(
  chainId: number,
  address: string,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/copy/kol/follower/list?chainId=${chainId}&copyKolAddress=${address}`,
    info
  );
}

export function copyMyCopiesList(chainId: number, info: RequestBodyInterface) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/copy/follower/future/list?chainId=${chainId}`,
    info
  );
}

export function copyMyCopiesHistoryList(
  chainId: number,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/copy/follower/future/history?chainId=${chainId}`,
    info
  );
}

export function copyMyCopiesMyTradersList(
  chainId: number,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/copy/follower/kolList?chainId=${chainId}`,
    info
  );
}

export function copyCloseInfo(
  chainId: number,
  address: string,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `${serviceBaseURL(
      chainId
    )}/nestfi/copy/follower/future/info?chainId=${chainId}&copyKolAddress=${address}`,
    info
  );
}
