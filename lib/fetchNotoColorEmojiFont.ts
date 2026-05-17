export const NOTO_COLOR_EMOJI_FONT_URL =
  "https://raw.githubusercontent.com/googlefonts/noto-emoji/v2.042/fonts/NotoColorEmoji.ttf" as const;

export const NOTO_COLOR_EMOJI_FAMILY = "Noto Color Emoji" as const;

export const fetchNotoColorEmojiFont = async (): Promise<ArrayBuffer> => {
  const response = await fetch(NOTO_COLOR_EMOJI_FONT_URL);

  if (!response.ok) {
    throw new Error(`Noto Color Emoji font failed: ${response.status}`);
  }

  return response.arrayBuffer();
};
