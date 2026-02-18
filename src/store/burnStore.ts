import { create } from 'zustand';

export interface BurnData {
  age: number;
  weight: number;
  accidentTime: string;
  location: string;
  servicio: string;
  bodyAreas: {
    // Head subdivisions (for children < 10)
    headLeftAnterior: number;
    headRightAnterior: number;
    headLeftPosterior: number;
    headRightPosterior: number;
    // For adults, use combined head areas
    headAnterior: number;
    headPosterior: number;
    
    // Torso subdivisions
    torsoLeftAnterior: number;
    torsoRightAnterior: number;
    torsoLeftPosterior: number;
    torsoRightPosterior: number;
    
    // Abdomen subdivisions
    abdomenLeftAnterior: number;
    abdomenRightAnterior: number;
    abdomenLeftPosterior: number;
    abdomenRightPosterior: number;
    
    // Right arm subdivisions (for children < 10)
    rightHandAnterior: number;
    rightForearmAnterior: number;
    rightUpperArmAnterior: number;
    rightHandPosterior: number;
    rightForearmPosterior: number;
    rightUpperArmPosterior: number;
    // For adults, use combined arm areas
    rightArmAnterior: number;
    rightArmPosterior: number;
    
    // Left arm subdivisions (for children < 10)
    leftHandAnterior: number;
    leftForearmAnterior: number;
    leftUpperArmAnterior: number;
    leftHandPosterior: number;
    leftForearmPosterior: number;
    leftUpperArmPosterior: number;
    // For adults, use combined arm areas
    leftArmAnterior: number;
    leftArmPosterior: number;
    
    // Right leg subdivisions (for children < 10)
    rightFootAnterior: number;
    rightLowerLegAnterior: number;
    rightThighAnterior: number;
    rightFootPosterior: number;
    rightLowerLegPosterior: number;
    rightThighPosterior: number;
    // For adults, use combined leg areas
    rightLegAnterior: number;
    rightLegPosterior: number;
    
    // Left leg subdivisions (for children < 10)
    leftFootAnterior: number;
    leftLowerLegAnterior: number;
    leftThighAnterior: number;
    leftFootPosterior: number;
    leftLowerLegPosterior: number;
    leftThighPosterior: number;
    // For adults, use combined leg areas
    leftLegAnterior: number;
    leftLegPosterior: number;
    
    // Genitals
    genitalAnterior: number;
    genitalPosterior: number;
  };
  estimatedBSA: number;
}

interface BurnStore {
  data: BurnData;
  updateData: (updates: Partial<BurnData>) => void;
  updateBodyArea: (area: keyof BurnData['bodyAreas'], value: number) => void;
  calculateBSA: () => number;
  reset: () => void;
}

const initialData: BurnData = {
  age: 0,
  weight: 0,
  accidentTime: '',
  location: '',
  servicio: '',
  bodyAreas: {
    // Head subdivisions
    headLeftAnterior: 0,
    headRightAnterior: 0,
    headLeftPosterior: 0,
    headRightPosterior: 0,
    headAnterior: 0,
    headPosterior: 0,
    
    // Torso subdivisions
    torsoLeftAnterior: 0,
    torsoRightAnterior: 0,
    torsoLeftPosterior: 0,
    torsoRightPosterior: 0,
    
    // Abdomen subdivisions
    abdomenLeftAnterior: 0,
    abdomenRightAnterior: 0,
    abdomenLeftPosterior: 0,
    abdomenRightPosterior: 0,
    
    // Right arm subdivisions
    rightHandAnterior: 0,
    rightForearmAnterior: 0,
    rightUpperArmAnterior: 0,
    rightHandPosterior: 0,
    rightForearmPosterior: 0,
    rightUpperArmPosterior: 0,
    rightArmAnterior: 0,
    rightArmPosterior: 0,
    
    // Left arm subdivisions
    leftHandAnterior: 0,
    leftForearmAnterior: 0,
    leftUpperArmAnterior: 0,
    leftHandPosterior: 0,
    leftForearmPosterior: 0,
    leftUpperArmPosterior: 0,
    leftArmAnterior: 0,
    leftArmPosterior: 0,
    
    // Right leg subdivisions
    rightFootAnterior: 0,
    rightLowerLegAnterior: 0,
    rightThighAnterior: 0,
    rightFootPosterior: 0,
    rightLowerLegPosterior: 0,
    rightThighPosterior: 0,
    rightLegAnterior: 0,
    rightLegPosterior: 0,
    
    // Left leg subdivisions
    leftFootAnterior: 0,
    leftLowerLegAnterior: 0,
    leftThighAnterior: 0,
    leftFootPosterior: 0,
    leftLowerLegPosterior: 0,
    leftThighPosterior: 0,
    leftLegAnterior: 0,
    leftLegPosterior: 0,
    
    // Genitals
    genitalAnterior: 0,
    genitalPosterior: 0,
  },
  estimatedBSA: 0,
};

export const useBurnStore = create<BurnStore>((set, get) => ({
  data: initialData,
  
  updateData: (updates) => {
    set((state) => ({
      data: { ...state.data, ...updates },
    }));
  },

  updateBodyArea: (area, value) => {
    set((state) => ({
      data: {
        ...state.data,
        bodyAreas: {
          ...state.data.bodyAreas,
          [area]: value,
        },
      },
    }));
  },

  calculateBSA: () => {
    const { data } = get();
    const isChild = data.age < 10;
    const areas = data.bodyAreas;
    
    // Sum only the relevant areas based on age
    let total = 0;
    
    // Head: use child subdivisions OR adult single area
    if (isChild) {
      total += areas.headLeftAnterior + areas.headRightAnterior + areas.headLeftPosterior + areas.headRightPosterior;
    } else {
      total += areas.headAnterior + areas.headPosterior;
    }
    
    // Torso and abdomen (always subdivided)
    total += areas.torsoLeftAnterior + areas.torsoRightAnterior + areas.torsoLeftPosterior + areas.torsoRightPosterior;
    total += areas.abdomenLeftAnterior + areas.abdomenRightAnterior + areas.abdomenLeftPosterior + areas.abdomenRightPosterior;
    
    // Arms (always subdivided)
    total += areas.rightHandAnterior + areas.rightForearmAnterior + areas.rightUpperArmAnterior;
    total += areas.rightHandPosterior + areas.rightForearmPosterior + areas.rightUpperArmPosterior;
    total += areas.leftHandAnterior + areas.leftForearmAnterior + areas.leftUpperArmAnterior;
    total += areas.leftHandPosterior + areas.leftForearmPosterior + areas.leftUpperArmPosterior;
    
    // Legs (always subdivided)
    total += areas.rightFootAnterior + areas.rightLowerLegAnterior + areas.rightThighAnterior;
    total += areas.rightFootPosterior + areas.rightLowerLegPosterior + areas.rightThighPosterior;
    total += areas.leftFootAnterior + areas.leftLowerLegAnterior + areas.leftThighAnterior;
    total += areas.leftFootPosterior + areas.leftLowerLegPosterior + areas.leftThighPosterior;

    total += areas.genitalAnterior + areas.genitalPosterior;
    
    return total;
  },

  reset: () => {
    set({ data: initialData });
  },
}));
