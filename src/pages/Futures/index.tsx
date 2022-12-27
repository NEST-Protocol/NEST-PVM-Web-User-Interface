import { FC } from "react"
import { checkWidth } from "../../libs/utils"
import FuturesMobile from "./Mobile"

const Futures: FC = () => {
    const isPC = checkWidth()
    return isPC ? <></> : <FuturesMobile />
}

export default Futures