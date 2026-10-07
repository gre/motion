/*
  Bezier function generator
  This has been modified from Gaëtan Renaudeau's BezierEasing
  https://github.com/gre/bezier-easing/blob/master/src/index.js
  https://github.com/gre/bezier-easing/blob/master/LICENSE

  It uses the closed-form solver of bezier-easing 3.2 to find t for a
  given x: exact, monotonic, and faster than iterating.

  Usage
    const easeOut = cubicBezier(.17,.67,.83,.67);
    const x = easeOut(0.5); // returns 0.627...
*/

import { noop } from "../noop"

// Solves x(t) = ((2a * t + 3b) * t + 3c) * t = x for t, with x in (0, 1):
// u = 1/t is the largest real root of x·u³ − 3c·u² − 3b·u − 2a = 0
function solveTForX(x: number, a: number, b: number, c: number) {
    const j = 1 / Math.max(c, Math.sqrt(x))
    const k = x * j
    const l = k * j
    const s = c * j
    const q = b * l
    const m = s * s + q
    const h = -s * (s * s + 1.5 * q) - a * k * l
    const D = h * h - m * m * m
    let v: number
    if (m === 0 || D > 1e-12 * h * h) {
        // one real root (Cardano)
        const U = -Math.cbrt(h < 0 ? h - Math.sqrt(D) : h + Math.sqrt(D))
        v = U + m / U || 0
    } else {
        // three real roots, take the largest
        const r = Math.sqrt(m)
        v =
            2 *
            r *
            Math.cos(Math.acos(Math.max(-1, Math.min(1, -h / (m * r)))) / 3)
    }
    return Math.min(1, k / (v + s))
}

/*#__NO_SIDE_EFFECTS__*/
export function cubicBezier(
    mX1: number,
    mY1: number,
    mX2: number,
    mY2: number
) {
    // If this is a linear gradient, return linear easing
    if (mX1 === mY1 && mX2 === mY2) return noop

    // x(t) = ((2a * t + 3b) * t + 3c) * t, y(t) = ((ay * t + by) * t + cy) * t
    const a = (3 * mX1 - 3 * mX2 + 1) / 2
    const b = mX2 - 2 * mX1
    const ay = 3 * mY1 - 3 * mY2 + 1
    const by = 3 * (mY2 - 2 * mY1)
    const cy = 3 * mY1

    // Outside of (0, 1), t saturates to 0 / 1
    return (t: number) => {
        if (!(t > 0 && t < 1)) return t <= 0 ? 0 : t >= 1 ? 1 : t
        const u = solveTForX(t, a, b, mX1)
        return ((ay * u + by) * u + cy) * u
    }
}
