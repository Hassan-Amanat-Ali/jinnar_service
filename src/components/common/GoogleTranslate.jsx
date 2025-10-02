import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./google.css";

const GoogleTranslate = ({ containerId = "google_translate_element" }) => {
  const location = useLocation();
  const [hasCombo, setHasCombo] = useState(false);

  useEffect(() => {
    const ensureInitialized = (targetId) => {
      const doInit = () => {
        if (
          window.google &&
          window.google.translate &&
          window.google.translate.TranslateElement
        ) {
          try {
            const container = document.getElementById(targetId);
            if (!container) return;
            // Avoid duplicate widgets in the same container
            const alreadyHasWidget = container.querySelector(
              ".goog-te-gadget, .goog-te-gadget-simple"
            );
            if (alreadyHasWidget) return;
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

      // If library not ready yet, poll briefly
      let attempts = 0;
      const maxAttempts = 20;
      const interval = setInterval(() => {
        attempts += 1;
        if (
          window.google &&
          window.google.translate &&
          window.google.translate.TranslateElement
        ) {
          clearInterval(interval);
          doInit();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 150);
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
      const observer = new MutationObserver(() => {
        filterLanguages();
        const container = document.getElementById(containerId);
        if (container) {
          const select = container.querySelector(".goog-te-combo");
          setHasCombo(Boolean(select));
        }
      });
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

  // Re-initialize on route changes to handle SPA navigations
  useEffect(() => {
    // Small delay to allow target node to mount in new route
    const timer = setTimeout(() => {
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search, location.hash]);

  return (
    <div className={`translate-wrapper ${hasCombo ? "show-arrow" : ""}`}>
      <div id={containerId}></div>
    </div>
  );
};

export default GoogleTranslate;
