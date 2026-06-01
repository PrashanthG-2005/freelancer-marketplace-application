/**
 * Central default avatar URL.
 * Used everywhere a profile picture is displayed so all fallbacks are consistent.
 */
export const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=6366f1&color=fff&size=128&bold=true&name=User';

/**
 * Returns the profile picture URL, falling back to DEFAULT_AVATAR if none is set
 * or if the stored value is still one of the old broken server-relative paths.
 */
export const getAvatar = (url, name = '') => {
  if (!url || url.startsWith('/default-')) {
    // Generate a personalised avatar using the user's name if available
    const encodedName = encodeURIComponent(name || 'User');
    return `https://ui-avatars.com/api/?background=6366f1&color=fff&size=128&bold=true&name=${encodedName}`;
  }
  return url;
};
