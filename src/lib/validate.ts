/**
 * @param text - Clipboard or file contents.
 * @returns Whether the text likely contains an SVG root element.
 */
export const isLikelySvg = (text: string): boolean => {
  const trimmed = text.trim();
  return /<svg[\s>]/i.test(trimmed);
};
