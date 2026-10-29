/**
 * Search tab page numbers: which numbers to show, and reading the
 * "Go to page" box. SISE never knows the last page (each provider has its
 * own total and Wikimedia reports none), so the row shows pages around the
 * current one, the furthest page seen, and a trailing gap while there may
 * be more.
 *
 * @package SISE
 * @since   2.2.0
 */

'use strict';

/** Marker for "…" in the page row. */
export const GAP = '…';

/** Pages shown behind and ahead of the current page. */
const BEHIND = 2;
const AHEAD = 3;

/** Highest page the jump box accepts. Providers run out long before this. */
export const MAX_PAGE = 999;

/**
 * @param {number} current Current page (1-based).
 * @param {object} [state]
 * @param {boolean} [state.hasNext]  Whether the current page suggests there is more.
 * @param {number}  [state.furthest] Furthest page that returned results this search.
 * @returns {Array<number|string>} Page numbers with GAP where pages are skipped,
 *   e.g. [1, '…', 4, 5, 6, 7, 8, 9, '…'].
 */
export function pageWindow(current, { hasNext = false, furthest = 0 } = {}) {
  const cur = Number.isInteger(current) && current >= 1 ? current : 1;
  const far = Number.isInteger(furthest) ? furthest : 0;
  const high = cur + (hasNext ? AHEAD : 0);

  const pages = new Set([1]);
  for (let p = Math.max(1, cur - BEHIND); p <= high; p++) pages.add(p);
  if (far > high) pages.add(far);

  const out = [];
  let prev = 0;
  for (const p of [...pages].sort((a, b) => a - b)) {
    if (p - prev === 2) out.push(prev + 1);   // a gap would hide one page: show it
    else if (p - prev > 2) out.push(GAP);
    out.push(p);
    prev = p;
  }
  if (hasNext) out.push(GAP);
  return out;
}

/**
 * Read the "Go to page" box.
 *
 * @param {string} value
 * @returns {number|null} A whole page number from 1 to MAX_PAGE, else null.
 */
export function parsePageInput(value) {
  const text = String(value ?? '').trim();
  if (!/^\d+$/.test(text)) return null;
  const n = Number(text);
  return n >= 1 && n <= MAX_PAGE ? n : null;
}
