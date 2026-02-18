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
  // Returns percentages based on age
  // For children < 10: Uses detailed subdivisions
  // For adults >= 10: Uses combined anatomical regions
  
  if (ageYears < 1) {
    // 1-year-old with detailed subdivisions matching medical diagram
    return {
      // Head - divided into 4 quadrants
      headLeftAnterior: 4.5,
      headRightAnterior: 4.5,
      headLeftPosterior: 4.5,
      headRightPosterior: 4.5,
      headAnterior: 0, // Not used for children
      headPosterior: 0,
      
      // Torso - divided into left/right sections
      torsoLeftAnterior: 4,
      torsoRightAnterior: 4,
      torsoLeftPosterior: 4,
      torsoRightPosterior: 4,
      
      // Abdomen - divided into left/right sections
      abdomenLeftAnterior: 4,
      abdomenRightAnterior: 4,
      abdomenLeftPosterior: 4,
      abdomenRightPosterior: 4,
      
      // Right arm - detailed subdivisions
      rightHandAnterior: 1.5,
      rightForearmAnterior: 1.5,
      rightUpperArmAnterior: 1.5,
      rightHandPosterior: 1.5,
      rightForearmPosterior: 1.5,
      rightUpperArmPosterior: 1.5,
      rightArmAnterior: 0, // Not used for children
      rightArmPosterior: 0,
      
      // Left arm - detailed subdivisions  
      leftHandAnterior: 1.5,
      leftForearmAnterior: 1.5,
      leftUpperArmAnterior: 1.5,
      leftHandPosterior: 1.5,
      leftForearmPosterior: 1.5,
      leftUpperArmPosterior: 1.5,
      leftArmAnterior: 0, // Not used for children
      leftArmPosterior: 0,
      
      // Right leg - detailed subdivisions
      rightFootAnterior: 1.5,
      rightLowerLegAnterior: 2.5,
      rightThighAnterior: 3.5,
      rightFootPosterior: 1.5,
      rightLowerLegPosterior: 2.5,
      rightThighPosterior: 3.5,
      rightLegAnterior: 0, // Not used for children
      rightLegPosterior: 0,
      
      // Left leg - detailed subdivisions
      leftFootAnterior: 1.5,
      leftLowerLegAnterior: 2.5,
      leftThighAnterior: 3.5,
      leftFootPosterior: 1.5,
      leftLowerLegPosterior: 2.5,
      leftThighPosterior: 3.5,
      leftLegAnterior: 0, // Not used for children
      leftLegPosterior: 0,
      
      // Genitals - not tracked for 1-year-olds
      genitalAnterior: 0,
      genitalPosterior: 0,
    };
  }
  
  if (ageYears < 5) {
    // Age 1-4 years - similar pattern to 1-year-old with slight adjustments
    return {
      headLeftAnterior: 4.5,
      headRightAnterior: 4.5,
      headLeftPosterior: 4.5,
      headRightPosterior: 4.5,
      headAnterior: 0,
      headPosterior: 0,
      
      torsoLeftAnterior: 4,
      torsoRightAnterior: 4,
      torsoLeftPosterior: 4,
      torsoRightPosterior: 4,
      
      abdomenLeftAnterior: 4,
      abdomenRightAnterior: 4,
      abdomenLeftPosterior: 4,
      abdomenRightPosterior: 4,
      
      rightHandAnterior: 1.5,
      rightForearmAnterior: 1.5,
      rightUpperArmAnterior: 1.5,
      rightHandPosterior: 1.5,
      rightForearmPosterior: 1.5,
      rightUpperArmPosterior: 1.5,
      rightArmAnterior: 0,
      rightArmPosterior: 0,
      
      leftHandAnterior: 1.5,
      leftForearmAnterior: 1.5,
      leftUpperArmAnterior: 1.5,
      leftHandPosterior: 1.5,
      leftForearmPosterior: 1.5,
      leftUpperArmPosterior: 1.5,
      leftArmAnterior: 0,
      leftArmPosterior: 0,
      
      rightFootAnterior: 1.5,
      rightLowerLegAnterior: 2.5,
      rightThighAnterior: 3.5,
      rightFootPosterior: 1.5,
      rightLowerLegPosterior: 2.5,
      rightThighPosterior: 3.5,
      rightLegAnterior: 0,
      rightLegPosterior: 0,
      
      leftFootAnterior: 1.5,
      leftLowerLegAnterior: 2.5,
      leftThighAnterior: 3.5,
      leftFootPosterior: 1.5,
      leftLowerLegPosterior: 2.5,
      leftThighPosterior: 3.5,
      leftLegAnterior: 0,
      leftLegPosterior: 0,
      
      genitalAnterior: 0,
      genitalPosterior: 0,
    };
  }
  
  if (ageYears < 10) {
    // Age 5-9 years - larger leg proportions
    return {
      headLeftAnterior: 4.5,
      headRightAnterior: 4.5,
      headLeftPosterior: 4.5,
      headRightPosterior: 4.5,
      headAnterior: 0,
      headPosterior: 0,
      
      torsoLeftAnterior: 4.25,
      torsoRightAnterior: 4.25,
      torsoLeftPosterior: 4.25,
      torsoRightPosterior: 4.25,
      
      abdomenLeftAnterior: 4.25,
      abdomenRightAnterior: 4.25,
      abdomenLeftPosterior: 4.25,
      abdomenRightPosterior: 4.25,
      
      rightHandAnterior: 1.5,
      rightForearmAnterior: 1.5,
      rightUpperArmAnterior: 1.5,
      rightHandPosterior: 1.5,
      rightForearmPosterior: 1.5,
      rightUpperArmPosterior: 1.5,
      rightArmAnterior: 0,
      rightArmPosterior: 0,
      
      leftHandAnterior: 1.5,
      leftForearmAnterior: 1.5,
      leftUpperArmAnterior: 1.5,
      leftHandPosterior: 1.5,
      leftForearmPosterior: 1.5,
      leftUpperArmPosterior: 1.5,
      leftArmAnterior: 0,
      leftArmPosterior: 0,
      
      rightFootAnterior: 1.5,
      rightLowerLegAnterior: 2.5,
      rightThighAnterior: 3.5,
      rightFootPosterior: 1.5,
      rightLowerLegPosterior: 2.5,
      rightThighPosterior: 3.5,
      rightLegAnterior: 0,
      rightLegPosterior: 0,
      
      leftFootAnterior: 1.5,
      leftLowerLegAnterior: 2.5,
      leftThighAnterior: 3.5,
      leftFootPosterior: 1.5,
      leftLowerLegPosterior: 2.5,
      leftThighPosterior: 3.5,
      leftLegAnterior: 0,
      leftLegPosterior: 0,
      
      genitalAnterior: 0,
      genitalPosterior: 0,
    };
  }
  
  if (ageYears < 15) {
    // Age 10-14 years - uses subdivisions like children but with adult proportions
    return {
      headLeftAnterior: 0,
      headRightAnterior: 0,
      headLeftPosterior: 0,
      headRightPosterior: 0,
      headAnterior: 4.5,
      headPosterior: 4.5,
      
      torsoLeftAnterior: 4.5,
      torsoRightAnterior: 4.5,
      torsoLeftPosterior: 4.5,
      torsoRightPosterior: 4.5,
      
      abdomenLeftAnterior: 4.5,
      abdomenRightAnterior: 4.5,
      abdomenLeftPosterior: 4.5,
      abdomenRightPosterior: 4.5,
      
      rightHandAnterior: 1.5,
      rightForearmAnterior: 1.5,
      rightUpperArmAnterior: 1.5,
      rightHandPosterior: 1.5,
      rightForearmPosterior: 1.5,
      rightUpperArmPosterior: 1.5,
      rightArmAnterior: 0,
      rightArmPosterior: 0,
      
      leftHandAnterior: 1.5,
      leftForearmAnterior: 1.5,
      leftUpperArmAnterior: 1.5,
      leftHandPosterior: 1.5,
      leftForearmPosterior: 1.5,
      leftUpperArmPosterior: 1.5,
      leftArmAnterior: 0,
      leftArmPosterior: 0,
      
      rightFootAnterior: 1.5,
      rightLowerLegAnterior: 3,
      rightThighAnterior: 4.5,
      rightFootPosterior: 1.5,
      rightLowerLegPosterior: 3,
      rightThighPosterior: 4.5,
      rightLegAnterior: 0,
      rightLegPosterior: 0,
      
      leftFootAnterior: 1.5,
      leftLowerLegAnterior: 3,
      leftThighAnterior: 4.5,
      leftFootPosterior: 1.5,
      leftLowerLegPosterior: 3,
      leftThighPosterior: 4.5,
      leftLegAnterior: 0,
      leftLegPosterior: 0,
      
      genitalAnterior: 0,
      genitalPosterior: 0,
    };
  }
  
  // 15+ years (adult) - same as 10-14 years
  return {
    headLeftAnterior: 0,
    headRightAnterior: 0,
    headLeftPosterior: 0,
    headRightPosterior: 0,
    headAnterior: 4.5,
    headPosterior: 4.5,
    
    torsoLeftAnterior: 4.5,
    torsoRightAnterior: 4.5,
    torsoLeftPosterior: 4.5,
    torsoRightPosterior: 4.5,
    
    abdomenLeftAnterior: 4.5,
    abdomenRightAnterior: 4.5,
    abdomenLeftPosterior: 4.5,
    abdomenRightPosterior: 4.5,
    
    rightHandAnterior: 1.5,
    rightForearmAnterior: 1.5,
    rightUpperArmAnterior: 1.5,
    rightHandPosterior: 1.5,
    rightForearmPosterior: 1.5,
    rightUpperArmPosterior: 1.5,
    rightArmAnterior: 0,
    rightArmPosterior: 0,
    
    leftHandAnterior: 1.5,
    leftForearmAnterior: 1.5,
    leftUpperArmAnterior: 1.5,
    leftHandPosterior: 1.5,
    leftForearmPosterior: 1.5,
    leftUpperArmPosterior: 1.5,
    leftArmAnterior: 0,
    leftArmPosterior: 0,
    
    rightFootAnterior: 1.5,
    rightLowerLegAnterior: 3,
    rightThighAnterior: 4.5,
    rightFootPosterior: 1.5,
    rightLowerLegPosterior: 3,
    rightThighPosterior: 4.5,
    rightLegAnterior: 0,
    rightLegPosterior: 0,
    
    leftFootAnterior: 1.5,
    leftLowerLegAnterior: 3,
    leftThighAnterior: 4.5,
    leftFootPosterior: 1.5,
    leftLowerLegPosterior: 3,
    leftThighPosterior: 4.5,
    leftLegAnterior: 0,
    leftLegPosterior: 0,
    
    genitalAnterior: 0,
    genitalPosterior: 0,
  };
}

