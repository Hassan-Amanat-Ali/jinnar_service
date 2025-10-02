import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top on route change; if a hash exists, scroll to that element smoothly
const ScrollToTop = () => {
  const location = useLocation();
  const { pathname, hash, key } = location;

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      // Wait a tick so the section exists in DOM after navigation
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
