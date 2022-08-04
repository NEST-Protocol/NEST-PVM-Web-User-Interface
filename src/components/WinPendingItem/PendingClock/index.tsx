import { Tooltip } from "antd";
import { FC, useEffect, useState } from "react";
import { ClockPosition } from "../../Icon";
import "./styles";

type PendingClockType = {
  leftTime: number;
  allTime: number;
  index: number;
}

const PendingClock:FC<PendingClockType> = ({...props}) => {
  const classPrefix = "pendingClock";
  const [lastLeftTime, setLastLeftTime] = useState<number>(0);
  const [lastLeftTimeNum, setLastLeftTimeNum] = useState<number>();
  const [timeString, setTimeString] = useState<string>();

  useEffect(() => {
    const du = 360 - props.leftTime / props.allTime * 360 + (-90)
    var canvas = document.getElementById(`topClock-${props.index}`) as any;
    var cv = canvas?.getContext("2d");
    cv.clearRect(0,0,34,34);
    cv.beginPath();
    cv.moveTo(17, 17);
    cv.arc(17, 17, 17, (du * Math.PI) / 180, (270 * Math.PI) / 180);
    cv.fillStyle = "#80C269";
    cv.fill();

    var canvas2 = document.getElementById(`position-${props.index}`);
    canvas2!.style.transform = `rotate(${du}deg)`;
    
  }, [props.allTime, props.index, props.leftTime])

  // set time string
  useEffect(() => {
      const setTime = () => {
        if (props.leftTime !== lastLeftTime) {
          setLastLeftTime(props.leftTime);
          setLastLeftTimeNum(props.leftTime);
        }
        if (lastLeftTimeNum) {
          const min = parseInt((lastLeftTimeNum / 60).toString());
          const second = (lastLeftTimeNum - min * 60).toString();
          setTimeString(`${min}:${second.length === 1 ? ('0' + second ): second}`);
          setLastLeftTimeNum(
            lastLeftTimeNum - 1 >= 0 ? lastLeftTimeNum - 1 : 0
          );
        }
      };
      const time = setInterval(() => {
        setTime();
      }, 1000);
      return () => {
        clearTimeout(time);
      };
  }, [lastLeftTime, lastLeftTimeNum, props.leftTime]);

  return (
    <div className={classPrefix}>
      <Tooltip
          placement="bottom"
          color={"#ffffff"}
          title={`${timeString ? timeString : '--:--'}`}
        >
          <div id={`position-${props.index}`} className={`${classPrefix}-position`}><ClockPosition/></div>
      <canvas id={`topClock-${props.index}`} width={`34px`} height={`34px`}>
        {/* Your browser does not support the canvas element. */}
      </canvas>
        </Tooltip>
      
    </div>
  );
};

export default PendingClock;

export const PendingClockSmall:FC<PendingClockType> = ({...props}) => {
  const classPrefix = "pendingClock-small";

  useEffect(() => {
    const du = 360 - props.leftTime / props.allTime * 360 + (-90)
    var canvas = document.getElementById(`topClock-${props.index}`) as any;
    var cv = canvas?.getContext("2d");
    cv.clearRect(0,0,24,24);
    cv.beginPath();
    cv.moveTo(12, 12);
    cv.arc(12, 12, 12, (du * Math.PI) / 180, (270 * Math.PI) / 180);
    cv.fillStyle = "#80C269";
    cv.fill();

    var canvas2 = document.getElementById(`position-${props.index}`);
    canvas2!.style.transform = `rotate(${du}deg)`;
    
  }, [props.allTime, props.index, props.leftTime])
  return (
    <div className={classPrefix}>
      <div id={`position-${props.index}`} className={`${classPrefix}-position`}><ClockPosition/></div>
      <canvas id={`topClock-${props.index}`} width={`24px`} height={`24px`}>
        {/* Your browser does not support the canvas element. */}
      </canvas>
    </div>
  );
};
