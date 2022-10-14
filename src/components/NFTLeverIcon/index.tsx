import classNames from "classnames";
import { FC } from "react";
import { NFTGreenPencil } from "../Icon";
import "./styles";

export type NFTLeverIconType = {
    lever: number
}

const NFTLeverIcon: FC<NFTLeverIconType> = ({...props}) => {
    return <NFTGreenPencil className={classNames({
        [`NFTLeverIcon`]: true,
        [`lever1`]: props.lever === 1,
        [`lever2`]: props.lever === 2,
        [`lever3`]: props.lever === 3,
        [`lever4`]: props.lever === 4,
    })}/>
}

export default NFTLeverIcon