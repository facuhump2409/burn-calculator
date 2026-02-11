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
  // All ages now use anterior/posterior split based on Lund-Browder method
  // Returns percentages for: head, torsoAnterior, torsoPosterior, abdomenAnterior, 
  // abdomenPosterior, rightArmAnterior, leftArmAnterior, rightArmPosterior, 
  // leftArmPosterior, rightLegAnterior, leftLegAnterior, rightLegPosterior, 
  // leftLegPosterior, genitals
  
  if (ageYears < 1) {
    // 1-year-old Lund-Browder percentages from medical paper
    return {
      head: 4.5, // shared between front and back
      torsoAnterior: 8, // split as 4% left + 4% right
      torsoPosterior: 8,
      abdomenAnterior: 8, // split as 4% left + 4% right
      abdomenPosterior: 8,
      rightArmAnterior: 1.5,
      leftArmAnterior: 1.5,
      rightArmPosterior: 1.5,
      leftArmPosterior: 1.5,
      rightLegAnterior: 6, // 3.5% upper + 2.5% lower
      leftLegAnterior: 6,
      rightLegPosterior: 6,
      leftLegPosterior: 6,
      genitals: 1,
    };
  }
  
  if (ageYears < 5) {
    // Age 1-4 years - similar to 1-year pattern
    return {
      head: 4.5,
      torsoAnterior: 8,
      torsoPosterior: 8,
      abdomenAnterior: 8,
      abdomenPosterior: 8,
      rightArmAnterior: 1.5,
      leftArmAnterior: 1.5,
      rightArmPosterior: 1.5,
      leftArmPosterior: 1.5,
      rightLegAnterior: 6.5,
      leftLegAnterior: 6.5,
      rightLegPosterior: 6.5,
      leftLegPosterior: 6.5,
      genitals: 1,
    };
  }
  
  if (ageYears < 10) {
    // Age 5-9 years
    return {
      head: 4.5,
      torsoAnterior: 8.5,
      torsoPosterior: 8.5,
      abdomenAnterior: 8.5,
      abdomenPosterior: 8.5,
      rightArmAnterior: 2,
      leftArmAnterior: 2,
      rightArmPosterior: 2,
      leftArmPosterior: 2,
      rightLegAnterior: 8,
      leftLegAnterior: 8,
      rightLegPosterior: 8,
      leftLegPosterior: 8,
      genitals: 1,
    };
  }
  
  if (ageYears < 15) {
    // Age 10-14 years
    return {
      head: 4.5,
      torsoAnterior: 9,
      torsoPosterior: 9,
      abdomenAnterior: 9,
      abdomenPosterior: 9,
      rightArmAnterior: 4.5,
      leftArmAnterior: 4.5,
      rightArmPosterior: 4.5,
      leftArmPosterior: 4.5,
      rightLegAnterior: 9,
      leftLegAnterior: 9,
      rightLegPosterior: 9,
      leftLegPosterior: 9,
      genitals: 1,
    };
  }
  
  // 15+ years (adult)
  return {
    head: 4.5,
    torsoAnterior: 9,
    torsoPosterior: 9,
    abdomenAnterior: 9,
    abdomenPosterior: 9,
    rightArmAnterior: 4.5,
    leftArmAnterior: 4.5,
    rightArmPosterior: 4.5,
    leftArmPosterior: 4.5,
    rightLegAnterior: 9,
    leftLegAnterior: 9,
    rightLegPosterior: 9,
    leftLegPosterior: 9,
    genitals: 1,
  };
}

export function getDefaultBodyAreas(ageYears: number) {
  const percentages = getLundBrowderPercentages(ageYears);
  
  return {
    head: percentages.head,
    torsoAnterior: percentages.torsoAnterior,
    torsoPosterior: percentages.torsoPosterior,
    abdomenAnterior: percentages.abdomenAnterior,
    abdomenPosterior: percentages.abdomenPosterior,
    rightArmAnterior: percentages.rightArmAnterior,
    leftArmAnterior: percentages.leftArmAnterior,
    rightArmPosterior: percentages.rightArmPosterior,
    leftArmPosterior: percentages.leftArmPosterior,
    rightLegAnterior: percentages.rightLegAnterior,
    leftLegAnterior: percentages.leftLegAnterior,
    rightLegPosterior: percentages.rightLegPosterior,
    leftLegPosterior: percentages.leftLegPosterior,
    genitals: percentages.genitals,
    // Legacy properties for backward compatibility (set to 0)
    rightArm: 0,
    leftArm: 0,
    rightLeg: 0,
    leftLeg: 0,
  };
}
