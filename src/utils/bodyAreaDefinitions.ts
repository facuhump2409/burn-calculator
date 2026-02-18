export type BodyAreaDefinition = {
  label: string;
  maxValue: number;
  color: string;
  side: 'front' | 'back';
  includeInUI?: boolean;
};

export const adultAreaDefinitions: Record<string, BodyAreaDefinition> = {
  headAnterior: { label: 'Cabeza Anterior', maxValue: 4.5, color: '#fca5a5', side: 'front' },
  headPosterior: { label: 'Cabeza Posterior', maxValue: 4.5, color: '#fca5a5', side: 'back' },
  torsoLeftAnterior: { label: 'Tórax Izq. Anterior', maxValue: 4.5, color: '#fbbf24', side: 'front' },
  torsoRightAnterior: { label: 'Tórax Der. Anterior', maxValue: 4.5, color: '#fbbf24', side: 'front' },
  torsoLeftPosterior: { label: 'Tórax Izq. Posterior', maxValue: 4.5, color: '#f97316', side: 'back' },
  torsoRightPosterior: { label: 'Tórax Der. Posterior', maxValue: 4.5, color: '#f97316', side: 'back' },
  abdomenLeftAnterior: { label: 'Abdomen Izq. Anterior', maxValue: 4.5, color: '#fbbf24', side: 'front' },
  abdomenRightAnterior: { label: 'Abdomen Der. Anterior', maxValue: 4.5, color: '#fbbf24', side: 'front' },
  abdomenLeftPosterior: { label: 'Abdomen Izq. Posterior', maxValue: 4.5, color: '#f97316', side: 'back' },
  abdomenRightPosterior: { label: 'Abdomen Der. Posterior', maxValue: 4.5, color: '#f97316', side: 'back' },

  rightHandAnterior: { label: 'Mano Der. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  rightForearmAnterior: { label: 'Antebrazo Der. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  rightUpperArmAnterior: { label: 'Brazo Der. Sup. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  rightHandPosterior: { label: 'Mano Der. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },
  rightForearmPosterior: { label: 'Antebrazo Der. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },
  rightUpperArmPosterior: { label: 'Brazo Der. Sup. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },

  leftHandAnterior: { label: 'Mano Izq. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  leftForearmAnterior: { label: 'Antebrazo Izq. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  leftUpperArmAnterior: { label: 'Brazo Izq. Sup. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  leftHandPosterior: { label: 'Mano Izq. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },
  leftForearmPosterior: { label: 'Antebrazo Izq. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },
  leftUpperArmPosterior: { label: 'Brazo Izq. Sup. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },

  rightFootAnterior: { label: 'Pie Der. Anterior', maxValue: 1.5, color: '#34d399', side: 'front' },
  rightLowerLegAnterior: { label: 'Pierna Der. Inf. Anterior', maxValue: 3, color: '#34d399', side: 'front' },
  rightThighAnterior: { label: 'Muslo Der. Anterior', maxValue: 4.5, color: '#34d399', side: 'front' },
  rightFootPosterior: { label: 'Pie Der. Posterior', maxValue: 1.5, color: '#34d399', side: 'back' },
  rightLowerLegPosterior: { label: 'Pierna Der. Inf. Posterior', maxValue: 3, color: '#34d399', side: 'back' },
  rightThighPosterior: { label: 'Muslo Der. Posterior', maxValue: 4.5, color: '#34d399', side: 'back' },

  leftFootAnterior: { label: 'Pie Izq. Anterior', maxValue: 1.5, color: '#34d399', side: 'front' },
  leftLowerLegAnterior: { label: 'Pierna Izq. Inf. Anterior', maxValue: 3, color: '#34d399', side: 'front' },
  leftThighAnterior: { label: 'Muslo Izq. Anterior', maxValue: 4.5, color: '#34d399', side: 'front' },
  leftFootPosterior: { label: 'Pie Izq. Posterior', maxValue: 1.5, color: '#34d399', side: 'back' },
  leftLowerLegPosterior: { label: 'Pierna Izq. Inf. Posterior', maxValue: 3, color: '#34d399', side: 'back' },
  leftThighPosterior: { label: 'Muslo Izq. Posterior', maxValue: 4.5, color: '#34d399', side: 'back' },

  genitalAnterior: { label: 'Genitales Anterior', maxValue: 0.5, color: '#c084fc', side: 'front' },
  genitalPosterior: { label: 'Genitales Posterior', maxValue: 0.5, color: '#c084fc', side: 'back' },
};

export const childAreaDefinitions: Record<string, BodyAreaDefinition> = {
  headLeftAnterior: { label: 'Cabeza Izq. Anterior', maxValue: 4.5, color: '#fca5a5', side: 'front' },
  headRightAnterior: { label: 'Cabeza Der. Anterior', maxValue: 4.5, color: '#fca5a5', side: 'front' },
  headLeftPosterior: { label: 'Cabeza Izq. Posterior', maxValue: 4.5, color: '#fca5a5', side: 'back' },
  headRightPosterior: { label: 'Cabeza Der. Posterior', maxValue: 4.5, color: '#fca5a5', side: 'back' },

  torsoLeftAnterior: { label: 'Tórax Izq. Anterior', maxValue: 4, color: '#fbbf24', side: 'front' },
  torsoRightAnterior: { label: 'Tórax Der. Anterior', maxValue: 4, color: '#fbbf24', side: 'front' },
  torsoLeftPosterior: { label: 'Tórax Izq. Posterior', maxValue: 4, color: '#f97316', side: 'back' },
  torsoRightPosterior: { label: 'Tórax Der. Posterior', maxValue: 4, color: '#f97316', side: 'back' },

  abdomenLeftAnterior: { label: 'Abdomen Izq. Anterior', maxValue: 4, color: '#fbbf24', side: 'front' },
  abdomenRightAnterior: { label: 'Abdomen Der. Anterior', maxValue: 4, color: '#fbbf24', side: 'front' },
  abdomenLeftPosterior: { label: 'Abdomen Izq. Posterior', maxValue: 4, color: '#f97316', side: 'back' },
  abdomenRightPosterior: { label: 'Abdomen Der. Posterior', maxValue: 4, color: '#f97316', side: 'back' },

  rightHandAnterior: { label: 'Mano Der. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  rightForearmAnterior: { label: 'Antebrazo Der. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  rightUpperArmAnterior: { label: 'Brazo Der. Sup. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  rightHandPosterior: { label: 'Mano Der. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },
  rightForearmPosterior: { label: 'Antebrazo Der. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },
  rightUpperArmPosterior: { label: 'Brazo Der. Sup. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },

  leftHandAnterior: { label: 'Mano Izq. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  leftForearmAnterior: { label: 'Antebrazo Izq. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  leftUpperArmAnterior: { label: 'Brazo Izq. Sup. Anterior', maxValue: 1.5, color: '#60a5fa', side: 'front' },
  leftHandPosterior: { label: 'Mano Izq. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },
  leftForearmPosterior: { label: 'Antebrazo Izq. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },
  leftUpperArmPosterior: { label: 'Brazo Izq. Sup. Posterior', maxValue: 1.5, color: '#60a5fa', side: 'back' },

  rightFootAnterior: { label: 'Pie Der. Anterior', maxValue: 1.5, color: '#34d399', side: 'front' },
  rightLowerLegAnterior: { label: 'Pierna Der. Inf. Anterior', maxValue: 2.5, color: '#34d399', side: 'front' },
  rightThighAnterior: { label: 'Muslo Der. Anterior', maxValue: 3.5, color: '#34d399', side: 'front' },
  rightFootPosterior: { label: 'Pie Der. Posterior', maxValue: 1.5, color: '#34d399', side: 'back' },
  rightLowerLegPosterior: { label: 'Pierna Der. Inf. Posterior', maxValue: 2.5, color: '#34d399', side: 'back' },
  rightThighPosterior: { label: 'Muslo Der. Posterior', maxValue: 3.5, color: '#34d399', side: 'back' },

  leftFootAnterior: { label: 'Pie Izq. Anterior', maxValue: 1.5, color: '#34d399', side: 'front' },
  leftLowerLegAnterior: { label: 'Pierna Izq. Inf. Anterior', maxValue: 2.5, color: '#34d399', side: 'front' },
  leftThighAnterior: { label: 'Muslo Izq. Anterior', maxValue: 3.5, color: '#34d399', side: 'front' },
  leftFootPosterior: { label: 'Pie Izq. Posterior', maxValue: 1.5, color: '#34d399', side: 'back' },
  leftLowerLegPosterior: { label: 'Pierna Izq. Inf. Posterior', maxValue: 2.5, color: '#34d399', side: 'back' },
  leftThighPosterior: { label: 'Muslo Izq. Posterior', maxValue: 3.5, color: '#34d399', side: 'back' },

  genitalAnterior: { label: 'Genitales Anterior', maxValue: 1, color: '#c084fc', side: 'front' },
  genitalPosterior: { label: 'Genitales Posterior', maxValue: 1, color: '#c084fc', side: 'back' },
};
