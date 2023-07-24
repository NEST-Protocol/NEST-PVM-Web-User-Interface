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
    const res = await fetch(url, {
      method: "POST",
      headers: { ...header, "Content-Type": "application/json" },
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
export function serviceLogin(
  chainId: number,
  address: string,
  info: RequestBodyInterface
): Promise<any> {
  return baseRequestPOSTWithBody_return(
    `https://api.nestfi.net/nestfi/op/user/login?chainId=${chainId}&walletAddress=${address}`,
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
    `https://api.nestfi.net/nestfi/op/future/open?chainId=${chainId}&direction=${direction}&leverage=${leverage}&limit=${limit}&margin=${margin}&orderPrice=${orderPrice}&product=${product}&stopLossPrice=${stopLossPrice}&takeProfitPrice=${takeProfitPrice}&walletAddress=${address}`,
    header,
    {}
  );
}

export function serviceAdd(
  append: string,
  chainId: string,
  id: string,
  header: RequestBodyInterface
): Promise<any> {
  return baseRequestPOSTWithBody_return(
    `https://api.nestfi.net/nestfi/op/future/add?append=${append}&chainId=${chainId}&id=${id}`,
    header,
    {}
  );
}

export function serviceUpdateStopPrice(
  id: string,
  stopLossPrice: string,
  takeProfitPrice: string,
  header: RequestBodyInterface
): Promise<any> {
  return baseRequestPOSTWithBody_return(
    `https://api.nestfi.net/nestfi/op/future/updateStopPrice?id=${id}&stopLossPrice=${stopLossPrice}&takeProfitPrice=${takeProfitPrice}`,
    header,
    {}
  );
}

export function serviceUpdateLimitPrice(
  id: string,
  limitPrice: string,
  header: RequestBodyInterface
): Promise<any> {
  return baseRequestPOSTWithBody_return(
    `https://api.nestfi.net/nestfi/op/future/updateLimitPrice?id=${id}&limitPrice=${limitPrice}`,
    header,
    {}
  );
}

export function serviceCancel(id: string, header: RequestBodyInterface) {
  return baseRequestPOSTWithBody_return(
    `https://api.nestfi.net/nestfi/op/future/cancel?id=${id}`,
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
    `https://api.nestfi.net/nestfi/op/user/withdraw?amount=${amount}&chainId=${chainId}&token=${token}&tokenAddress=${tokenAddress}&walletAddress=${walletAddress}`,
    header,
    {}
  );
}

export function serviceClose(id: string, header: RequestBodyInterface) {
  return baseRequestPOSTWithBody_return(
    `https://api.nestfi.net/nestfi/op/future/close?id=${id}`,
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
    `https://api.nestfi.net/nestfi/op/user/asset?chainId=${chainId}&walletAddress=${address}`,
    info
  );
}

export function serviceList(
  chainId: number,
  address: string,
  info: RequestBodyInterface
): Promise<any> {
  return baseRequestGetWithHeader(
    `https://api.nestfi.net/nestfi/op/future/list?chainId=${chainId}&walletAddress=${address}`,
    info
  );
}

export function serviceAccountList(
  chainId: number,
  address: string,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `https://api.nestfi.net/nestfi/op/user/depositWithdraw/list?chainId=${chainId}&walletAddress=${address}`,
    info
  );
}

export function serviceHistory(
  chainId: number,
  address: string,
  info: RequestBodyInterface
) {
  return baseRequestGetWithHeader(
    `https://api.nestfi.net/nestfi/op/future/history?chainId=${chainId}&walletAddress=${address}`,
    info
  );
}
