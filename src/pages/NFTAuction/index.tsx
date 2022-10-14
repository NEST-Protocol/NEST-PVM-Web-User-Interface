import { FC } from "react";
import MainCard from "../../components/MainCard";
import "./styles";

const NFTAuction: FC = () => {
  const classPrefix = "NFTAuction";
  return (
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-top`}>
        <MainCard classNames={`${classPrefix}-top-left`}></MainCard>
        <MainCard classNames={`${classPrefix}-top-right`}></MainCard>
      </div>
      <div className={`${classPrefix}-bottom`}>
      <MainCard classNames={`${classPrefix}-bottom-main`}></MainCard>
      </div>
    </div>
  );
};

export default NFTAuction;
