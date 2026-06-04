/**
 * @param svg - Raw SVG markup.
 * @returns Width×height from attributes or viewBox, or null if unknown.
 */
export const extractDimensions = (svg: string): string | null => {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const el = doc.querySelector('svg');
  if (!el) {
    return null;
  }

  const width = el.getAttribute('width');
  const height = el.getAttribute('height');
  if (width && height) {
    return `${width}×${height}`;
  }

  const viewBox = el.getAttribute('viewBox');
  if (!viewBox) {
    return null;
  }

  const parts = viewBox.trim().split(/[\s,]+/);
  if (parts.length !== 4) {
    return null;
  }

  const w = Number(parts[2]);
  const h = Number(parts[3]);
  if (!Number.isFinite(w) || !Number.isFinite(h)) {
    return null;
  }

  return `${Math.round(w)}×${Math.round(h)}`;
};
