export function calculateFluidNeeds(weightKg: number, bsaPercentage: number) {
  // Parkland Formula: 4ml × kg × %BSA
  const totalIn24h = Math.round(4 * weightKg * bsaPercentage);
  const first8h = Math.round(totalIn24h / 2);
  const rateFirst8h = Math.round(first8h / 8);
  const remaining16h = Math.round(totalIn24h / 2);
  const rateRemaining16h = Math.round(remaining16h / 16);

  return {
    totalIn24h,
    first8h,
    rateFirst8h,
    remaining16h,
    rateRemaining16h,
  };
}

export function getBurnClassification(bsaPercentage: number): string {
  if (bsaPercentage < 15) return 'Menor';
  if (bsaPercentage < 25) return 'Moderada';
  return 'Mayor';
}

export function getAgeGroup(ageYears: number): string {
  if (ageYears < 1) return 'Menor de 1 año';
  if (ageYears < 5) return '1-4 años';
  if (ageYears < 10) return '5-9 años';
  if (ageYears < 15) return '10-14 años';
  return '15+ años';
}

export function getLundBrowderPercentages(ageYears: number) {
  if (ageYears < 1) {
    return {
      head: 19,
      neck: 2,
      torsoAnterior: 13,
      torsoPosterior: 13,
      rightArm: 4.5,
      leftArm: 4.5,
      rightHand: 2.25,
      leftHand: 2.25,
      rightLeg: 13,
      leftLeg: 13,
      rightFoot: 3.5,
      leftFoot: 3.5,
      genitals: 1,
    };
  }
  if (ageYears < 5) {
    return {
      head: 17,
      neck: 2,
      torsoAnterior: 13,
      torsoPosterior: 13,
      rightArm: 4,
      leftArm: 4,
      rightHand: 2,
      leftHand: 2,
      rightLeg: 14,
      leftLeg: 14,
      rightFoot: 3,
      leftFoot: 3,
      genitals: 1,
    };
  }
  if (ageYears < 10) {
    return {
      head: 13,
      neck: 2,
      torsoAnterior: 13,
      torsoPosterior: 13,
      rightArm: 4,
      leftArm: 4,
      rightHand: 2,
      leftHand: 2,
      rightLeg: 16,
      leftLeg: 16,
      rightFoot: 3.5,
      leftFoot: 3.5,
      genitals: 1,
    };
  }
  if (ageYears < 15) {
    return {
      head: 11,
      neck: 2,
      torsoAnterior: 13,
      torsoPosterior: 13,
      rightArm: 4.5,
      leftArm: 4.5,
      rightHand: 2.25,
      leftHand: 2.25,
      rightLeg: 17,
      leftLeg: 17,
      rightFoot: 3.5,
      leftFoot: 3.5,
      genitals: 1,
    };
  }
  // 15+ years (adult)
  return {
    head: 9,
    neck: 2,
    torsoAnterior: 18,
    torsoPosterior: 18,
    rightArm: 4.5,
    leftArm: 4.5,
    rightHand: 2.25,
    leftHand: 2.25,
    rightLeg: 18,
    leftLeg: 18,
    rightFoot: 3.5,
    leftFoot: 3.5,
    genitals: 1,
  };
}

export function getDefaultBodyAreas(ageYears: number) {
  const percentages = getLundBrowderPercentages(ageYears);
  
  return {
    head: percentages.head,
    torsoAnterior: percentages.torsoAnterior,
    torsoPosterior: percentages.torsoPosterior,
    rightArm: percentages.rightArm + percentages.rightHand,
    leftArm: percentages.leftArm + percentages.leftHand,
    rightLeg: percentages.rightLeg + percentages.rightFoot,
    leftLeg: percentages.leftLeg + percentages.leftFoot,
    genitals: percentages.genitals,
  };
}
