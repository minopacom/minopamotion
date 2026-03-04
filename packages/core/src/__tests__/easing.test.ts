import { describe, it, expect } from 'vitest';
import { Easing } from '../animation/easing.js';

describe('Easing', () => {
  it('linear returns input unchanged', () => {
    expect(Easing.linear(0)).toBe(0);
    expect(Easing.linear(0.5)).toBe(0.5);
    expect(Easing.linear(1)).toBe(1);
  });

  it('quad squares the input', () => {
    expect(Easing.quad(0)).toBe(0);
    expect(Easing.quad(0.5)).toBe(0.25);
    expect(Easing.quad(1)).toBe(1);
  });

  it('cubic cubes the input', () => {
    expect(Easing.cubic(0)).toBe(0);
    expect(Easing.cubic(0.5)).toBeCloseTo(0.125);
    expect(Easing.cubic(1)).toBe(1);
  });

  it('poly(n) raises to the nth power', () => {
    expect(Easing.poly(4)(0.5)).toBeCloseTo(0.0625);
    expect(Easing.poly(1)(0.5)).toBe(0.5); // same as linear
    expect(Easing.poly(2)(0.5)).toBe(0.25); // same as quad
  });

  it('sin starts at 0 and ends at 1', () => {
    expect(Easing.sin(0)).toBeCloseTo(0);
    expect(Easing.sin(1)).toBeCloseTo(1);
    expect(Easing.sin(0.5)).toBeGreaterThan(0);
    expect(Easing.sin(0.5)).toBeLessThan(1);
  });

  it('bounce boundary values', () => {
    expect(Easing.bounce(0)).toBe(0);
    expect(Easing.bounce(1)).toBeCloseTo(1);
    // bounce increases overall
    expect(Easing.bounce(0.5)).toBeGreaterThan(0);
  });

  it('bezier passes through endpoints', () => {
    const ease = Easing.bezier(0.25, 0.1, 0.25, 1);
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
  });

  it('bezier with asymmetric control points differs from linear at midpoint', () => {
    const ease = Easing.bezier(0.42, 0, 1, 1);
    expect(ease(0.5)).not.toBe(0.5);
  });

  it('out combinator reverses easing', () => {
    const outQuad = Easing.out(Easing.quad);
    // out(quad)(t) = 1 - quad(1 - t) = 1 - (1-t)^2
    // at t=0.5: 1 - 0.25 = 0.75
    expect(outQuad(0.5)).toBeCloseTo(0.75);
    expect(outQuad(0)).toBe(0);
    expect(outQuad(1)).toBe(1);
  });

  it('in combinator is identity', () => {
    const inQuad = Easing.in(Easing.quad);
    expect(inQuad(0.5)).toBe(Easing.quad(0.5));
  });

  it('inOut combinator is symmetric', () => {
    const inOutQuad = Easing.inOut(Easing.quad);
    expect(inOutQuad(0)).toBe(0);
    expect(inOutQuad(1)).toBe(1);
    expect(inOutQuad(0.5)).toBeCloseTo(0.5);
    // Symmetry: f(t) + f(1-t) = 1
    expect(inOutQuad(0.25) + inOutQuad(0.75)).toBeCloseTo(1);
  });

  it('elastic returns values near 1 at t=1', () => {
    const elastic = Easing.elastic(1);
    expect(elastic(0)).toBeCloseTo(0, 1);
    expect(elastic(1)).toBeCloseTo(1);
  });

  it('back overshoots before reaching target', () => {
    const back = Easing.back(1.70158);
    expect(back(0)).toBeCloseTo(0);
    expect(back(1)).toBeCloseTo(1);
    // back goes negative at small t values
    expect(back(0.1)).toBeLessThan(0);
  });
});
