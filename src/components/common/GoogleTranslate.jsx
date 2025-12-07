import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./google.css";

const GoogleTranslate = ({ containerId = "google_translate_element" }) => {
  const location = useLocation();
  const [hasCombo, setHasCombo] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  const forceSelectValue = (select, value) => {
    if (select && value && select.querySelector(`option[value="${value}"]`)) {
      select.value = value;
      // Store the forced value to prevent resets
      select.dataset.forcedValue = value;
    }
  };

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
            new window.google.translate.TranslateElement(
              {
                pageLanguage: "en",
                includedLanguages:
                  "en,sw,fr,zu,xh,af,am,ha,ig,yo,so,sn,st,rw,ny,mg,zu",
                autoDisplay: false,
              },
              targetId
            );
          } catch {
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

    const forceSelectValue = (select, value) => {
      if (select && value && select.querySelector(`option[value="${value}"]`)) {
        select.value = value;
        // Store the forced value to prevent resets
        select.dataset.forcedValue = value;
      }
    };

    const filterLanguages = () => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        // Store current value before filtering
        const storedValue = select.dataset.forcedValue || select.value;

        const allowedLanguages = [
          "en",
          "sw",
          "fr",
          "zu",
          "xh",
          "af",
          "am",
          "ha",
          "ig",
          "yo",
          "so",
          "sn",
          "st",
          "rw",
          "ny",
          "mg",
        ];
        Array.from(select.options).forEach((option) => {
          if (!allowedLanguages.includes(option.value) && option.value !== "") {
            option.remove();
          }
        });

        // Restore value after filtering
        if (storedValue && storedValue !== "") {
          forceSelectValue(select, storedValue);
        }
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

          // Force maintain selection after any DOM changes
          if (select) {
            const storedValue = select.dataset.forcedValue;
            if (
              storedValue &&
              storedValue !== "" &&
              select.value !== storedValue
            ) {
              forceSelectValue(select, storedValue);
            }

            // Add/update change event listener
            if (!select.dataset.listenerAdded) {
              select.dataset.listenerAdded = "true";

              select.addEventListener("change", (e) => {
                const selectedValue = e.target.value;
                setCurrentLang(selectedValue);

                // Prevent reset by continuously monitoring and restoring
                const monitorInterval = setInterval(() => {
                  const currentSelect =
                    document.querySelector(".goog-te-combo");
                  if (currentSelect) {
                    if (
                      currentSelect.value === "" ||
                      currentSelect.value !== selectedValue
                    ) {
                      forceSelectValue(currentSelect, selectedValue);
                    } else {
                      clearInterval(monitorInterval);
                    }
                  }
                }, 50);

                // Stop monitoring after 3 seconds
                setTimeout(() => clearInterval(monitorInterval), 3000);
              });
            }
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      window.setGoogleTranslateLanguage = function setGoogleTranslateLanguage(
        langCode
      ) {
        const attemptSet = (retries = 15) => {
          const select = document.querySelector(".goog-te-combo");
          if (select) {
            forceSelectValue(select, langCode);
            select.dispatchEvent(new Event("change", { bubbles: true }));
            setCurrentLang(langCode);
            return true;
          }
          if (retries > 0) setTimeout(() => attemptSet(retries - 1), 100);
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

      // Restore and maintain previous language selection
      const restoreAndMaintain = () => {
        const select = document.querySelector(".goog-te-combo");
        if (select && currentLang && currentLang !== "en") {
          forceSelectValue(select, currentLang);
        }
      };

      // Multiple attempts to ensure restoration works
      setTimeout(restoreAndMaintain, 100);
      setTimeout(restoreAndMaintain, 300);
      setTimeout(restoreAndMaintain, 500);
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search, location.hash, currentLang]);

  return (
    <div className={`translate-wrapper ${hasCombo ? "show-arrow" : ""}`}>
      <div id={containerId}></div>
    </div>
  );
};

export default GoogleTranslate;
