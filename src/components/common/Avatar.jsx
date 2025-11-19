import React from 'react';
import { User } from 'lucide-react';

/**
 * Avatar component that displays profile picture or fallback to initials/icon
 * @param {string} src - Profile picture URL
 * @param {string} name - User's name for generating initials
 * @param {string} size - Size class (default, sm, lg, xl)
 * @param {string} className - Additional CSS classes
 */
const Avatar = ({ src, name, size = 'default', className = '' }) => {
  const [imageError, setImageError] = React.useState(false);
  
  // Size mappings
  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    default: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };
  
  const iconSizes = {
    sm: 12,
    default: 16,
    md: 20,
    lg: 24,
    xl: 32,
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.default;
  const iconSize = iconSizes[size] || iconSizes.default;
  
  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  // Generate color from name for consistent colors per user
  const getColorFromName = (name) => {
    if (!name) return 'bg-gray-400';
    
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];
    
    // Simple hash function to get consistent color for same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  // If image is available and hasn't errored, show image
  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name || 'User'}
        className={`${sizeClass} rounded-full object-cover shrink-0 ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Show initials or icon as fallback
  if (name) {
    return (
      <div
        className={`${sizeClass} rounded-full ${getColorFromName(name)} flex items-center justify-center text-white font-semibold shrink-0 ${className}`}
        title={name}
      >
        {getInitials(name)}
      </div>
    );
  }
  
  // Show generic user icon if no name
  return (
    <div
      className={`${sizeClass} rounded-full bg-gray-400 flex items-center justify-center text-white shrink-0 ${className}`}
    >
      <User size={iconSize} />
    </div>
  );
};

export default Avatar;
