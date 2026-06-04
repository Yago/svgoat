import type { OptimizeFailureReason } from './optimize';

const OPTIMIZE_ERROR_MESSAGES: Record<OptimizeFailureReason, string> = {
  empty: 'Optimization produced an empty result.',
  failed: 'Optimization failed. The SVG may be malformed or unsupported.',
};

/**
 * @param reason - SVGO pipeline failure reason.
 * @returns User-facing error message.
 */
export const optimizeErrorMessage = (reason: OptimizeFailureReason): string =>
  OPTIMIZE_ERROR_MESSAGES[reason];
