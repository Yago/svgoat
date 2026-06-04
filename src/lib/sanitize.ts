import DOMPurify from 'dompurify';

/**
 * @param svg - SVG markup (typically SVGO output).
 * @returns Sanitized SVG safe for inline DOM injection.
 */
export const sanitizeSvg = (svg: string): string =>
  DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
  });
