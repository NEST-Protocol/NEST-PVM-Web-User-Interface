import { FC } from "react"
import "./styles";
import WinV2LeftCard from "./LeftCard";
import WinV2RightCard from "./RightCard";

const WinV2: FC = () => {
    const classPrefix = "winV2";

    return (
        <div className={`${classPrefix}`}>
            <WinV2LeftCard />
            <WinV2RightCard />
        </div>
    )
}

export default WinV2