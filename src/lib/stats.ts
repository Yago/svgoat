import { byteLength, formatBytes, formatSavingsPercent } from './bytes';

/**
 * @param raw - Original SVG markup.
 * @param optimized - Optimized SVG markup.
 * @param dimensions - Source dimensions label, if available.
 * @returns Single-line stats summary for the UI.
 */
export const buildStatsLine = (
  raw: string,
  optimized: string,
  dimensions: string | null,
): string => {
  const rawBytes = byteLength(raw);
  const optimizedBytes = byteLength(optimized);
  const base = `${formatBytes(rawBytes)} → ${formatBytes(optimizedBytes)} (${formatSavingsPercent(rawBytes, optimizedBytes)})`;

  return dimensions ? `${base} · ${dimensions}` : base;
};
