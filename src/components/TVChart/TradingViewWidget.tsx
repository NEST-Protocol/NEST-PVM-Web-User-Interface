// TradingViewWidget.jsx

import React, {useEffect, useRef} from 'react';
import useTheme from "../../hooks/useTheme";

let tvScriptLoadingPromise: any;

export default function TradingViewWidget() {
  const onLoadScriptRef = useRef();
  const {nowTheme} = useTheme()

  // @ts-ignore
  useEffect(() => {
      // @ts-ignore
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;

          document.head.appendChild(script);
        });
      }

      // @ts-ignore
      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      // @ts-ignore
      return () => onLoadScriptRef.current = null;

      function createWidget() {
        if (document.getElementById('tradingview_ae4c7') && 'TradingView' in window) {
          // @ts-ignore
          new window.TradingView.widget({
            autosize: true,
            symbol: "BINANCE:BTCUSDT",
            interval: "D",
            timezone: "Etc/UTC",
            theme: nowTheme.isLight ? "light" : "dark",
            style: "1",
            locale: "zh_CN",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            withdateranges: true,
            hide_side_toolbar: false,
            save_image: false,
            container_id: "tradingview_ae4c7"
          });
        }
      }
    },
    []
  );

  return (
    <div id='tradingview_ae4c7' style={{
      height: '100%'
    }}/>
  );
}
