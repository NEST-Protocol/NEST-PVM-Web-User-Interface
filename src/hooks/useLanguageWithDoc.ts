import { i18n } from "@lingui/core";
import { useMemo } from "react";

function useLanguageWithDoc() {
  const docLink = useMemo(() => {
    const locale = i18n.locale;
    if (locale === "en") {
      return "https://www.nestprotocol.org/blogs/How-to-make-your-first-trade-on-NESTFi-with-Lightning-Trade-feature";
    } else if (locale === "ko") {
      return "https://www.nestprotocol.org/blogs/Korean-How-to-make-your-first-trade-on-NESTFi-with-Lightning-Trade-feature";
    } else if (locale === "pt") {
      return "https://www.nestprotocol.org/blogs/Portuguese-How-to-make-your-first-trade-on-NESTFi-with-Lightning-Trade-feature";
    } else if (locale === "vi") {
      return "https://www.nestprotocol.org/blogs/Vietnamese-How-to-make-your-first-trade-on-NESTFi-with-Lightning-Trade-feature";
    } else if (locale === "tr") {
      return "https://www.nestprotocol.org/blogs/Turkish-How-to-make-your-first-trade-on-NESTFi-with-Lightning-Trade-feature";
    } else if (locale === "ru") {
      return "https://www.nestprotocol.org/blogs/Russian-How-to-make-your-first-trade-on-NESTFi-with-Lightning-Trade-feature";
    } else {
      return "https://www.nestprotocol.org/blogs/How-to-make-your-first-trade-on-NESTFi-with-Lightning-Trade-feature";
    }
  }, []);

  return {
    docLink,
  };
}

export default useLanguageWithDoc;
