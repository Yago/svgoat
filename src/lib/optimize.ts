import { optimize } from 'svgo/browser';

import { svgoConfig } from '../config/svgo-config';

import { sanitizeSvg } from './sanitize';

export type OptimizeFailureReason = 'empty' | 'failed';

export type OptimizeResult =
  | { ok: true; data: string }
  | { ok: false; reason: OptimizeFailureReason };

/**
 * Runs SVGO with the frozen project config and sanitizes the output for DOM use.
 *
 * @param source - Raw SVG markup.
 * @returns Optimized sanitized markup, or a failure reason.
 */
export const runOptimization = (source: string): OptimizeResult => {
  try {
    const { data } = optimize(source, svgoConfig);

    if (!data?.trim()) {
      return { ok: false, reason: 'empty' };
    }

    return { ok: true, data: sanitizeSvg(data) };
  } catch {
    return { ok: false, reason: 'failed' };
  }
};
