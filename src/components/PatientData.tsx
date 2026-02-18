import React, { useEffect, useRef } from 'react';
import { useBurnStore } from '../store/burnStore';
import { getDefaultBodyAreas } from '../utils/calculations';

interface PatientDataProps {
  onNext: () => void;
}

export const PatientData: React.FC<PatientDataProps> = ({ onNext }) => {
  const { data, updateData } = useBurnStore();
  const prevAgeRef = useRef<number>(data.age);

  // Set default time to current time on first load
  useEffect(() => {
    if (!data.accidentTime) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      updateData({ accidentTime: `${hours}:${minutes}` });
    }
  }, []);

  // Reset body areas when age crosses the 10-year threshold
  useEffect(() => {
    const prevAge = prevAgeRef.current;
    const wasChild = prevAge < 10;
    const isChild = data.age < 10;
    
    // If age crossed the threshold, reset body areas to 0 to avoid auto-filling max values
    if (wasChild !== isChild && data.age > 0) {
      const empty = getDefaultBodyAreas(data.age);
      Object.keys(empty).forEach((key) => {
        (empty as Record<string, number>)[key] = 0;
      });
      updateData({
        bodyAreas: empty,
        estimatedBSA: 0,
      });
    }
    
    prevAgeRef.current = data.age;
  }, [data.age, updateData]);

  const handleInputChange = (field: string, value: string | number) => {
    updateData({ [field]: value } as Partial<typeof data>);
  };

  const handleTimeChange = (value: string) => {
    // Only keep HH:MM format
    handleInputChange('accidentTime', value.substring(0, 5));
  };

  const isFormValid = data.age > 0 && data.weight > 0 && data.accidentTime;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos del Paciente</h2>

      <div className="space-y-4 mb-6">
        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edad (años) *
          </label>
          <input
            type="number"
            min="0"
            max="120"
            value={data.age || ''}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingresa la edad"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg) *
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={data.weight || ''}
            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingresa el peso"
          />
        </div>

        {/* Accident Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora del Accidente (HH:MM) *
          </label>
          <input
            type="time"
            value={data.accidentTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lugar del Accidente
          </label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Hogar, Escuela, Trabajo"
          />
        </div>

        {/* Hospital Service */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Servicio del Hospital
          </label>
          <input
            type="text"
            value={data.servicio}
            onChange={(e) => handleInputChange('servicio', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Urgencias, Quemados, Pediatría"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-xs text-gray-600">
          <strong>Nota:</strong> Los campos marcados con * son obligatorios.
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={!isFormValid}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          isFormValid
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continuar al Mapa de Quemaduras
      </button>
    </div>
  );
};
