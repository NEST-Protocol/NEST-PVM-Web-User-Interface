import { formatTVDate, formatTVTime } from "../../lib/dates";

const RED = "#FF4F33";
const GREEN = "#36C56E";
export const DEFAULT_PERIOD = "4h";

const chartStyleOverrides = ["candleStyle", "hollowCandleStyle", "haStyle"].reduce((acc, cv) => {
  // @ts-ignore
  acc[`mainSeriesProperties.${cv}.drawWick`] = true;
  // @ts-ignore
  acc[`mainSeriesProperties.${cv}.drawBorder`] = false;
  // @ts-ignore
  acc[`mainSeriesProperties.${cv}.upColor`] = GREEN;
  // @ts-ignore
  acc[`mainSeriesProperties.${cv}.downColor`] = RED;
  // @ts-ignore
  acc[`mainSeriesProperties.${cv}.wickUpColor`] = GREEN;
  // @ts-ignore
  acc[`mainSeriesProperties.${cv}.wickDownColor`] = RED;
  // @ts-ignore
  acc[`mainSeriesProperties.${cv}.borderUpColor`] = GREEN;
  // @ts-ignore
  acc[`mainSeriesProperties.${cv}.borderDownColor`] = RED;
  return acc;
}, {});

const chartOverrides = {
  "paneProperties.background": "#171A1F",
  "paneProperties.backgroundType": "solid",
  // "paneProperties.vertGridProperties.color": "rgba(35, 38, 59, 1)",
  // "paneProperties.vertGridProperties.style": 2,
  // "paneProperties.horzGridProperties.color": "rgba(35, 38, 59, 1)",
  // "paneProperties.horzGridProperties.style": 2,
  // "mainSeriesProperties.priceLineColor": "#3a3e5e",
  // "scalesProperties.textColor": "#fff",
  // "scalesProperties.lineColor": "#171A1F",
  ...chartStyleOverrides,
};

const disabledFeatures = [
  "volume_force_overlay",
  "show_logo_on_all_charts",
  "caption_buttons_text_if_possible",
  "create_volume_indicator_by_default",
  "header_compare",
  "compare_symbol",
  "display_market_status",
  "header_interval_dialog_button",
  "show_interval_dialog_on_key_press",
  "header_symbol_search",
  "popup_hints",
  "use_localstorage_for_settings",
  "right_bar_stays_on_scroll",
  "symbol_info",
  "header_saveload",
];
const enabledFeatures = [
  "seconds_resolution",
  "side_toolbar_in_fullscreen_mode",
  "header_in_fullscreen_mode",
  "hide_resolution_in_legend",
  "items_favoriting",
  "hide_left_toolbar_by_default",
  "iframe_loading_compatibility_mode",
  "header_fullscreen_button",
];

export const defaultChartProps = {
  theme: "Light",
  locale: "en",
  library_path: "charting_library/",
  clientId: "tradingview.com",
  userId: "public_user_id",
  fullscreen: false,
  autosize: true,
  header_widget_dom_node: false,
  overrides: chartOverrides,
  enabled_features: enabledFeatures,
  disabled_features: disabledFeatures,
  custom_css_url: "/tradingview-chart.css",
  loading_screen: { backgroundColor: "#171A1F", foregroundColor: "#fff" },
  favorites: {
    intervals: ["1S", "5", "15", "60", "240", "1D"],
  },
  custom_formatters: {
    timeFormatter: {
      // @ts-ignore
      format: (date) => formatTVTime(date),
    },
    dateFormatter: {
      // @ts-ignore
      format: (date) => formatTVDate(date),
    },
  },
};
