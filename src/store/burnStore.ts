import { create } from 'zustand';

export interface BurnData {
  age: number;
  weight: number;
  accidentTime: string;
  location: string;
  servicio: string;
  bodyAreas: {
    head: number;
    torsoAnterior: number;
    torsoPosterior: number;
    abdomenAnterior: number;
    abdomenPosterior: number;
    rightArm: number;
    leftArm: number;
    rightArmAnterior: number;
    leftArmAnterior: number;
    rightArmPosterior: number;
    leftArmPosterior: number;
    rightLeg: number;
    leftLeg: number;
    rightLegAnterior: number;
    leftLegAnterior: number;
    rightLegPosterior: number;
    leftLegPosterior: number;
    genitals: number;
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
    head: 0,
    torsoAnterior: 0,
    torsoPosterior: 0,
    abdomenAnterior: 0,
    abdomenPosterior: 0,
    rightArm: 0,
    leftArm: 0,
    rightArmAnterior: 0,
    leftArmAnterior: 0,
    rightArmPosterior: 0,
    leftArmPosterior: 0,
    rightLeg: 0,
    leftLeg: 0,
    rightLegAnterior: 0,
    leftLegAnterior: 0,
    rightLegPosterior: 0,
    leftLegPosterior: 0,
    genitals: 0,
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
    return Object.values(data.bodyAreas).reduce((sum, val) => sum + val, 0);
  },

  reset: () => {
    set({ data: initialData });
  },
}));
