// =============================================================================
// src/lib/pagination.test.js
// SISE — Tests for the Search tab's numbered page row and jump box.
//
// @package SISE
// @since   2.2.0
// =============================================================================

'use strict';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GAP, pageWindow, parsePageInput } from '../../public/pagination.js';

describe('pageWindow', () => {
  it('shows the first page and three ahead when there is more', () => {
    assert.deepEqual(pageWindow(1, { hasNext: true }), [1, 2, 3, 4, GAP]);
  });

  it('shows page 1, two behind, three ahead and gaps in the middle of a long run', () => {
    assert.deepEqual(pageWindow(6, { hasNext: true, furthest: 6 }), [1, GAP, 4, 5, 6, 7, 8, 9, GAP]);
  });

  it('shows a number instead of a gap that would hide only one page', () => {
    assert.deepEqual(pageWindow(4, { hasNext: true }), [1, 2, 3, 4, 5, 6, 7, GAP]);
    assert.deepEqual(pageWindow(5, { hasNext: false, furthest: 5 }), [1, 2, 3, 4, 5]);
  });

  it('stops at the current page on the last page', () => {
    assert.deepEqual(pageWindow(8, { hasNext: false, furthest: 8 }), [1, GAP, 6, 7, 8]);
  });

  it('keeps the furthest page seen reachable after going back', () => {
    assert.deepEqual(pageWindow(2, { hasNext: true, furthest: 12 }), [1, 2, 3, 4, 5, GAP, 12, GAP]);
    assert.deepEqual(pageWindow(2, { hasNext: true, furthest: 6 }), [1, 2, 3, 4, 5, 6, GAP]);
  });

  it('treats a bad current page as page 1', () => {
    assert.deepEqual(pageWindow(0, { hasNext: false }), [1]);
  });
});

describe('parsePageInput', () => {
  it('accepts a whole page number of 1 or more', () => {
    assert.equal(parsePageInput('7'), 7);
    assert.equal(parsePageInput(' 12 '), 12);
  });

  it('rejects anything else', () => {
    for (const bad of ['', '0', '-3', '2.5', 'abc', '1e3', '10000']) {
      assert.equal(parsePageInput(bad), null, bad);
    }
  });
});
