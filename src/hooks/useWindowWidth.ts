import { useCallback, useEffect, useMemo, useState } from "react";
export enum WidthType {
  ssm,
  sm,
  md,
  lg,
  xl,
  xxl,
}

function useWindowWidth() {
  const getType = (width: number) => {
    if (width < 420) {
      return WidthType.ssm;
    } else if (width < 768) {
      return WidthType.sm;
    } else if (width < 992) {
      return WidthType.md;
    } else if (width < 1200) {
      return WidthType.lg;
    } else if (width < 1600) {
      return WidthType.xl;
    } else {
      return WidthType.xxl;
    }
  };
  const defaultType = useMemo(() => {
    const w = window.innerWidth;
    return getType(w);
  }, []);
  const [width, setWidth] = useState<WidthType>(defaultType);

  const resizeUpdate = useCallback((e: any) => {
    const w = e.target.innerWidth;
    setWidth(getType(w));
  }, []);

  useEffect(() => {
    const w = window.innerWidth;
    setWidth(getType(w));
    window.addEventListener("resize", resizeUpdate);
    return () => {
      window.removeEventListener("resize", resizeUpdate);
    };
  }, [resizeUpdate]);

  const headHeight = useMemo(() => {
    switch (width) {
      case WidthType.ssm:
      case WidthType.sm:
      case WidthType.md:
        return 60;
      default:
        return 63;
    }
  }, [width]);

  const isMobile = useMemo(() => {
    switch (width) {
      case WidthType.ssm:
        return true;
      default:
        return false;
    }
  }, [width]);
  const isBigMobile = useMemo(() => {
    switch (width) {
      case WidthType.ssm:
      case WidthType.sm:
        return true;
      default:
        return false;
    }
  }, [width]);
  const isPC = useMemo(() => {
    switch (width) {
      case WidthType.xl:
      case WidthType.xxl:
        return true;
      default:
        return false;
    }
  }, [width]);
  const isPCPad = useMemo(() => {
    switch (width) {
      case WidthType.lg:
      case WidthType.xl:
      case WidthType.xxl:
        return true;
      default:
        return false;
    }
  }, [width]);

  return { width, headHeight, isMobile, isBigMobile, isPC, isPCPad };
}

export default useWindowWidth;
