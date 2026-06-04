const sizeFormat = new Intl.NumberFormat('en', {
  maximumFractionDigits: 1,
});

/**
 * @param text - String to measure in UTF-8 bytes.
 * @returns Byte length of the encoded string.
 */
export const byteLength = (text: string): number =>
  new TextEncoder().encode(text).length;

/**
 * @param bytes - Size in bytes.
 * @returns Human-readable size (B or KB).
 */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  return `${sizeFormat.format(bytes / 1024)} KB`;
};

/**
 * @param raw - Original size in bytes.
 * @param optimized - Optimized size in bytes.
 * @returns Relative savings label (e.g. "−75%").
 */
export const formatSavingsPercent = (raw: number, optimized: number): string => {
  if (raw <= 0) {
    return '0%';
  }
  const percent = ((raw - optimized) / raw) * 100;
  const rounded = Math.round(percent);
  return rounded <= 0 ? '0%' : `−${rounded}%`;
};
