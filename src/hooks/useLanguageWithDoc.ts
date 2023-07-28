import { i18n } from "@lingui/core";
import { useMemo } from "react";

function useLanguageWithDoc() {
  const docLink = useMemo(() => {
    const locale = i18n.locale;
    if (locale === "en") {
      return "https://www.nestprotocol.org/blogs/How-to-trade-on-NESTFi-Website";
    } else if (locale === "ko") {
      return "https://www.nestprotocol.org/blogs/How-to-trade-on-NESTFi-Website";
    } else if (locale === "pt") {
      return "https://www.nestprotocol.org/blogs/How-to-trade-on-NESTFi-Website";
    } else if (locale === "vi") {
      return "https://www.nestprotocol.org/blogs/How-to-trade-on-NESTFi-Website";
    } else {
      return "https://www.nestprotocol.org/blogs/How-to-trade-on-NESTFi-Website";
    }
  }, []);

  return {
    docLink,
  };
}

export default useLanguageWithDoc;
