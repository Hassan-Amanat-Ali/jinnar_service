import React, { useEffect } from "react";
import "./google.css";

const GoogleTranslate = ({ containerId = "google_translate_element" }) => {
  useEffect(() => {
    const ensureInitialized = (targetId) => {
      if (
        window.google &&
        window.google.translate &&
        window.google.translate.TranslateElement
      ) {
        try {
          // eslint-disable-next-line no-new
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,sw,fr",
              autoDisplay: false,
            },
            targetId
          );
        } catch (e) {
          // ignore
        }
      }
    };

    const filterLanguages = () => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        Array.from(select.options).forEach((option) => {
          if (
            !["en", "sw", "fr"].includes(option.value) &&
            option.value !== ""
          ) {
            option.remove();
          }
        });
      }
    };

    window._gtPendingIds = window._gtPendingIds || new Set();
    window._gtPendingIds.add(containerId);

    const globalInit = () => {
      const ids = Array.from(window._gtPendingIds || []);
      ids.forEach((id) => ensureInitialized(id));
      const observer = new MutationObserver(filterLanguages);
      observer.observe(document.body, { childList: true, subtree: true });
      window.setGoogleTranslateLanguage = function setGoogleTranslateLanguage(
        langCode
      ) {
        const attemptSet = (retries = 12) => {
          const select = document.querySelector(".goog-te-combo");
          if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
          }
          if (retries > 0) setTimeout(() => attemptSet(retries - 1), 150);
          return false;
        };
        attemptSet();
      };
    };

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = globalInit;
    }

    const existing = document.getElementById("google-translate-script");
    if (!existing) {
      const googleScript = document.createElement("script");
      googleScript.id = "google-translate-script";
      googleScript.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      googleScript.async = true;
      document.body.appendChild(googleScript);
    } else {
      ensureInitialized(containerId);
    }
  }, [containerId]);

  return (
    <div className="translate-wrapper">
      <div id={containerId}></div>
    </div>
  );
};

export default GoogleTranslate;
