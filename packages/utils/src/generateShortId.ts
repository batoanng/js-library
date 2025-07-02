const SHORT_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

export const generateShortId = () => {
  let shortId = '';

  for (let i = 0; i < 8; i++) {
    const nextIndex = Math.floor(Math.random() * SHORT_ID_CHARS.length);
    shortId += SHORT_ID_CHARS[nextIndex];
  }

  return shortId;
};
