import { cubicBezier } from "../cubic-bezier"

describe("cubicBezier", () => {
    test("correctly generates easing functions from curve definitions", () => {
        const linear = cubicBezier(0, 0, 1, 1)
        expect(linear(0)).toBe(0)
        expect(linear(1)).toBe(1)
        expect(linear(0.5)).toBe(0.5)

        const curve = cubicBezier(0.5, 0.1, 0.31, 0.96)
        expect(curve(0)).toBe(0)
        expect(curve(0.01)).toBeCloseTo(0.002, 2)
        expect(curve(0.25)).toBeCloseTo(0.164, 2)
        expect(curve(0.75)).toBeCloseTo(0.935, 2)
        expect(curve(0.99)).toBeCloseTo(0.999, 2)
        expect(curve(1)).toBe(1)
    })

    test("is exact and not quantised", () => {
        const ease = cubicBezier(0.25, 0.1, 0.25, 1)
        // x(t) and y(t) for t = 0.3
        const t = 0.3
        const x =
            3 * 0.25 * t * (1 - t) ** 2 + 3 * 0.25 * t * t * (1 - t) + t ** 3
        const y = 3 * 0.1 * t * (1 - t) ** 2 + 3 * t * t * (1 - t) + t ** 3
        expect(ease(x)).toBeCloseTo(y, 12)

        const values = new Set<number>()
        for (let i = 0; i <= 1000; i++) values.add(ease(0.3 + i * 1e-6))
        expect(values.size).toBe(1001)
    })
})
