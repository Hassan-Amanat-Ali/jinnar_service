import React, { useState, useEffect } from "react";
import { getFullImageUrl } from "../../utils/fileUrl";

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "/placeholder-avatar.jpg",
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src ? getFullImageUrl(src) : fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src) {
      setImgSrc(getFullImageUrl(src));
      setHasError(false);
    } else {
      setImgSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || "Image"}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

export default OptimizedImage;