export function getDefaultBodyAreas(ageYears: number) {
  const percentages = getLundBrowderPercentages(ageYears);
  
  return {
    headLeftAnterior: percentages.headLeftAnterior,
    headRightAnterior: percentages.headRightAnterior,
    headLeftPosterior: percentages.headLeftPosterior,
    headRightPosterior: percentages.headRightPosterior,
    headAnterior: percentages.headAnterior,
    headPosterior: percentages.headPosterior,
    
    torsoLeftAnterior: percentages.torsoLeftAnterior,
    torsoRightAnterior: percentages.torsoRightAnterior,
    torsoLeftPosterior: percentages.torsoLeftPosterior,
    torsoRightPosterior: percentages.torsoRightPosterior,
    
    abdomenLeftAnterior: percentages.abdomenLeftAnterior,
    abdomenRightAnterior: percentages.abdomenRightAnterior,
    abdomenLeftPosterior: percentages.abdomenLeftPosterior,
    abdomenRightPosterior: percentages.abdomenRightPosterior,
    
    rightHandAnterior: percentages.rightHandAnterior,
    rightForearmAnterior: percentages.rightForearmAnterior,
    rightUpperArmAnterior: percentages.rightUpperArmAnterior,
    rightHandPosterior: percentages.rightHandPosterior,
    rightForearmPosterior: percentages.rightForearmPosterior,
    rightUpperArmPosterior: percentages.rightUpperArmPosterior,
    rightArmAnterior: percentages.rightArmAnterior,
    rightArmPosterior: percentages.rightArmPosterior,
    
    leftHandAnterior: percentages.leftHandAnterior,
    leftForearmAnterior: percentages.leftForearmAnterior,
    leftUpperArmAnterior: percentages.leftUpperArmAnterior,
    leftHandPosterior: percentages.leftHandPosterior,
    leftForearmPosterior: percentages.leftForearmPosterior,
    leftUpperArmPosterior: percentages.leftUpperArmPosterior,
    leftArmAnterior: percentages.leftArmAnterior,
    leftArmPosterior: percentages.leftArmPosterior,
    
    rightFootAnterior: percentages.rightFootAnterior,
    rightLowerLegAnterior: percentages.rightLowerLegAnterior,
    rightThighAnterior: percentages.rightThighAnterior,
    rightFootPosterior: percentages.rightFootPosterior,
    rightLowerLegPosterior: percentages.rightLowerLegPosterior,
    rightThighPosterior: percentages.rightThighPosterior,
    rightLegAnterior: percentages.rightLegAnterior,
    rightLegPosterior: percentages.rightLegPosterior,
    
    leftFootAnterior: percentages.leftFootAnterior,
    leftLowerLegAnterior: percentages.leftLowerLegAnterior,
    leftThighAnterior: percentages.leftThighAnterior,
    leftFootPosterior: percentages.leftFootPosterior,
    leftLowerLegPosterior: percentages.leftLowerLegPosterior,
    leftThighPosterior: percentages.leftThighPosterior,
    leftLegAnterior: percentages.leftLegAnterior,
    leftLegPosterior: percentages.leftLegPosterior,
    
    genitalAnterior: percentages.genitalAnterior,
    genitalPosterior: percentages.genitalPosterior,
  };
}
