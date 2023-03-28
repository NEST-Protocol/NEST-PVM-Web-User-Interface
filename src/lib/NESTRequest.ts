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

export function KOLClick(info: RequestBodyInterface) {
//   const infoString = `?kolLink=${JSON.stringify(info.kolLink)}`;
  baseRequestPOSTWithBody("kol/click", info);
}

export function KOLWallet(info: RequestBodyInterface) {
//   const infoString = `?kolLink=${info.kolLink}&wallet=${info.wallet}`;
  baseRequestPOSTWithBody("kol/wallet", info);
}

export function KOLTx(info: RequestBodyInterface) {
//   const infoString = `?kolLink=${info.kolLink}&hash=${info.hash}`;
  baseRequestPOSTWithBody("kol/tx", info);
}
