import { describe, expect, it } from 'vitest';
import { adultAreaDefinitions, childAreaDefinitions } from './bodyAreaDefinitions';
import { getLundBrowderPercentages } from './calculations';

const sumMaxValues = (keys: string[], defs: Record<string, { maxValue: number }>) =>
  keys.reduce((total, key) => total + defs[key].maxValue, 0);

const sumBySide = (side: 'front' | 'back', defs: Record<string, { maxValue: number; side: string }>) =>
  Object.values(defs).reduce((total, def) => (def.side === side ? total + def.maxValue : total), 0);


describe('Body diagram percentages (AGENTS.md)', () => {
  it('matches child (<10) percentages for the graph', () => {
    const defs = childAreaDefinitions;

    expect(sumMaxValues(
      ['headLeftAnterior', 'headRightAnterior', 'headLeftPosterior', 'headRightPosterior'],
      defs
    )).toBeCloseTo(18, 5);

    expect(sumMaxValues(
      ['torsoLeftAnterior', 'torsoRightAnterior', 'abdomenLeftAnterior', 'abdomenRightAnterior'],
      defs
    )).toBeCloseTo(16, 5);

    expect(sumMaxValues(
      ['torsoLeftPosterior', 'torsoRightPosterior', 'abdomenLeftPosterior', 'abdomenRightPosterior'],
      defs
    )).toBeCloseTo(16, 5);

    expect(sumMaxValues(
      [
        'rightHandAnterior',
        'rightForearmAnterior',
        'rightUpperArmAnterior',
        'leftHandAnterior',
        'leftForearmAnterior',
        'leftUpperArmAnterior',
      ],
      defs
    )).toBeCloseTo(9, 5);

    expect(sumMaxValues(
      [
        'rightHandPosterior',
        'rightForearmPosterior',
        'rightUpperArmPosterior',
        'leftHandPosterior',
        'leftForearmPosterior',
        'leftUpperArmPosterior',
      ],
      defs
    )).toBeCloseTo(9, 5);

    expect(sumMaxValues(['rightThighAnterior', 'leftThighAnterior'], defs)).toBeCloseTo(7, 5);
    expect(sumMaxValues(['rightThighPosterior', 'leftThighPosterior'], defs)).toBeCloseTo(7, 5);

    expect(sumMaxValues(['rightLowerLegAnterior', 'leftLowerLegAnterior'], defs)).toBeCloseTo(5, 5);
    expect(sumMaxValues(['rightLowerLegPosterior', 'leftLowerLegPosterior'], defs)).toBeCloseTo(5, 5);

    expect(sumMaxValues(['rightFootAnterior', 'leftFootAnterior'], defs)).toBeCloseTo(3, 5);
    expect(sumMaxValues(['rightFootPosterior', 'leftFootPosterior'], defs)).toBeCloseTo(3, 5);

    expect(sumBySide('front', defs)).toBeCloseTo(49, 5);
    expect(sumBySide('back', defs)).toBeCloseTo(51, 5);
  });

  it('matches adult (10+) percentages for the graph', () => {
    const defs = adultAreaDefinitions;

    expect(sumMaxValues(['headAnterior', 'headPosterior'], defs)).toBeCloseTo(9, 5);

    expect(sumMaxValues(
      ['torsoLeftAnterior', 'torsoRightAnterior', 'abdomenLeftAnterior', 'abdomenRightAnterior'],
      defs
    )).toBeCloseTo(18, 5);

    expect(sumMaxValues(
      ['torsoLeftPosterior', 'torsoRightPosterior', 'abdomenLeftPosterior', 'abdomenRightPosterior'],
      defs
    )).toBeCloseTo(18, 5);

    expect(sumMaxValues(
      [
        'rightHandAnterior',
        'rightForearmAnterior',
        'rightUpperArmAnterior',
        'leftHandAnterior',
        'leftForearmAnterior',
        'leftUpperArmAnterior',
      ],
      defs
    )).toBeCloseTo(9, 5);

    expect(sumMaxValues(
      [
        'rightHandPosterior',
        'rightForearmPosterior',
        'rightUpperArmPosterior',
        'leftHandPosterior',
        'leftForearmPosterior',
        'leftUpperArmPosterior',
      ],
      defs
    )).toBeCloseTo(9, 5);

    expect(sumMaxValues(['rightThighAnterior', 'leftThighAnterior'], defs)).toBeCloseTo(9, 5);
    expect(sumMaxValues(['rightThighPosterior', 'leftThighPosterior'], defs)).toBeCloseTo(9, 5);

    expect(sumMaxValues(['rightLowerLegAnterior', 'leftLowerLegAnterior'], defs)).toBeCloseTo(6, 5);
    expect(sumMaxValues(['rightLowerLegPosterior', 'leftLowerLegPosterior'], defs)).toBeCloseTo(6, 5);

    expect(sumMaxValues(['rightFootAnterior', 'leftFootAnterior'], defs)).toBeCloseTo(3, 5);
    expect(sumMaxValues(['rightFootPosterior', 'leftFootPosterior'], defs)).toBeCloseTo(3, 5);

    expect(sumBySide('front', defs)).toBeCloseTo(49.5, 5);
    expect(sumBySide('back', defs)).toBeCloseTo(50.5, 5);
  });
});

describe('Lund-Browder calculation percentages (AGENTS.md)', () => {
  it('matches the 1-year-old table for age < 1', () => {
    const percentages = getLundBrowderPercentages(0.5);

    expect(percentages.headLeftAnterior).toBe(4.5);
    expect(percentages.headRightAnterior).toBe(4.5);
    expect(percentages.headLeftPosterior).toBe(4.5);
    expect(percentages.headRightPosterior).toBe(4.5);

    expect(percentages.torsoLeftAnterior).toBe(4);
    expect(percentages.torsoRightAnterior).toBe(4);
    expect(percentages.abdomenLeftAnterior).toBe(4);
    expect(percentages.abdomenRightAnterior).toBe(4);

    expect(percentages.rightHandAnterior).toBe(1.5);
    expect(percentages.rightForearmAnterior).toBe(1.5);
    expect(percentages.rightUpperArmAnterior).toBe(1.5);

    expect(percentages.rightLowerLegAnterior).toBe(2.5);
    expect(percentages.rightThighAnterior).toBe(3.5);
    expect(percentages.rightFootAnterior).toBe(1.5);
  });

  it('matches the 10+ table for age 10', () => {
    const percentages = getLundBrowderPercentages(10);

    expect(percentages.headAnterior).toBe(4.5);
    expect(percentages.headPosterior).toBe(4.5);
    expect(percentages.headLeftAnterior).toBe(0);
    expect(percentages.headRightAnterior).toBe(0);

    expect(percentages.torsoLeftAnterior).toBe(4.5);
    expect(percentages.torsoRightAnterior).toBe(4.5);
    expect(percentages.abdomenLeftAnterior).toBe(4.5);
    expect(percentages.abdomenRightAnterior).toBe(4.5);

    expect(percentages.rightHandAnterior).toBe(1.5);
    expect(percentages.rightForearmAnterior).toBe(1.5);
    expect(percentages.rightUpperArmAnterior).toBe(1.5);

    expect(percentages.rightLowerLegAnterior).toBe(3);
    expect(percentages.rightThighAnterior).toBe(4.5);
    expect(percentages.rightFootAnterior).toBe(1.5);
  });
});
