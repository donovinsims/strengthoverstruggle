import { useEffect } from "react";
import { APP_CONFIG } from "@/config/app.config";

export const DataFastAnalytics = () => {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const analyticsConfig = APP_CONFIG.analytics.datafast;
    if (!analyticsConfig.websiteId) {
      return;
    }

    const script = document.createElement("script");
    script.src = analyticsConfig.scriptSrc;
    script.defer = true;
    script.setAttribute("data-website-id", analyticsConfig.websiteId);

    if (analyticsConfig.domain) {
      script.setAttribute("data-domain", analyticsConfig.domain);
    }

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};
