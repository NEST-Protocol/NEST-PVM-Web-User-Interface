import {tokenList} from "../constants/addresses";



const useTokenPairSymbol = (tokenPair: string) => {
  const TokenOneSvg = tokenList[tokenPair.split('/')[0]].Icon;
  const TokenTwoSvg = tokenList[tokenPair.split('/')[1]].Icon;

  return {
    TokenOneSvg,
    TokenTwoSvg,
  }
}

export default useTokenPairSymbol