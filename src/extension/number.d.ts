
/* eslint-disable no-extend-native */
declare global {
  interface Number {
    floor(decimals: number): string;
  }
}

Number.prototype.floor = function (decimals: number) {
  return (Math.floor(this * 10 ** decimals) / 10 ** decimals).toString();
};

export {};
