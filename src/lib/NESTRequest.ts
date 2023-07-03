// function baseRequestGet(url: string) {
//     return
// }

const BASE_URL = "https://api.nestfi.net/api/";

interface RequestBodyInterface {
  [key: string]: string | `0x${string}`;
}

async function baseRequestPOSTWithBody(
  url: string,
  body: RequestBodyInterface
) {
  try {
    await fetch(BASE_URL + url, {
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

async function baseRequestPOST(url: string) {
  try {
    await fetch(BASE_URL + url, {
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

export function KOLClick(info: RequestBodyInterface) {
  baseRequestPOSTWithBody("kol/click", info);
}

export function KOLWallet(info: RequestBodyInterface) {
  baseRequestPOSTWithBody("kol/wallet", info);
}

export function KOLTx(info: RequestBodyInterface) {
  baseRequestPOSTWithBody("kol/tx", info);
}

export function hideFuturesOrder(
  chainId: number,
  address: string,
  index: string
) {
  const url = `order/save/${chainId}?address=${address}&index=${index.toString()}`;

  baseRequestPOST(url);
}

export function getPriceFromNESTLocal(token: string): Promise<any> {
  return baseRequestGet(`https://api.nestfi.net/api/oracle/price/${token}usdt`);
}

export function getNESTAmountForAll(address: string, chainId: number): Promise<any> {
  return baseRequestGet(
    `https://api.nestfi.net/api/oracle/whitelist?adddress=${address}&chainId=${chainId}`
  );
}
